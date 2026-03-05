<script lang="ts">
import AtheumLogo from "$lib/components/shared/AtheumLogo.svelte";
import Button from "$lib/components/shared/Button.svelte";
import Nav from "$lib/components/header/Nav.svelte";
import MobileNav from "$lib/components/header/MobileNav.svelte";

import { getUserState } from "$lib/state/user-state.svelte";

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
        <div class="flex items-center gap-2">
            <Button href="/login" variant="outline" class="hidden md:flex px-4!">Sign In</Button>
            <Button href="/sign-up" variant="primary" class="hidden md:flex">Get Started
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-3.5 h-3.5" aria-hidden="true">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                </svg>
            </Button>
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