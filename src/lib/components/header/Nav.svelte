<script lang="ts">
    import { navigationState, type NavigationState } from "$lib/state/navigation-state.svelte";

    let { scrollToSection } = $props<{
        scrollToSection: (element: HTMLElement | null) => void;
    }>();

    const navItems: { key: keyof NavigationState; label: string }[] = [
        { key: 'features', label: 'Features' },
        { key: 'howItWorks', label: 'How It Works' },
        { key: 'pricing', label: 'Pricing' },
        { key: 'faq', label: 'FAQ' }
    ];
</script>

<nav class="hidden lg:flex items-center gap-1">
    {#each navItems as item (item.key)}
        <button 
            onclick={() => scrollToSection(navigationState[item.key])} 
            class="px-4 min-h-[48px] flex items-center text-sm font-medium text-gray-600 hover:text-[#1a232e] hover:bg-[#1a232e]/5 rounded-xl transition-all cursor-pointer"
        >
            {item.label}
        </button>
    {/each}
</nav>