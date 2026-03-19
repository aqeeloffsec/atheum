<script lang="ts">
    import { getUserState } from "$lib/state/user-state.svelte";
    import { fly, fade } from "svelte/transition";
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";

    let userContext = getUserState();
    let book = $derived(userContext.selectedBook);
    let isLiking = $state(false);
    let isDeleting = $state(false);

    function close() {
        userContext.isQuickViewOpen = false;
        userContext.selectedBook = null;
    }

    async function handleLike() {
        if (!book || isLiking) return;
        isLiking = true;
        try {
            await userContext.toggleFavorite(book.id, book.is_favorite);
        } finally {
            isLiking = false;
        }
    }
</script>

{#if userContext.isQuickViewOpen && book}
    <!-- Backdrop -->
    <div 
        class="fixed inset-0 bg-black/20 backdrop-blur-xs z-50" 
        transition:fade={{ duration: 200 }}
        onclick={close}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') close(); }}
        role="button"
        tabindex="-1"
        aria-label="Close Quick View"
    ></div>

    <div 
        class="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#fdfaf6] z-60 shadow-2xl overflow-y-auto border-l border-[#e6e0d4]" 
        transition:fly={{ x: 500, duration: 400, opacity: 1 }}
    >
        <div class="p-8">
            <div class="flex justify-between items-center mb-8">
                <button 
                    onclick={close}
                    aria-label="Close Quick View" 
                    class="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-6 h-6" aria-hidden="true">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                </button>
                <div class="flex gap-3">
                    <button 
                        onclick={handleLike} 
                        disabled={isLiking}
                        aria-label="Like Book" 
                        class="p-2.5 rounded-xl border transition-all cursor-pointer {book.is_favorite ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:text-gray-600'}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-5 h-5 {book.is_favorite ? 'fill-red-500' : ''}" aria-hidden="true">
                            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                        </svg>
                    </button>
                    <form 
                        method="POST" 
                        action="/library?/deleteBook" 
                        use:enhance={() => {
                            isDeleting = true;
                            return async ({ result, update }) => {
                                if (result.type === 'success') {
                                    close();
                                    await invalidateAll();
                                }
                                isDeleting = false;
                                await update();
                            };
                        }}
                    >
                        <input type="hidden" name="id" value={book.id} />
                        {#if book.file_url}
                            <input type="hidden" name="file_url" value={book.file_url} />
                        {/if}
                        <button 
                            type="submit" 
                            disabled={isDeleting}
                            aria-label="Delete Book" 
                            class="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 w-5 h-5 {isDeleting ? 'animate-pulse' : ''}" aria-hidden="true">
                                <path d="M10 11v6"></path>
                                <path d="M14 11v6"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M3 6h18"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
            
            <div class="flex flex-col md:flex-row gap-8">
                <div class="w-full md:w-1/3 shrink-0">
                    <div class="aspect-2/3 rounded-xl overflow-hidden shadow-xl">
                        <img alt={book.title} class="w-full h-full object-cover" src={book.cover_image_url}>
                    </div>
                    <div class="mt-6 space-y-4">
                        <div class="p-4 bg-white rounded-xl border border-[#e6e0d4]">
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                            <p class="text-sm font-medium">{book.status}</p>
                        </div>
                        <div class="p-4 bg-white rounded-xl border border-[#e6e0d4]">
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Added On</p>
                            <p class="text-sm font-medium">{new Date(book.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex-1 space-y-6">
                    <div>
                        <h2 class="text-3xl font-serif font-bold text-[#1a232e] leading-tight">{book.title}</h2>
                        <p class="text-xl text-gray-500 font-medium mt-1">by {book.author}</p>
                    </div>
                    
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 bg-[#1a232e] text-white text-xs font-bold rounded-full">{book.genre}</span>
                        {#if book.rating}
                        <div class="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star w-3 h-3 fill-amber-700" aria-hidden="true">
                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                            </svg>
                            {book.rating}/5 Rating
                        </div>
                        {/if}
                    </div>
                    
                    <div class="space-y-4">
                        <h4 class="text-sm font-bold uppercase tracking-widest text-[#1a232e] flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-4 h-4" aria-hidden="true">
                                <path d="M12 7v14"></path>
                                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                            </svg>
                            Synopsis
                        </h4>
                        <p class="text-gray-600 leading-relaxed text-sm">{book.synopsis || "No synopsis available."}</p>
                    </div>
                    
                    <div class="pt-6 border-t border-[#e6e0d4] grid grid-cols-1 gap-4">
                        <a href="/library/read/{book.id}" class="flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#1a232e] text-white font-bold rounded-xl transition-all text-sm hover:bg-[#2d3b4b] shadow-lg shadow-[#1a232e]/10 group cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true">
                                <path d="M12 7v14"></path>
                                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                            </svg>
                            Start Reading
                        </a>
                        <button class="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#f5f3f0] hover:bg-[#eceae7] text-[#1a232e] font-bold rounded-xl transition-all text-sm cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark w-4 h-4" aria-hidden="true">
                                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                            </svg>
                            Edit Metadata
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}