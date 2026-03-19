<script lang="ts">
    import gsap from "gsap";
    import ScrollTrigger from "gsap/ScrollTrigger";

    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    import { getUserState } from "$lib/state/user-state.svelte";

    let userContext = getUserState();
    let { user } = $derived(userContext);

    let sectionRef = $state<HTMLElement>();
    let headerRef = $state<HTMLElement>();
    let gridRef = $state<HTMLElement>();
    let isYearly = $state(false);

    let { 
        isDashboardView = false, 
        currentPlan = null, 
        onUpgradeRequest = null 
    } = $props<{
        isDashboardView?: boolean, 
        currentPlan?: string | null,
        onUpgradeRequest?: ((priceId: string) => void) | null 
    }>();

    // Mapping from plan name to actual Stripe Price IDs based on interval selection
    import { 
        PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY, 
        PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY, 
        PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY, 
        PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY
    } from "$env/static/public";

    $effect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Header reveal
            if (headerRef) {
                gsap.from(headerRef, {
                    opacity: 0,
                    y: 20,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef,
                        start: "top 90%"
                    }
                });
            }

            // Pricing cards staggered reveal
            if (gridRef) {
                gsap.from(".pricing-card", {
                    opacity: 0,
                    y: 40,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: gridRef,
                        start: "top 80%"
                    }
                });
            }

            // Highlight the "Scholar" card with a subtle pulse/entry
            gsap.to(".popular-card", {
                scale: 1.05,
                duration: 1.5,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".popular-card",
                    start: "top 85%"
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    });
</script>

