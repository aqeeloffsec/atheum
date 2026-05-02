<script lang="ts">
	import Cover from "$lib/components/home/Cover.svelte";
    import Features from "$lib/components/home/Features.svelte";
	import Stats from "$lib/components/home/Stats.svelte";
    import HowItWorks from "$lib/components/home/HowItWorks.svelte";
	import Testimonials from "$lib/components/home/Testimonials.svelte";
	import Pricing from "$lib/components/home/Pricing.svelte";
    import Faq from "$lib/components/home/Faq.svelte";
	import BeginYourJourney from "$lib/components/home/BeginYourJourney.svelte";

	import { navigationState } from "$lib/state/navigation-state.svelte";
    import gsap from 'gsap';

	const navState = navigationState;
	let { data } = $props();
	
	let activePlan = $derived(data.subscription?.plan_id || 'free');

    let loaded = $state(false);

    $effect(() => {
        gsap.globalTimeline.pause();

        const handleLoad = () => {
            loaded = true;
            gsap.globalTimeline.resume();
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => {
            gsap.globalTimeline.resume();
            window.removeEventListener('load', handleLoad);
        };
    });
    $effect(() => {
        if (!loaded) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    });
</script>

<div class="fixed inset-0 z-100 bg-[#fdfaf6] flex items-center justify-center transition-opacity duration-700 ease-in-out {!loaded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}">
    {#if !loaded}
        <div class="flex flex-col items-center gap-4">
            <svg class="w-10 h-10 text-[#1a232e] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
                <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="font-serif tracking-widest text-[10px] uppercase font-bold text-[#1a232e] animate-pulse">Atheum</span>
        </div>
    {/if}
</div>

<Cover/>
<Stats stats={data.stats} />
<div bind:this={navState.features}>
	<Features />
</div>
<div bind:this={navState.howItWorks}>
	<HowItWorks />
</div>
<Testimonials />
<div bind:this={navState.pricing}>
	<Pricing currentPlan={activePlan} />
</div>
<div bind:this={navState.faq}>
	<Faq />
</div>
<BeginYourJourney />