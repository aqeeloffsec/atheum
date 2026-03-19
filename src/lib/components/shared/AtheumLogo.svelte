<script lang="ts">
    import { getUserState } from "$lib/state/user-state.svelte";

    let { isDark = false, showText = true }: {isDark?: boolean, showText?: boolean} = $props();

    let userContext = getUserState();
    let { user } = $derived(userContext);
</script>

<a href={user ? '/library' : '/'} class="flex items-center w-fit m-4 {isDark ? 'gap-3' : 'gap-2.5'}">
    <div class="p-1.5 rounded-[10px] transition-colors {isDark ? 'bg-[#fdfaf6]' : 'bg-[#1a232e]'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library w-5 h-5 {isDark ? 'text-[#1a232e]' : 'text-[#fdfaf6]'}" aria-hidden="true">
            <path d="m16 6 4 14"></path><path d="M12 6v14"></path>
            <path d="M8 8v12"></path><path d="M4 4v16"></path>
        </svg>
    </div>       
    {#if showText}
    <span class="font-serif text-xl font-bold {isDark ? 'text-[#fdfaf6]' : 'text-[#1a232e]'}">Atheum</span>
    {/if}
</a>