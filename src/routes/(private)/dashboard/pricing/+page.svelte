<script lang="ts">
    import Pricing from '$lib/components/home/Pricing.svelte';
    import { loadStripe } from '@stripe/stripe-js';
    import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from "$env/static/public";
    import { fade } from 'svelte/transition';
    import { invalidateAll } from '$app/navigation';
    import { page } from '$app/state';

    import { Elements, PaymentElement } from 'svelte-stripe';

    let { data } = $props();

    let localPlan = $state<string | null>(null);
    let activePlan = $derived(localPlan || data.subscription?.plan_id || 'free');

    let clientSecret = $state<string | null>(null);
    let currentSubscriptionId = $state<string | null>(null);
    let pendingPriceId = $state<string | null>(null);
    let stripeInstance = $state<any>(null);

    let isYearly = $state(false);
    let isLoading = $state(false);
    let isProcessingPayment = $state(false);
    let paymentSuccess = $state(false);
    let paymentError = $state<string | null>(null);

    // If Stripe redirects us after successful 3DS Authentication, we need to automatically verify!
    $effect(() => {
        const verifySubId = page.url.searchParams.get('verify_sub_id');
        const redirectStatus = page.url.searchParams.get('redirect_status');
        
        if (verifySubId && redirectStatus === 'succeeded' && !paymentSuccess) {
            paymentSuccess = true;
            isLoading = true;
            
            // Wipe clean url to avoid duplicate trigger
            const cleanUrl = new URL(window.location.href);
            cleanUrl.searchParams.delete('verify_sub_id');
            cleanUrl.searchParams.delete('redirect_status');
            cleanUrl.searchParams.delete('payment_intent_client_secret');
            cleanUrl.searchParams.delete('payment_intent');
            window.history.replaceState({}, '', cleanUrl.toString());

            // Fire verification!
            fetch('/api/stripe/verify-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriptionId: verifySubId })
            }).then(async (res) => {
                await invalidateAll();
                setTimeout(() => {
                    paymentSuccess = false;
                    isLoading = false;
                }, 3000);
            });
        }
    });

    $effect(() => {
        loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY).then((stripe) => {
            stripeInstance = stripe;
        });
    });

    // This handles intercepting the "Upgrade" clicks from the Pricing grid and initiating Checkout directly on this page
    async function handleUpgradeRequest(priceId: string) {
        pendingPriceId = priceId;

        if (priceId === 'free') {
            const confirmed = confirm("Are you sure you want to cancel your plan?");
            if (!confirmed) return;
            
            isLoading = true;
            try {
                const response = await fetch('/api/stripe/cancel-subscription', {
                    method: 'POST'
                });
                const resData = await response.json();
                
                if (resData.success) {
                    localPlan = 'free'; // Instant UI feedback!
                    await invalidateAll();
                    localPlan = null; 
                } else {
                    alert(resData.error || 'Failed to cancel plan.');
                }
            } catch (err) {
                console.error('Cancel error:', err);
                alert('An error occurred while canceling the plan.');
            } finally {
                isLoading = false;
            }
            return;
        }

        isLoading = true;
        
        try {
            // Check if user already has an active plan
            const isUpgradeExisting = data.subscription?.status === 'active' && data.subscription?.plan_id !== 'free';
            const endpoint = isUpgradeExisting ? '/api/stripe/upgrade' : '/api/stripe/create-subscription';
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId })
            });
            const resData = await response.json();

            if (isUpgradeExisting) {
                 if (resData.success) {
                    localPlan = priceId; // Instant UI feedback!
                    alert('Plan changed successfully! Your next invoice has been adjusted.');
                    await invalidateAll();
                    localPlan = null;
                    isLoading = false;
                } else {
                    alert(resData.error || 'Failed to upgrade plan.');
                    isLoading = false;
                }
            } else {
                if (resData.clientSecret) {
                    clientSecret = resData.clientSecret;
                    currentSubscriptionId = resData.subscriptionId;
                } else {
                    alert(resData.error || 'Failed to initialize checkout');
                    isLoading = false;
                }
            }
        } catch (err) {
            console.error('Upgrade error:', err);
            isLoading = false;
        }
    }

    // Explicit Action so we bind exactly when the div is formed in the DOM
    let elementsInstance = $state<any>();

    async function submitPayment(e: Event) {
        e.preventDefault();
        
        if (!stripeInstance || !elementsInstance) return;
        
        isProcessingPayment = true;
        paymentError = null;

        try {
            const stripe = stripeInstance;
            
            // confirmPayment will automatically follow the return_url on success
            const { error: submitError } = await elementsInstance.submit();
            if (submitError) {
                paymentError = submitError.message;
                isProcessingPayment = false;
                return;
            }
            
            // We request the confirmPayment but WITHOUT automatic redirect if possible
            // Appending verify_sub_id so that if Stripe forces a redirect, the component catches it on reload 
            const returnUrl = new URL(`${window.location.origin}/dashboard/pricing`);
            returnUrl.searchParams.set('verify_sub_id', currentSubscriptionId || '');
            
            const result = await stripe.confirmPayment({
                elements: elementsInstance,
                confirmParams: {
                    return_url: returnUrl.toString(),
                },
                redirect: 'if_required' 
            });

            console.log('[CLIENT] Stripe confirmPayment Result:', result);

            if (result.error) {
                paymentError = result.error.message;
                console.error("[CLIENT] Payment confirmation failed:", result.error);
            } else {
                // Payment succeeded directly or handles setups
                console.log('[CLIENT] Payment Intent Succeeded! Processing verification for SubID:', currentSubscriptionId);
                paymentSuccess = true;
                
                // Immediately synchronize state with backend
                if (currentSubscriptionId) {
                     console.log('[CLIENT] Verify fetch executing...');
                     const verificationResponse = await fetch('/api/stripe/verify-subscription', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({ subscriptionId: currentSubscriptionId })
                     });
                     
                     const verificationResult = await verificationResponse.json();
                     console.log('[CLIENT] Verify fetch result:', verificationResult);
                     
                     // Instant positive UI state override
                     if (pendingPriceId) {
                         localPlan = pendingPriceId;
                     }

                     // Invalidate layout data across the whole app to seamlessly sync layout
                     await invalidateAll();
                     localPlan = null;
                     
                     // Show success state briefly then close
                     setTimeout(() => {
                         clientSecret = null;
                         currentSubscriptionId = null;
                         paymentSuccess = false;
                         pendingPriceId = null;
                     }, 3000);
                } else {
                    console.error('[CLIENT] currentSubscriptionId is magically null!?');
                }
            }
        } catch (err: any) {
             paymentError = err.message || "An unexpected error occurred.";
             console.error("Payment error:", err);
        } finally {
             isProcessingPayment = false;
        }
    }
