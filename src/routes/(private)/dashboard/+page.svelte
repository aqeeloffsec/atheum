<script lang="ts">
    import { getUserState } from "$lib/state/user-state.svelte";
    import QuickViewBook from "$lib/components/dashboard/QuickViewBook.svelte";
    
    let { data } = $props();
    let userContext = getUserState();

    function openQuickView(book: any) {
        userContext.selectedBook = book;
        userContext.isQuickViewOpen = true;
    }
</script>

<div class="max-w-full">
    <div class="flex items-baseline justify-between mb-8">
        <div>
            <h2 class="text-3xl font-serif font-bold text-[#1a232e]">All Books</h2>
            <p class="text-gray-500 mt-1">{data.books?.length || 0} books in this collection</p>
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
    
    {#if data.books && data.books.length > 0}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
            {#each data.books as book}
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
                    <div class="absolute top-2 right-2 bg-emerald-500/90 backdrop-blur text-white p-1 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark w-3.5 h-3.5 fill-white" aria-hidden="true">
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                        </svg>
                    </div>
                </div>
                <div class="mt-4 space-y-1">
                    <div class="flex justify-between items-start gap-2">
                        <h3 class="font-serif font-bold text-[#1a232e] line-clamp-1 group-hover:text-blue-900 transition-colors">{book.title}</h3>
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
            <h3 class="text-xl font-serif font-bold text-[#1a232e] mb-2">No books yet</h3>
            <p class="text-gray-500 max-w-sm mb-6">Your library is currently empty. Start adding books to build your personal collection.</p>
            <button onclick={() => { userContext.isAddBookModalOpen = true; }} class="bg-[#1a232e] text-white px-6 py-3 rounded-xl hover:bg-[#2d3b4b] transition-all font-medium text-sm shadow-sm inline-flex items-center gap-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-4 h-4" aria-hidden="true">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                </svg>
                Add Your First Book
            </button>
        </div>
    {/if}
</div>


