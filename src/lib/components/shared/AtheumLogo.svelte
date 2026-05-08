<script lang="ts">
    import { getUserState } from "$lib/state/user-state.svelte";

    let { isDark = false, showText = true }: {isDark?: boolean, showText?: boolean} = $props();

    let userContext = getUserState();
    let { user } = $derived(userContext);
</script>

<a href={user ? '/library' : '/'} class="group flex items-center w-fit m-4 focus:outline-none">
    {#if showText}
    <span class="font-serif text-[1.45rem] md:text-3xl font-semibold tracking-tighter {isDark ? 'text-[#fdfaf6]' : 'text-[#1a232e]'} transition-colors relative flex items-center">
        <!-- 'A' shaped Library Books Inline -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-[0.9em] h-[0.9em] md:w-[0.95em] md:h-[0.95em] -mr-1 relative z-10 transition-transform duration-500 scale-110 -translate-y-px" aria-label="A">
            <defs>
                <linearGradient id="a-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="{isDark ? '#c084fc' : '#9333ea'}" />
                    <stop offset="50%" stop-color="{isDark ? '#818cf8' : '#4f46e5'}" />
                    <stop offset="100%" stop-color="{isDark ? '#fbbf24' : '#f59e0b'}" />
                </linearGradient>
            </defs>
            <!-- Left leaning book -->
            <path d="M12 4L6 20" stroke="url(#a-logo-grad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
            <!-- Center spine -->
            <path d="M12 4v16" stroke="url(#a-logo-grad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
            <!-- Right leaning book -->
            <path d="M12 4l6 16" stroke="url(#a-logo-grad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
            <!-- Cross horizontal book -->
            <path d="M7.5 14h9" stroke="url(#a-logo-grad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        theum
        
        <!--<div class="absolute -bottom-1 left-0 right-0 h-[2px] bg-linear-to-r from-purple-500 to-amber-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out rounded-full opacity-0 group-hover:opacity-80"></div>-->
    </span>
    {:else}
    <!-- Floating icon if text is hidden -->
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-6 h-6 md:w-7 md:h-7 {isDark ? 'text-[#fdfaf6]' : 'text-[#1a232e]'} transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-0.5">
            <defs>
                <linearGradient id="a-logo-grad-hidden" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="{isDark ? '#c084fc' : '#9333ea'}" />
                    <stop offset="50%" stop-color="{isDark ? '#818cf8' : '#4f46e5'}" />
                    <stop offset="100%" stop-color="{isDark ? '#fbbf24' : '#f59e0b'}" />
                </linearGradient>
            </defs>
            <!-- Left leaning book -->
            <path d="M12 4L6 20" stroke="url(#a-logo-grad-hidden)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
            <!-- Center spine -->
            <path d="M12 4v16" stroke="url(#a-logo-grad-hidden)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
            <!-- Right leaning book -->
            <path d="M12 4l6 16" stroke="url(#a-logo-grad-hidden)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
            <!-- Cross horizontal book -->
            <path d="M7.5 14h9" stroke="url(#a-logo-grad-hidden)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
    {/if}
</a>