</script>

<div class="max-w-5xl mx-auto py-8">
    <div class="mb-8">
        <h1 class="text-4xl font-serif font-bold text-[#1a232e]">Plan & Billing</h1>
        <p class="text-gray-500 mt-2">Manage your subscription, upgrade your limits, and view billing history.</p>
    </div>

    <!-- If we have a client secret, show checkout instead of pricing grid -->
    {#if clientSecret}
        <div class="bg-white rounded-2xl shadow-xl w-full p-4 relative" transition:fade>
            <button 
                class="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                onclick={() => {
                    clientSecret = null;
                    currentSubscriptionId = null;
                    pendingPriceId = null;
                    isLoading = false;
                    paymentSuccess = false;
                    paymentError = null;
                }}
                aria-label="Back to Plans"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg> Back
            </button>

            <div class="p-6 pt-12 min-h-[500px] flex justify-center">
                {#if isLoading && !clientSecret}
                    <div class="flex flex-col items-center justify-center text-gray-400 gap-4 absolute inset-0 bg-white/50 backdrop-blur z-20">
                        <svg class="animate-spin h-8 w-8 text-[#1a232e]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span class="text-sm font-medium text-gray-500">Preparing secure checkout...</span>
                    </div>
                {/if}

                {#if stripeInstance && clientSecret}
                    <!-- Premium Customized Stripe Elements Configuration -->
                    <Elements stripe={stripeInstance} {clientSecret} 
                        appearance={{
                            theme: 'stripe',
                            variables: {
                                colorPrimary: '#d4a853',
                                colorBackground: '#ffffff',
                                colorText: '#1a232e',
                                colorDanger: '#df1b41',
                                fontFamily: '"Inter", system-ui, sans-serif',
                                spacingUnit: '4px',
                                borderRadius: '12px',
                                colorTextPlaceholder: '#9ca3af',
                                colorIcon: '#6b7280',
                                colorIconTab: '#d4a853',
                            },
                            rules: {
                                '.Input': {
                                    border: '1px solid #e5e7eb',
                                    backgroundColor: '#fdfaf6',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.2s ease',
                                    padding: '12px 14px'
                                },
                                '.Input:focus': {
                                    border: '1px solid #d4a853',
                                    boxShadow: '0 0 0 4px rgba(212, 168, 83, 0.1)',
                                    outline: 'none'
                                },
                                '.Label': {
                                    fontWeight: '600',
                                    color: '#4b5563',
                                    marginBottom: '8px',
                                    fontSize: '0.9rem'
                                },
                                '.Tab': {
                                    border: '1px solid #e5e7eb',
                                    backgroundColor: '#fdfaf6',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                },
                                '.Tab--selected': {
                                    border: '2px solid #d4a853',
                                    boxShadow: '0 4px 6px -1px rgba(212, 168, 83, 0.1)',
                                },
                                '.Block': {
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #f3f4f6',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                }
                            }
                        }} 
                        bind:elements={elementsInstance}
                    >
                        <form onsubmit={submitPayment} class="w-full max-w-md mx-auto relative z-10">
                            <!-- Show loading state over form while component is loading -->
                            <div class="mb-6">
                                <h3 class="text-2xl font-serif font-bold text-[#1a232e] mb-2">Complete Upgrade</h3>
                                <p class="text-gray-500 text-sm">Enter your payment details below to unlock premium library features.</p>
                            </div>

                            {#if paymentSuccess}
                                <div class="p-8 text-center bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center justify-center min-h-[250px] animate-in fade-in zoom-in duration-300">
                                    <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                                    </div>
                                    <h4 class="text-xl font-bold text-green-900 mb-2">Payment Successful!</h4>
                                    <p class="text-green-700 text-sm">Your Atheum limits have been upgraded. Redirecting...</p>
                                </div>
                            {:else}
                                <PaymentElement onready={() => isLoading = false} />

                                {#if paymentError}
                                    <div class="mt-6 p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="shrink-0 mt-0.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                                        <span class="font-medium leading-relaxed">{paymentError}</span>
                                    </div>
                                {/if}

                                <div class="mt-8 flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={isProcessingPayment || !stripeInstance || !elementsInstance}
                                        class=" relative w-full py-4 px-6 rounded-2xl font-bold transition-all disabled:opacity-50 overflow-hidden group {isProcessingPayment ? 'bg-gray-100 text-gray-400 border border-gray-200' : 'bg-[#1a232e] text-[#fdfaf6] hover:bg-black cursor-pointer shadow-xl hover:shadow-[#d4a853]/20 hover:-translate-y-0.5 duration-200 border border-transparent'}"
                                    >
                                        {#if !isProcessingPayment}
                                            <div class="absolute inset-0 bg-linear-to-r from-[#d4a853]/0 via-[#d4a853]/20 to-[#d4a853]/0 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out"></div>
                                        {/if}
                                        
                                        {#if isProcessingPayment}
                                            <div class="flex items-center justify-center gap-3">
                                                <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                <span class="text-gray-600">Processing Securely...</span>
                                            </div>
                                        {:else}
                                            <div class="flex items-center justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-70"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                                                Confirm Payment
                                            </div>
                                        {/if}
                                    </button>
                                </div>
                                <p class="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                    Payments are securely processed by Stripe
                                </p>
                            {/if}
                        </form>
                    </Elements>
                {/if}
            </div>
        </div>
    {:else}
        <!-- Render the full Pricing component natively here! -->
        <!-- Note: We'll modify Pricing component slightly next to accept an 'onUpgrade' callback or handle it natively -->
        <div class="rounded-3xl border border-[#e6e0d4] bg-white overflow-hidden shadow-sm" transition:fade>
            <Pricing isDashboardView={true} onUpgradeRequest={handleUpgradeRequest} currentPlan={activePlan} />
        </div>
    {/if}
</div>
