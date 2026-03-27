<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { getUserState } from "$lib/state/user-state.svelte";
    import SubscriptionStatus from "$lib/components/library/SubscriptionStatus.svelte";
    
    let { data } = $props();
    let userContext = getUserState();
    
    let searchQuery = $state(page.url.searchParams.get('q') || '');
    
    // We update URL seamlessly for sharing purposes without hitting the server
    $effect(() => {
        const url = new URL(page.url);
        if (searchQuery.trim()) {
            url.searchParams.set('q', searchQuery.trim());
        } else {
            url.searchParams.delete('q');
        }
        goto(url.toString(), { replaceState: true, keepFocus: true, noScroll: true });
    });

    $effect(() => {
        if (data.books) {
            userContext.books = data.books;
        }
    });

    function openQuickView(book: any) {
        userContext.selectedBook = book;
        userContext.isQuickViewOpen = true;
    }

    let allGenres = $derived.by(() => {
        if (!userContext.books) return [];
        const genres = new Set(userContext.books.map(b => b.genre).filter(Boolean));
        return Array.from(genres).sort();
    });

    let filteredBooks = $derived.by(() => {
        if (!userContext.books) return [];
        let result = userContext.books;

        const sq = searchQuery.trim().toLowerCase();
        if (sq) {
            result = result.filter(b => 
                (b.title && b.title.toLowerCase().includes(sq)) || 
                (b.author && b.author.toLowerCase().includes(sq)) ||
                (b.genre && b.genre.toLowerCase().includes(sq)) ||
                (b.synopsis && b.synopsis.toLowerCase().includes(sq))
            );
        }

        // Apply Status/Favorites filter
        if (userContext.activeFilter === 'Reading') {
            result = result.filter(b => b.status === 'Currently Reading');
        } else if (userContext.activeFilter === 'To Read') {
            result = result.filter(b => b.status === 'Want to Read');
        } else if (userContext.activeFilter === 'Favorites') {
            result = result.filter(b => b.is_favorite);
        }

        // Apply Genre filter
        if (userContext.activeGenre !== 'All Genres') {
            result = result.filter(b => b.genre === userContext.activeGenre);
        }

        return result;
    });

    const filterOptions = ['All Books', 'Reading', 'To Read', 'Favorites'];
</script>

