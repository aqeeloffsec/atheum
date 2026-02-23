<script lang="ts">
	import '$lib/styles/app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();

	const isAuthPage = $derived(['/sign-up', '/login', '/forgot-password'].includes(page.url.pathname));
</script>

<svelte:head><link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
	<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<main class="min-h-screen font-sans antialiased {isAuthPage && 'flex bg-[#fdfaf6] overflow-y-hidden!'}">
	{@render children()}
</main>



