<script lang="ts">
	import AtheumLogo from "$lib/components/shared/AtheumLogo.svelte";
    import { getUserState } from "$lib/state/user-state.svelte";

    let userContext = getUserState();

    function setFilter(filterName: string) {
        userContext.activeFilter = filterName;
    }
</script>

<div class="fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-[#1a232e] text-cream transition-transform duration-300 lg:static lg:translate-x-0 -translate-x-full border-r border-white/5 shadow-2xl lg:shadow-none">
    <div class="flex flex-col h-full">
        <AtheumLogo isDark={true} />
        
        <!-- User Profile & Plan Badge Header -->
        <div class="px-6 py-4 border-b border-white/5">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-linear-to-br from-cream to-cream/80 text-[#1a232e] flex items-center justify-center font-bold text-lg shadow-inner ring-2 ring-white/10 shrink-0">
                    {userContext.user?.email?.[0].toUpperCase() || 'U'}
                </div>
                <div class="flex flex-col min-w-0 flex-1">
                    <span class="text-white text-sm font-semibold truncate">
                        {userContext.user?.user_metadata?.name || userContext.user?.email || 'User'}
                    </span>
                    {#if userContext.subscription?.plan_id === 'price_1QxM03SEU8R5Pz6bXYD9k9yE'}
                        <div class="inline-flex items-center mt-1">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm">
                                Scholar Plan
                            </span>
                        </div>
                    {:else if userContext.subscription?.plan_id === 'price_1QxM1QSEU8R5Pz6bot5D3kPj'}
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
            </div>
        </div>
        
        <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <button 
                onclick={() => setFilter('All Books')}
                class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group {userContext.activeFilter === 'All Books' ? 'bg-[#fdfaf6] text-[#1a232e]' : 'text-gray-400 hover:text-white hover:bg-white/5'}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library w-5 h-5 {userContext.activeFilter === 'All Books' ? 'text-[#1a232e]' : 'text-gray-500 group-hover:text-gray-300'}" aria-hidden="true">
                    <path d="m16 6 4 14"></path>
                    <path d="M12 6v14"></path>
                    <path d="M8 8v12"></path>
                    <path d="M4 4v16"></path>
                </svg>
                <span class="font-medium">All Books</span>
                {#if userContext.activeFilter === 'All Books'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right ml-auto w-4 h-4" aria-hidden="true">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                {/if}
            </button>
            <button 
                onclick={() => setFilter('Reading')}
                class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group {userContext.activeFilter === 'Reading' ? 'bg-[#fdfaf6] text-[#1a232e]' : 'text-gray-400 hover:text-white hover:bg-white/5'}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-5 h-5 {userContext.activeFilter === 'Reading' ? 'text-[#1a232e]' : 'text-gray-500 group-hover:text-gray-300'}" aria-hidden="true">
                    <path d="M12 7v14"></path>
                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                </svg>
                <span class="font-medium">Reading</span>
                {#if userContext.activeFilter === 'Reading'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right ml-auto w-4 h-4" aria-hidden="true">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                {/if}
            </button>
            <button 
                onclick={() => setFilter('To Read')}
                class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group {userContext.activeFilter === 'To Read' ? 'bg-[#fdfaf6] text-[#1a232e]' : 'text-gray-400 hover:text-white hover:bg-white/5'}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark w-5 h-5 {userContext.activeFilter === 'To Read' ? 'text-[#1a232e]' : 'text-gray-500 group-hover:text-gray-300'}" aria-hidden="true">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                </svg>
                <span class="font-medium">To Read</span>
                {#if userContext.activeFilter === 'To Read'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right ml-auto w-4 h-4" aria-hidden="true">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                {/if}
            </button>
            <button 
                onclick={() => setFilter('Favorites')}
                class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group {userContext.activeFilter === 'Favorites' ? 'bg-[#fdfaf6] text-[#1a232e]' : 'text-gray-400 hover:text-white hover:bg-white/5'}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-5 h-5 {userContext.activeFilter === 'Favorites' ? 'text-[#1a232e] fill-[#1a232e]' : 'text-gray-500 group-hover:text-gray-300'}" aria-hidden="true">
                    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                </svg>
                <span class="font-medium">Favorites</span>
                {#if userContext.activeFilter === 'Favorites'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right ml-auto w-4 h-4" aria-hidden="true">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                {/if}
            </button>
            <a href="/dashboard/generate" class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-amber-400 hover:text-amber-300 hover:bg-amber-400/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-5 h-5 text-amber-500 group-hover:text-amber-400" aria-hidden="true">
                    <path d="M12 3v18"></path>
                    <path d="M3 12h18"></path>
                    <path d="m5 5 14 14"></path>
                    <path d="m19 5-14 14"></path>
                </svg>
                <span class="font-medium">Generate Ebook</span>
            </a>
            <button 
                class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-gray-400 hover:text-white hover:bg-white/5"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers w-5 h-5 text-gray-500 group-hover:text-gray-300" aria-hidden="true">
                    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
                    <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
                    <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
                </svg>
                <span class="font-medium">Genres</span>
            </button>
            <a 
                href="/dashboard/pricing"
                class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-credit-card w-5 h-5 text-amber-500 group-hover:text-amber-400" aria-hidden="true">
                    <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                    <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
                <span class="font-medium">Plan & Billing</span>
            </a>
        </nav>
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
    </div>
</div>