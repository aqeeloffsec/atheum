<script lang="ts">
	import Cover from "$lib/components/home/Cover.svelte";
    import { navigationState } from "$lib/state/navigation-state.svelte";
    import gsap from 'gsap';
    import ScrollTrigger from 'gsap/ScrollTrigger';

	const navState = navigationState;
	let { data } = $props();
	
	let activePlan = $derived(data.subscription?.plan_id || 'free');

    // UI State for lazy loaded components
    let Stats = $state<any>(null);
    let Features = $state<any>(null);
    let HowItWorks = $state<any>(null);
    let Testimonials = $state<any>(null);
    let Pricing = $state<any>(null);
    let Faq = $state<any>(null);
    let BeginYourJourney = $state<any>(null);

    let loaded = $state(false);

    $effect(() => {
        gsap.globalTimeline.pause();
        loaded = true;
        gsap.globalTimeline.resume();
        
        // Refresh ScrollTrigger after a bit to account for layout shifts
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 1000);

        // Load other components in background
        Promise.all([
            import("$lib/components/home/Stats.svelte").then(m => Stats = m.default),
            import("$lib/components/home/Features.svelte").then(m => Features = m.default),
            import("$lib/components/home/HowItWorks.svelte").then(m => HowItWorks = m.default),
            import("$lib/components/home/Testimonials.svelte").then(m => Testimonials = m.default),
            import("$lib/components/home/Pricing.svelte").then(m => Pricing = m.default),
            import("$lib/components/home/Faq.svelte").then(m => Faq = m.default),
            import("$lib/components/home/BeginYourJourney.svelte").then(m => BeginYourJourney = m.default),
        ]).then(() => {
             // Second refresh after all components are loaded
             setTimeout(() => ScrollTrigger.refresh(), 500);
        });

        return () => clearTimeout(timer);
    });
</script>

<Cover/>

{#if Stats}
    <Stats stats={data.stats} />
{/if}

<div bind:this={navState.features}>
	{#if Features}
        <Features />
    {/if}
</div>

<div bind:this={navState.howItWorks}>
	{#if HowItWorks}
        <HowItWorks />
    {/if}
</div>

{#if Testimonials}
    <Testimonials />
{/if}

<div bind:this={navState.pricing}>
	{#if Pricing}
        <Pricing currentPlan={activePlan} />
    {/if}
</div>

<div bind:this={navState.faq}>
	{#if Faq}
        <Faq />
    {/if}
</div>

{#if BeginYourJourney}
    <BeginYourJourney />
{/if}