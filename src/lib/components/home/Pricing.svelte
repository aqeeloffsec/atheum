<script lang="ts">
    import gsap from "gsap";
    import ScrollTrigger from "gsap/ScrollTrigger";

    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    import { getUserState } from "$lib/state/user-state.svelte";
    import ConfirmSwitchToFreeModal from '$lib/components/library/ConfirmSwitchToFreeModal.svelte';
    import ConfirmDowngradeToScholarModal from '$lib/components/library/ConfirmDowngradeToScholarModal.svelte';

    let userContext = getUserState();
    let { user } = $derived(userContext);

    let sectionRef = $state<HTMLElement>();
    let headerRef = $state<HTMLElement>();
    let gridRef = $state<HTMLElement>();
    let isYearly = $state(false);
    let showConfirmModal = $state(false);
    let showDowngradeToScholarModal = $state(false);

    let {
        isDashboardView = false,
        currentPlan = null,
        onUpgradeRequest = null
    } = $props<{
        isDashboardView?: boolean,
        currentPlan?: string | null,
        onUpgradeRequest?: ((priceId: string) => void) | null
    }>();

    import {
        PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY,
        PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY,
        PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY,
        PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY
    } from "$env/static/public";

    $effect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            if (headerRef) {
                gsap.fromTo(headerRef, { opacity: 0, y: 30 }, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef,
                        start: "top 85%"
                    }
                });
            }

            if (gridRef) {
                gsap.fromTo(".pricing-card", {
                    opacity: 0,
                    y: 60,
                    scale: 0.95
                }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: gridRef,
                        start: "top 75%"
                    }
                });
            }

            gsap.to(".popular-card", {
                y: -15,
                duration: 1.5,
                ease: "back.out(1.4)",
                scrollTrigger: {
                    trigger: ".popular-card",
                    start: "top 80%"
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    });

    function openConfirmModal() { showConfirmModal = true; }
    function closeConfirmModal() { showConfirmModal = false; }
    function handleConfirmSwitchToFree() {
        closeConfirmModal();
        if (onUpgradeRequest) onUpgradeRequest('free');
    }

    function openDowngradeToScholarModal() { showDowngradeToScholarModal = true; }
    function closeDowngradeToScholarModal() { showDowngradeToScholarModal = false; }
    function handleConfirmDowngradeToScholar() {
        closeDowngradeToScholarModal();
        if (onUpgradeRequest) {
            const priceId = isYearly ? PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY : PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY;
            onUpgradeRequest(priceId);
        }
    }
</script>

<section bind:this={sectionRef} class="py-32 bg-[#faf8f4] overflow-hidden relative">
    <!-- Ambient glowing meshes -->
    <div class="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-amber-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
    <div class="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] bg-purple-500/10 rounded-full blur-[130px] pointer-events-none mix-blend-multiply"></div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div bind:this={headerRef} class="text-center mb-20">
            <div class="inline-flex items-center gap-2 bg-white border border-[#1a232e]/5 shadow-sm text-[#1a232e] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Pricing
            </div>
            <h2 class="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a232e] mb-6 tracking-tight">Invest in your intellect.</h2>
            <p class="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-medium">Start free. Upgrade when you want AI super-powers. No hidden fees.</p>
            
            <div class="flex items-center justify-center gap-4 mb-8">
                <span class="text-sm md:text-base font-bold transition-colors {isYearly ? 'text-gray-400' : 'text-[#1a232e]'}">Monthly</span>
                <button 
                    onclick={() => isYearly = !isYearly}
                    aria-label="Plan Switch" 
                    class="relative w-16 h-8 rounded-full {isYearly ? 'bg-linear-to-r from-purple-500 to-amber-500' : 'bg-gray-300'} transition-all duration-300 shadow-inner focus:outline-none cursor-pointer"
                >
                    <div class="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 {isYearly ? 'translate-x-8' : 'translate-x-0'}"></div>
                </button>
                <div class="flex items-center gap-2">
                    <span class="text-sm md:text-base font-bold transition-colors {!isYearly ? 'text-gray-400' : 'text-[#1a232e]'}">Yearly</span>
                    <span class="text-purple-600 bg-purple-100 text-[10px] md:text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm animate-pulse">Save 20%</span>
                </div>
            </div>
        </div>

        <div bind:this={gridRef} class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-md mx-auto md:max-w-none">
            <!-- Reader Plan -->
            <div class="pricing-card relative rounded-[2.5rem] border border-white/60 p-8 lg:p-10 flex flex-col bg-white/60 backdrop-blur-md shadow-xl hover:bg-white hover:-translate-y-1 transition-all duration-300">
                <div class="mb-8">
                    <p class="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500 bg-gray-100 px-3 py-1 inline-block rounded-lg">Reader</p>
                    <div class="flex items-end gap-1 mt-4">
                        <span class="font-serif text-5xl sm:text-6xl font-bold text-[#1a232e] tracking-tight">Free</span>
                    </div>
                    <p class="text-sm mt-3 text-gray-500 font-medium">Forever</p>
                </div>
                <ul class="space-y-4 mb-10 flex-1">
                    <li class="flex items-start gap-4">
                        <div class="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-gray-100 text-[#1a232e]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                        </div>
                        <span class="text-gray-700 font-medium leading-tight">Up to 4 books<br><span class="text-xs text-gray-500">300 pages each</span></span>
                    </li>
                    <li class="flex items-start gap-4">
                        <div class="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-gray-100 text-[#1a232e]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                        </div>
                        <span class="text-gray-700 font-medium leading-tight">1 AI Ebook/mo<br><span class="text-xs text-gray-500">Playbooks, 25 pages</span></span>
                    </li>
                    <li class="flex items-start gap-4">
                        <div class="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-gray-100 text-[#1a232e]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                        </div>
                        <span class="text-gray-700 font-medium leading-tight">Search & Filter Library</span>
                    </li>
                </ul>
                <button
                    onclick={() => {
                        if (isDashboardView) {
                            if (currentPlan === 'free' || !currentPlan) goto('/library');
                            else if (onUpgradeRequest) openConfirmModal();
                        } else goto((page.data.session && user) ? '/library/pricing' : '/login');
                    }}
                    disabled={(currentPlan === 'free' || !currentPlan)}
                    class="w-full py-4 px-6 rounded-xl font-bold text-base transition-all {(currentPlan === 'free' || !currentPlan) ? 'bg-gray-100 text-gray-400' : 'bg-[#1a232e] text-white hover:bg-black shadow-[0_5px_15px_rgba(26,35,46,0.3)]'} cursor-pointer disabled:cursor-default"
                >
                    {#if (page.data.session && user)}
                        {(currentPlan === 'free' || !currentPlan) ? 'Current Plan' : 'Switch to Free'}
                    {:else}
                        Start for Free
                    {/if}
                </button>
            </div>

            <!-- Scholar Plan (Premium Glow) -->
            <div class="pricing-card popular-card relative rounded-[2.5rem] p-[3px] flex flex-col bg-linear-to-br from-indigo-500 via-purple-500 to-amber-500 shadow-[0_20px_50px_rgba(147,51,234,0.3)] z-10">
                <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-purple-200 to-amber-200 text-[#1a232e] text-xs font-extrabold px-6 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path></svg>
                    Most Popular
                </div>
                
                <div class="bg-[#1a232e] rounded-[calc(2.5rem-3px)] p-8 lg:p-10 h-full flex flex-col relative overflow-hidden backdrop-blur-xl">
                    <div class="absolute inset-0 bg-linear-to-b from-purple-500/10 to-transparent pointer-events-none"></div>
                    <div class="relative z-10 mb-8">
                        <p class="text-xs font-bold uppercase tracking-widest mb-3 text-purple-300 bg-purple-900/30 border border-purple-500/30 px-3 py-1 inline-block rounded-lg">Scholar</p>
                        <div class="flex items-end gap-1 mt-4">
                            <span class="font-serif text-5xl sm:text-6xl font-bold text-white tracking-tight">${isYearly ? '76.8' : '8'}</span>
                        </div>
                        <p class="text-sm mt-3 text-purple-200/60 font-medium">{isYearly ? 'per year ($6.4/mo)' : 'per month'}</p>
                    </div>
                    
                    <ul class="space-y-4 mb-10 flex-1 relative z-10">
                        <li class="flex items-start gap-4">
                            <div class="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-purple-500/20 text-purple-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                            </div>
                            <span class="text-indigo-50 font-medium leading-tight">Up to 20 books<br><span class="text-xs text-indigo-200/60">600 pages each</span></span>
                        </li>
                        <li class="flex items-start gap-4 p-2 -ml-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <div class="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-amber-500/20 text-amber-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-4 h-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path></svg>
                            </div>
                            <span class="text-amber-100 font-bold leading-tight drop-shadow">10 AI Ebooks/mo<br><span class="text-xs text-amber-200/80 font-medium">Academic, 300 pages</span></span>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-purple-500/20 text-purple-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                            </div>
                            <span class="text-indigo-50 font-medium leading-tight">Professional PDF Export</span>
                        </li>
                        <li class="flex items-start gap-4">
                            <div class="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-purple-500/20 text-purple-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                            </div>
                            <span class="text-indigo-50 font-medium leading-tight">Pristine AI chapter writing</span>
                        </li>
                    </ul>
                    <button 
                        onclick={() => {
                            if (isDashboardView) {
                                if (currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY) openDowngradeToScholarModal();
                                else if (onUpgradeRequest) {
                                    const priceId = isYearly ? PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY : PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY;
                                    onUpgradeRequest(priceId);
                                }
                            } else goto((page.data.session && user) ? '/library/pricing' : '/login');
                        }}
                        disabled={(currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY)}
                        class="w-full py-4 px-6 rounded-xl font-bold text-base transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed {(currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY) ? 'bg-purple-500/20 text-purple-300' : 'bg-white text-purple-900 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02]'} cursor-pointer"
                    >
                        {#if (currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY)}
                            Current Plan
                        {:else}
                            <div class="absolute inset-0 bg-linear-to-r from-purple-100 to-amber-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span class="relative z-10">Subscribe to Scholar</span>
                        {/if}
                    </button>
                </div>
            </div>

            <!-- Librarian Plan -->
            <div class="pricing-card relative rounded-[2.5rem] border border-white/60 p-8 lg:p-10 flex flex-col bg-white/60 backdrop-blur-md shadow-xl hover:bg-white hover:-translate-y-1 transition-all duration-300">
                <div class="mb-8">
                    <p class="text-xs font-bold uppercase tracking-widest mb-3 text-amber-700 bg-amber-100 px-3 py-1 inline-block rounded-lg">Librarian</p>
                    <div class="flex items-end gap-1 mt-4">
                        <span class="font-serif text-5xl sm:text-6xl font-bold text-[#1a232e] tracking-tight">${isYearly ? '230.4' : '24'}</span>
                    </div>
                    <p class="text-sm mt-3 text-gray-500 font-medium">{isYearly ? 'per year ($19.2/mo)' : 'per month'}</p>
                </div>
                <ul class="space-y-4 mb-10 flex-1">
                    <li class="flex items-start gap-4">
                        <div class="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-gray-800 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                        </div>
                        <span class="text-gray-800 font-bold leading-tight">Unlimited books<br><span class="text-xs text-gray-500 font-medium">Unlimited pages each</span></span>
                    </li>
                    <li class="flex items-start gap-4 p-2 -ml-2 rounded-xl bg-amber-50 border border-amber-200/50">
                        <div class="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path></svg>
                        </div>
                        <span class="text-amber-700 font-bold leading-tight">25 AI Ebooks/mo<br><span class="text-xs text-amber-600/80 font-medium">Any format, 1000 pages</span></span>
                    </li>
                    <li class="flex items-start gap-4">
                        <div class="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-gray-100 text-[#1a232e]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                        </div>
                        <span class="text-gray-700 font-medium leading-tight">Premium typography styling</span>
                    </li>
                    <li class="flex items-start gap-4">
                        <div class="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-gray-100 text-[#1a232e]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                        </div>
                        <span class="text-gray-700 font-medium leading-tight">Save to library in 1 click</span>
                    </li>
                </ul>
                <button 
                    onclick={() => {
                        if (isDashboardView && onUpgradeRequest) {
                            const priceId = isYearly ? PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY : PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY;
                            onUpgradeRequest(priceId);
                        } else goto((page.data.session && user) ? '/library/pricing' : '/login');
                    }}
                    disabled={(currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY)}
                    class="w-full py-4 px-6 rounded-xl font-bold text-base transition-all {(currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY) ? 'bg-amber-100 text-amber-600' : 'bg-[#1a232e] text-white hover:bg-black shadow-[0_5px_15px_rgba(26,35,46,0.3)]'} cursor-pointer disabled:cursor-default"
                >
                    {#if (page.data.session && user)}
                        {(currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY) ? 'Current Plan' : 'Upgrade to Librarian'}
                    {:else}
                        Go Unlimited
                    {/if}
                </button>
            </div>
        </div>
    </div>
</section>

<ConfirmSwitchToFreeModal isOpen={showConfirmModal} onConfirm={handleConfirmSwitchToFree} onCancel={closeConfirmModal} />
<ConfirmDowngradeToScholarModal isOpen={showDowngradeToScholarModal} onConfirm={handleConfirmDowngradeToScholar} onCancel={closeDowngradeToScholarModal} />