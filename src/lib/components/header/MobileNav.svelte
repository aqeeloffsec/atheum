<script lang="ts">
    import gsap from 'gsap';

    import Button from '$lib/components/shared/Button.svelte';

    import { navigationState, type NavigationState } from '$lib/state/navigation-state.svelte';
    import { getUserState } from "$lib/state/user-state.svelte";

    let { isOpen = $bindable(false), scrollToSection } = $props<{
        isOpen: boolean;
        scrollToSection: (element: HTMLElement | null) => void;
    }>();

    let userContext = getUserState();
    let user = $derived(userContext.user);

    let navContainer: HTMLElement | null = $state(null);
    let navContent: HTMLElement | null = $state(null);

    const navItems: { key: keyof NavigationState; label: string }[] = [
        { key: 'features', label: 'Features' },
        { key: 'howItWorks', label: 'How It Works' },
        { key: 'pricing', label: 'Pricing' },
        { key: 'faq', label: 'FAQ' }
    ];

    $effect(() => {
        if (!navContainer || !navContent) return;

        if (isOpen) {
            // Open animation
            gsap.to(navContainer, {
                height: navContent.scrollHeight,
                opacity: 1,
                duration: 0.4,
                ease: "power3.out"
            });
            
            // Stagger in children
            if (navContent.children.length > 0) {
                gsap.fromTo(Array.from(navContent.children), 
                    { y: 10, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out", delay: 0.1 }
                );
            }
        } else {
            // Close animation
            gsap.to(navContainer, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.inOut"
            });
        }
    });

    const handleNavClick = (key: keyof NavigationState) => {
        scrollToSection(navigationState[key]);
        isOpen = false;
    };
</script>

<div bind:this={navContainer} class="relative lg:hidden border-b border-[#e6e0d4] overflow-hidden" style="height: 0; opacity: 0;">
    <div bind:this={navContent} class="px-6 py-4 space-y-1">
        {#each navItems as item (item.key)}
            <button 
                onclick={() => handleNavClick(item.key)} 
                class="w-full text-left block px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#1a232e] hover:bg-[#f5f3f0] rounded-xl transition-all cursor-pointer"
            >
                {item.label}
            </button>
        {/each}
        <div class="md:hidden flex flex-wrap gap-2 pt-2">
            {#if user}
                <Button href="/dashboard" variant="primary" class="flex-1 text-center">Go to Dashboard</Button>
            {:else}
                <Button href="/login" variant="outline" class="flex-1 text-center">Sign In</Button>
                <Button href="/sign-up" variant="primary" class="flex-1 text-center">Get Started</Button>
            {/if}
        </div>
    </div>
</div>