<div class="max-w-full space-y-6">
    <SubscriptionStatus subscription={data.subscription} />
    
    <div class="flex items-baseline justify-between mb-8">
        <div>
            <h2 class="text-3xl font-serif font-bold text-[#1a232e]">My Library</h2>
            <p class="text-gray-500 mt-1">{filteredBooks.length} books</p>
        </div>
        <div class="flex items-center gap-3">
            <button aria-label="Download" class="flex items-center gap-2 p-2.5 rounded-xl border border-[#e6e0d4] bg-white text-gray-500 hover:text-[#1a232e] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download w-4 h-4" aria-hidden="true">
                    <path d="M12 15V3"></path>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <path d="m7 10 5 5 5-5"></path>
                </svg>
            </button>
            <button aria-label="Share" class="flex items-center gap-2 p-2.5 rounded-xl border border-[#e6e0d4] bg-white text-gray-500 hover:text-[#1a232e] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share2 lucide-share-2 w-4 h-4" aria-hidden="true">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                </svg>
            </button>
        </div>
    </div>

    <!-- Filters Row -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        
        <form class="relative w-full md:max-w-md" onsubmit={(e) => { e.preventDefault(); }}>
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search text-gray-400">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
            </div>
            <input 
                type="search" 
                name="q"
                bind:value={searchQuery}
                placeholder="Search library by title, author, genre..." 
                class="w-full bg-white border border-[#e6e0d4] text-gray-700 py-2.5 pl-11 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all font-medium text-sm"
            >
        </form>

        <div class="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div class="flex flex-nowrap gap-2 shrink-0">
            {#each filterOptions as option}
                <button 
                    onclick={() => userContext.activeFilter = option}
                    class="px-4 py-2 rounded-full text-sm font-medium transition-all {userContext.activeFilter === option ? 'bg-[#1a232e] text-white shadow-md' : 'bg-white border border-[#e6e0d4] text-gray-600 hover:bg-gray-50'}"
                >
                    {option}
                </button>
            {/each}
        </div>
        
        <div class="relative min-w-[180px]">
            <select 
                bind:value={userContext.activeGenre}
                class="w-full appearance-none bg-white border border-[#e6e0d4] text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-0 transition-all font-medium text-sm cursor-pointer"
            >
                <option value="All Genres">All Genres</option>
                {#each allGenres as genre}
                    <option value={genre}>{genre}</option>
                {/each}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
            </div>
        </div>
        </div>
    </div>
    
    {#if filteredBooks && filteredBooks.length > 0}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
            {#each filteredBooks as book}
            <div 
                class="group cursor-pointer" 
                onclick={() => openQuickView(book)}
                onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openQuickView(book); }}
                role="button"
                tabindex="0"
                aria-label="View details for {book.title}"
            >
                <div class="relative aspect-2/3 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
                    <img alt={book.title} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={book.cover_image_url}>
                    <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div class="flex gap-2">
                            <span class="bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-[#1a232e] uppercase tracking-wider">Quick View</span>
                        </div>
                    </div>
                    {#if book.is_favorite}
                        <div class="absolute top-2 right-2 bg-emerald-500/90 backdrop-blur text-white p-1 rounded-lg shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-3.5 h-3.5 fill-white" aria-hidden="true">
                                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                            </svg>
                        </div>
                    {/if}
                </div>
                <div class="mt-4 space-y-1">
                    <div class="flex justify-between items-start gap-2">
                        <h3 class="font-serif font-bold text-[#1a232e] line-clamp-1 group-hover:text-amber-600 transition-colors">{book.title}</h3>
                        {#if book.rating}
                            <div class="flex items-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star w-3 h-3 text-amber-500 fill-amber-500 mr-0.5" aria-hidden="true">
                                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                                </svg>
                                <span class="text-xs font-bold">{book.rating}</span>
                            </div>
                        {/if}
                    </div>
                    <p class="text-xs text-gray-500 line-clamp-1">{book.author}</p>
                    <div class="flex gap-2 pt-1">
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter bg-gray-100 text-gray-600">{book.status}</span>
                        {#if book.genre}
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter bg-amber-50 text-amber-700 border border-amber-100">{book.genre}</span>
                        {/if}
                    </div>
                </div>
            </div>
            {/each}
        </div>
    {:else}
        <div class="flex flex-col items-center justify-center py-20 text-center">
            <div class="bg-gray-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library w-8 h-8 text-gray-400" aria-hidden="true">
                    <path d="m16 6 4 14"></path>
                    <path d="M12 6v14"></path>
                    <path d="M8 8v12"></path>
                    <path d="M4 4v16"></path>
                </svg>
            </div>
            <h3 class="text-xl font-serif font-bold text-[#1a232e] mb-2">{searchQuery ? `No results for "${searchQuery}"` : 'No books found'}</h3>
            <p class="text-gray-500 max-w-sm mb-6">{searchQuery ? 'Try adjusting your search terms or filters.' : 'We couldn\'t find any books matching your current filters. Try selecting a different view or adding a new book.'}</p>
            <button onclick={() => { userContext.activeFilter = 'All Books'; userContext.activeGenre = 'All Genres'; searchQuery = ''; }} class="bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm shadow-sm inline-flex items-center gap-2 cursor-pointer mb-2">
                Clear Filters
            </button>
            <button onclick={() => { userContext.isAddBookModalOpen = true; }} class="bg-[#1a232e] text-white px-6 py-3 rounded-xl hover:bg-[#2d3b4b] transition-all font-medium text-sm shadow-sm inline-flex items-center gap-2 cursor-pointer mt-2 w-max mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-4 h-4" aria-hidden="true">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                </svg>
                Add a Book
            </button>
        </div>
    {/if}
</div>