<section bind:this={sectionRef} class="py-24 bg-[#f5f3f0] overflow-hidden">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div bind:this={headerRef} class="text-center mb-12">
            <div class="inline-flex items-center gap-2 bg-[#1a232e]/8 text-[#1a232e] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-3 h-3" aria-hidden="true">
                    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                    <path d="M20 2v4"></path>
                    <path d="M22 4h-4"></path>
                    <circle cx="4" cy="20" r="2"></circle>
                </svg>Pricing
            </div>
            <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a232e] mb-4">Plans for every reader</h2>
            <p class="text-gray-500 text-base sm:text-lg max-w-xl mx-auto mb-8">Start free. Upgrade when you're ready. No hidden fees — just more books.</p>
            <div class="flex items-center justify-center gap-4 mb-8">
                <span class="text-sm font-medium transition-colors {isYearly ? 'text-gray-400' : 'text-[#1a232e]'}">Monthly</span>
                <button 
                    onclick={() => isYearly = !isYearly}
                    aria-label="Plan Switch" 
                    class="relative w-12 h-6 rounded-full {isYearly ? 'bg-emerald-500' : 'bg-gray-200'} transition-colors focus:outline-none cursor-pointer"
                >
                    <div class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 {isYearly ? 'translate-x-6' : 'translate-x-0'}"></div>
                </button>
                <span class="text-sm font-medium transition-colors {!isYearly ? 'text-gray-400' : 'text-[#1a232e]'}">Yearly <span class="text-emerald-500 text-[10px] font-bold ml-1 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">Save 20%</span></span>
            </div>
        </div>

        <div bind:this={gridRef} class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <!-- Reader Plan -->
            <div class="pricing-card relative rounded-3xl border-2 p-8 flex flex-col bg-white border-[#e6e0d4]">
                <div class="mb-6">
                    <p class="text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Reader</p>
                    <div class="flex items-end gap-1">
                        <span class="font-serif text-4xl sm:text-5xl font-bold text-[#1a232e]">Free</span>
                        <span class="text-sm mb-2 text-gray-500">Forever</span>
                    </div>
                </div>
                <ul class="space-y-3 mb-8 flex-1">
                    <li class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#1a232e]/8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-3 h-3 text-[#1a232e]" aria-hidden="true">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                        </div>
                        <span class="text-sm text-gray-600">Up to 4 books with maximum 300 pages each</span>
                    </li>

                    <!--
                    <li class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#1a232e]/8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-3 h-3 text-[#1a232e]" aria-hidden="true">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                        </div>
                        <span class="text-sm text-gray-600">Grid & list view</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#1a232e]/8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-3 h-3 text-[#1a232e]" aria-hidden="true">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                        </div>
                        <span class="text-sm text-gray-600">Search & filter</span>
                    </li>
                    -->
                </ul>
                <button 
                    onclick={() => {
                        if (isDashboardView) {
                            if (currentPlan === 'free' || !currentPlan) {
                                goto('/library');
                            } else if (onUpgradeRequest) {
                                onUpgradeRequest('free');
                            }
                        } else {
                            goto((page.data.session && user) ? '/library' : '/login');
                        }
                    }}
                    disabled={(currentPlan === 'free' || !currentPlan)}
                    class="w-full py-3 px-6 rounded-2xl font-bold text-sm transition-all {(currentPlan === 'free' || !currentPlan) ? 'bg-emerald-500/10 text-emerald-600' : 'bg-[#f5f3f0] text-[#1a232e] hover:bg-[#ece8e0]'} cursor-pointer disabled:cursor-default"
                >
                    {#if (page.data.session && user)}
                        {(currentPlan === 'free' || !currentPlan) ? 'Current Plan' : 'Switch to Free'}
                    {:else}
                        Start for Free
                    {/if}
                </button>
            </div>

            <!-- Scholar Plan -->
            <div class="pricing-card popular-card relative rounded-3xl border-2 p-8 flex flex-col bg-[#1a232e] border-[#1a232e] shadow-2xl z-10">
                <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-[#1a232e] text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow">Most Popular</div>
                <div class="mb-6">
                    <p class="text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">Scholar</p>
                    <div class="flex items-end gap-1">
                        <span class="font-serif text-4xl sm:text-5xl font-bold text-white">${isYearly ? '76.8' : '8'}</span>
                        <span class="text-sm mb-2 text-gray-400">{isYearly ? 'per year' : 'per month'}</span>
                    </div>
                </div>
                <ul class="space-y-3 mb-8 flex-1">
                    <li class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-3 h-3 text-white" aria-hidden="true">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                        </div>
                        <span class="text-sm text-gray-300">Up to 20 books with maximum 600 pages each</span>
                    </li>
                    <!--
                    <li class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-3 h-3 text-white" aria-hidden="true">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                        </div>
                        <span class="text-sm text-gray-300">Advanced features</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-3 h-3 text-white" aria-hidden="true">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                        </div>
                        <span class="text-sm text-gray-300">Cloud Sync</span>
                    </li>
                    -->
                </ul>
                <button 
                    onclick={() => {
                        if (isDashboardView && onUpgradeRequest) {
                            const priceId = isYearly ? PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY : PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY;
                            onUpgradeRequest(priceId);
                        } else {
                            goto((page.data.session && user) ? '/library' : '/login');
                        }
                    }}
                    disabled={(currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY)}
                    class="w-full py-3 px-6 rounded-2xl font-bold text-sm transition-all {(currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY) ? 'bg-emerald-500/10 text-emerald-600' : 'bg-[#f5f3f0] text-[#1a232e] hover:bg-[#ece8e0]'} cursor-pointer disabled:cursor-default"
                >
                    {#if (page.data.session && user)}
                        {(currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY) ? 'Current Plan' : (currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY) ? 'Downgrade to Scholar' : 'Upgrade to Scholar'}
                    {:else}
                        Subscribe Now
                    {/if}
                </button>
            </div>

            <!-- Librarian Plan -->
            <div class="pricing-card relative rounded-3xl border-2 p-8 flex flex-col bg-white border-[#e6e0d4]">
                <div class="mb-6">
                    <p class="text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Librarian</p>
                    <div class="flex items-end gap-1">
                        <span class="font-serif text-4xl sm:text-5xl font-bold text-[#1a232e]">${isYearly ? '230.4' : '24'}</span>
                        <span class="text-sm mb-2 text-gray-500">{isYearly ? 'per year' : 'per month'}</span>
                    </div>
                </div>
                <ul class="space-y-3 mb-8 flex-1">
                    <li class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#1a232e]/8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-3 h-3 text-[#1a232e]" aria-hidden="true">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                        </div>
                        <span class="text-sm text-gray-600">Unlimited books with unlimited pages each</span>
                    </li>
                    <!--
                    <li class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#1a232e]/8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-3 h-3 text-[#1a232e]" aria-hidden="true">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                        </div>
                        <span class="text-sm text-gray-600">Bulk Import</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#1a232e]/8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-3 h-3 text-[#1a232e]" aria-hidden="true">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                        </div>
                        <span class="text-sm text-gray-600">API Access</span>
                    </li>
                    -->
                </ul>
                <button 
                    onclick={() => {
                        if (isDashboardView && onUpgradeRequest) {
                            const priceId = isYearly ? PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY : PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY;
                            onUpgradeRequest(priceId);
                        } else {
                            goto((page.data.session && user) ? '/library' : '/login');
                        }
                    }}
                    disabled={(currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY)}
                    class="w-full py-3 px-6 rounded-2xl font-bold text-sm transition-all {(currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY) ? 'bg-emerald-500/10 text-emerald-600' : 'bg-[#f5f3f0] text-[#1a232e] hover:bg-[#ece8e0]'} cursor-pointer disabled:cursor-default"
                >
                    {#if (page.data.session && user)}
                        {(currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY) ? 'Current Plan' : 'Upgrade to Librarian'}
                    {:else}
                        Subscribe Now
                    {/if}
                </button>
            </div>
        </div>
    </div>
</section>