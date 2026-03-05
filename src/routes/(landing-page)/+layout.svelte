<script lang="ts">
	import gsap from 'gsap';
    import ScrollToPlugin from 'gsap/ScrollToPlugin';
	//import { gsap } from 'gsap/dist/gsap';
	//import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';

	gsap.registerPlugin(ScrollToPlugin);

	let { children } = $props();

	const scrollToSection = (section: HTMLElement | null) => {
		if (!section) return;

		// Smooth scroll function
		gsap.to(window, {
			duration: 1.2,
			ease: 'power3.out',
			scrollTo: { 
				y: section
			}
		});
	};
</script>

<Header {scrollToSection} />
{@render children()}
<Footer />
