<script lang="ts">
	import AtheumLogo from "$lib/components/shared/AtheumLogo.svelte";
    import { getUserState } from "$lib/state/user-state.svelte";
    import { page } from "$app/state";

    import { 
        PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY, 
        PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY, 
        PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY, 
        PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY
    } from "$env/static/public";

    let { currentPlan = null } = $props<{
        currentPlan?: string | null,
    }>();

    let userContext = getUserState();

    function setFilter(filterName: string) {
        userContext.activeFilter = filterName;
    }
</script>

{#if userContext.isMobileMenuOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        onclick={() => userContext.isMobileMenuOpen = false}
    ></div>
{/if}

<div class="fixed inset-y-0 left-0 z-40 {userContext.isSidebarCollapsed ? 'w-20' : 'w-64'} flex flex-col bg-[#1a232e] text-cream transition-all duration-300 lg:static {userContext.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 border-r border-white/5 shadow-2xl lg:shadow-none">
    <div class="flex flex-col h-full overflow-hidden">
        <AtheumLogo isDark={true} showText={!userContext.isSidebarCollapsed} />
        
        <!-- User Profile & Plan Badge Header -->
        <div class="py-4 border-b border-white/5 transition-all {userContext.isSidebarCollapsed ? 'px-0 flex justify-center' : 'px-6'}">
            <div class="flex items-center {userContext.isSidebarCollapsed ? 'justify-center w-full' : 'gap-3'}">
                <div class="{userContext.isSidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10'} rounded-full bg-linear-to-br from-cream to-cream/80 text-[#1a232e] flex items-center justify-center font-bold text-lg shadow-inner ring-2 ring-white/10 shrink-0">
                    {userContext.user?.email?.[0].toUpperCase() || 'U'}
                </div>
                {#if !userContext.isSidebarCollapsed}
                <div class="flex flex-col min-w-0 flex-1 transition-opacity duration-200">
                    <span class="text-white text-sm font-semibold truncate">
                        {userContext.user?.user_metadata?.name || userContext.user?.email || 'User'}
                    </span>
                    {#if (currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY)}
                        <div class="inline-flex items-center mt-1">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm">
                                Scholar Plan
                            </span>
                        </div>
                    {:else if (currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY || currentPlan === PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY)}
                        <div class="inline-flex items-center mt-1">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm">
                                Librarian Plan
                            </span>
                        </div>
                    {:else}
                        <div class="inline-flex items-center mt-1">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gray-500/10 text-gray-400 border border-gray-500/20 shadow-sm">
                                Reader (Free)
                            </span>
                        </div>
                    {/if}
                </div>
                {/if}
            </div>
        </div>
        
        <nav class="flex-1 py-6 space-y-1.5 overflow-y-auto {userContext.isSidebarCollapsed ? 'px-4' : 'px-4'}">
            <a 
                href="/library" 
                onclick={() => setFilter('All Books')}
                class="flex items-center w-full {userContext.isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} min-h-[48px] rounded-xl transition-all duration-200 group {(userContext.activeFilter === 'All Books' && page.url.pathname === '/library') ? 'bg-[#fdfaf6] text-[#1a232e]' : 'text-gray-400 hover:text-white hover:bg-white/5'}"
                title="Library"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library w-5 h-5 transition-all duration-200 {(userContext.activeFilter === 'All Books' && page.url.pathname === '/library') ? 'text-[#1a232e]' : 'text-gray-400 group-hover:text-white'}" aria-hidden="true">
                    <path d="m16 6 4 14"></path>
                    <path d="M12 6v14"></path>
                    <path d="M8 8v12"></path>
                    <path d="M4 4v16"></path>
                </svg>
                {#if !userContext.isSidebarCollapsed}
                    <span class="font-medium">Library</span>
                    {#if (userContext.activeFilter === 'All Books' && page.url.pathname === '/library')}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right ml-auto w-4 h-4" aria-hidden="true">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    {/if}
                {/if}
            </a>
            <!-- Ebook Generator Link -->
            <a
                href="/library/ebook-generator"
                class="flex items-center w-full {userContext.isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} min-h-[48px] rounded-xl transition-all duration-200 group {(page.url.pathname === '/library/ebook-generator') ? 'bg-[#fdfaf6] text-[#1a232e]' : 'text-gray-400 hover:text-white hover:bg-white/5'}"
                title="AI Ebook Generator"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-5 h-5 transition-all duration-200 {(page.url.pathname === '/library/ebook-generator') ? 'text-[#1a232e]' : 'text-gray-400 group-hover:text-white'}" aria-hidden="true">
                    <path d="M12 3v18"></path>
                    <path d="M3 12h18"></path>
                    <path d="m5 5 14 14"></path>
                    <path d="m19 5-14 14"></path>
                </svg>
                {#if !userContext.isSidebarCollapsed}
                <span class="font-medium">Ebook Generator</span>
                {#if page.url.pathname === '/library/ebook-generator'}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right ml-auto w-4 h-4" aria-hidden="true">
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
                {/if}
                {/if}
            </a>

            <!-- Genres Button -->
            <button
                onclick={() => setFilter('Genres')}
                class="flex items-center w-full {userContext.isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} min-h-[48px] rounded-xl transition-all duration-200 group {userContext.activeFilter === 'Genres' ? 'bg-[#fdfaf6] text-[#1a232e]' : 'text-gray-400 hover:text-white hover:bg-white/5'}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers w-5 h-5 transition-all duration-200 {userContext.activeFilter === 'Genres' ? 'text-[#1a232e]' : 'text-gray-400 group-hover:text-white'}" aria-hidden="true">
                    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
                    <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
                    <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
                </svg>
                {#if !userContext.isSidebarCollapsed}
                <span class="font-medium">Genres</span>
                {#if userContext.activeFilter === 'Genres'}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right ml-auto w-4 h-4" aria-hidden="true">
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
                {/if}
                {/if}
            </button>
            <!-- class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-amber-500 hover:text-amber-400 hover:bg-amber-500/10" -->
            <a 
                href="/library/pricing"
                class="flex items-center w-full {userContext.isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} min-h-[48px] rounded-xl transition-all duration-200 group {page.url.pathname === '/library/pricing' ? 'bg-[#fdfaf6] text-[#1a232e]' : 'text-gray-400 hover:text-white hover:bg-white/5'}"
                title="Plans & Billing"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-credit-card w-5 h-5 transition-all duration-200 {page.url.pathname === '/library/pricing' ? 'text-[#1a232e]' : 'text-gray-400 group-hover:text-white'}" aria-hidden="true">
                    <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                    <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
                {#if !userContext.isSidebarCollapsed}
                <span class="font-medium">Plans & Billing</span>
                {#if page.url.pathname === '/library/pricing'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right ml-auto w-4 h-4" aria-hidden="true">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                {/if}
                {/if}
            </a>
        </nav>
        <!--
        <div class="p-6">
            <div class="bg-[#2d3b4b] rounded-2xl p-4">
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Reading Goal</p>
                <div class="flex justify-between items-end mb-1">
                    <span class="text-2xl font-serif font-bold text-white">12</span>
                    <span class="text-sm text-gray-400">of 24 books</span>
                </div>
                <div class="w-full bg-[#1a232e] h-2 rounded-full overflow-hidden">
                    <div class="bg-[#fdfaf6] h-full" style="width: 50%;"></div>
                </div>
            </div>
        </div>
        -->
    </div>
</div>