<script lang="ts">
	import '$lib/styles/app.css';

	import { page } from '$app/state';
	import { invalidate } from '$app/navigation';

	import favicon from '$lib/assets/favicon.svg';
	import { setUserState } from '$lib/state/user-state.svelte';

	let { children, data } = $props();
	let {session, supabase} = $derived(data);

	let userState = setUserState({
		session: data.session,
        supabase: data.supabase,
        user: data.user
	});

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			userState.updateState({
				session: newSession,
				supabase,
				user: newSession?.user || null
			});
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => {
			data.subscription.unsubscribe();
		};
	});
	
	const isAuthPageRoute = $derived(['/sign-up', '/login', '/forgot-password'].includes(page.url.pathname));
	const isProtectedPageRoute = $derived(['/dashboard'].includes(page.url.pathname));
</script>

<svelte:head><link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
	<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

	<title>Atheum - Sanctuary for your digital library</title>
</svelte:head>

<main class="min-h-screen font-sans antialiased {isAuthPageRoute && 'flex bg-[#fdfaf6] overflow-y-hidden!'} {isProtectedPageRoute && 'flex h-screen w-full overflow-hidden bg-[#fdfaf6] text-[#333333] selection:bg-[#e6e0d4]'}">
	{@render children()}
</main>



