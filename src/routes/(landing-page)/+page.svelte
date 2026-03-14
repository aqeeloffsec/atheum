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

	const navState = navigationState;
	let { data } = $props();
	
	let activePlan = $derived(data.subscription?.plan_id || 'free');
</script>

<Cover/>
<Stats />
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