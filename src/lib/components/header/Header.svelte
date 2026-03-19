<script lang="ts">
import { enhance } from "$app/forms";

import AtheumLogo from "$lib/components/shared/AtheumLogo.svelte";
import Button from "$lib/components/shared/Button.svelte";
import Nav from "$lib/components/header/Nav.svelte";
import MobileNav from "$lib/components/header/MobileNav.svelte";

import { getUserState } from "$lib/state/user-state.svelte";

let loadingLogout = $state(false);

let { scrollToSection } = $props();

let isMobileMenuOpen = $state(false);

let userContext = getUserState();
let { user } = $derived(userContext);

let headerNode: HTMLElement | null = $state(null);
let scrolled = $state(false);

const handleOutsideClick = (e: MouseEvent) => {
    if (isMobileMenuOpen && headerNode && !headerNode.contains(e.target as Node)) {
        isMobileMenuOpen = false;
    }
};

$effect(() => {
    const handleScroll = () => {
        scrolled = window.scrollY > 20;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
});
</script>

<svelte:window onclick={handleOutsideClick} />

<header 
    bind:this={headerNode} 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {(scrolled || isMobileMenuOpen) && 'bg-[#fdfaf6]/80 backdrop-blur-md shadow-md'} {(!scrolled && !isMobileMenuOpen) && 'bg-transparent'}"
>
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <AtheumLogo />
        <Nav {scrollToSection} />
        <div class="flex items-center gap-4">
            {#if user}
                <!-- Dynamic Subscription Badge -->
                <div class="hidden lg:flex items-center mr-2">
                    {#if userContext.subscription?.plan_id === 'price_1QxM03SEU8R5Pz6bXYD9k9yE'}
                        <span class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" class="shrink-0" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                            Scholar
                        </span>
                    {:else if userContext.subscription?.plan_id === 'price_1QxM1QSEU8R5Pz6bot5D3kPj'}
                        <span class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-purple-100 text-purple-800 border border-purple-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="shrink-0 text-purple-600" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            Librarian
                        </span>
                    {:else}
                        <span class="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gray-100 text-gray-600 border border-gray-200">
                            Free Plan
                        </span>
                    {/if}
                </div>
                
                <Button href="/library" variant="primary" class="hidden md:flex">Go to Library
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-3.5 h-3.5" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Button>

                <form method="POST" action="/logout" use:enhance={() => {
                        loadingLogout = true;
                        return async ({ update }) => {
                            await update();
                            loadingLogout = false;
                        };
                    }}>
                        <Button type="submit" disabled={loadingLogout} variant="outline" class="hidden md:flex px-4!">{#if !loadingLogout}
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" 
                                    height="24" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor"
                                    stroke-width="2" 
                                    stroke-linecap="round" 
                                    stroke-linejoin="round" 
                                    class="lucide lucide-log-out w-4 h-4" 
                                    aria-hidden="true"
                                >
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" x2="9" y1="12" y2="12" />
                                </svg>
                                <span class="hidden sm:inline">Logout</span>
                            {:else}
                                Logging out...
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" 
                                    height="24" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    stroke-width="2" 
                                    stroke-linecap="round" 
                                    stroke-linejoin="round" 
                                    class="animate-spin w-4 h-4" 
                                    aria-hidden="true"
                                >
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                            {/if}
                        </Button>
                    </form>
            {:else}
                <Button href="/login" variant="outline" class="hidden md:flex px-4!">Sign In</Button>
                <Button href="/sign-up" variant="primary" class="hidden md:flex">Get Started
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-3.5 h-3.5" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Button>
            {/if}
            <Button variant="ghost" size="icon" class="lg:hidden" aria-label="Toggle menu" onclick={(e: MouseEvent) => { e.stopPropagation(); isMobileMenuOpen = !isMobileMenuOpen; }}>
                {#if isMobileMenuOpen}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-5 h-5" aria-hidden="true">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu w-5 h-5" aria-hidden="true">
                        <path d="M4 12h16"></path>
                        <path d="M4 18h16"></path>
                        <path d="M4 6h16"></path>
                    </svg>
                {/if}
            </Button>
        </div>
    </div>
    
    <MobileNav bind:isOpen={isMobileMenuOpen} {scrollToSection} />
</header>