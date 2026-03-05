<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade, scale } from 'svelte/transition';
    import { getUserState } from "$lib/state/user-state.svelte";

    let loadingAdd = $state(false);
    let fileName = $state(""); // Track the selected PDF name
    let userContext = getUserState();

    function handleFileChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            fileName = target.files[0].name;
        }
    }
</script>

{#if userContext.isAddBookModalOpen}
<div class="fixed inset-0 z-60 flex items-center justify-center p-4">
    <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        transition:fade={{ duration: 200 }} 
        onclick={() => { userContext.isAddBookModalOpen = false; }}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') userContext.isAddBookModalOpen = false; }}
        role="button"
        tabindex="-1"
        aria-label="Close modal"
    ></div>
    <div 
        class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden" 
        transition:scale={{ duration: 200, start: 0.95 }}
    >
        <div class="flex h-full flex-col md:flex-row">
            <div class="w-full md:w-5/12 bg-[#1a232e] p-8 text-white flex flex-col justify-between">
                <div>
                    <h3 class="text-2xl font-serif font-bold mb-4">Add to Collection</h3>
                    <p class="text-gray-400 text-sm leading-relaxed mb-6">Enter the details of the new addition to your personal library. You can now upload the PDF directly.</p>
                    <button type="button" class="w-full py-3 bg-amber-400 text-[#1a232e] rounded-xl font-bold text-xs hover:bg-amber-300 transition-all shadow-lg flex items-center justify-center gap-2 mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-4 h-4" aria-hidden="true">
                            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                            <path d="M20 2v4"></path>
                            <path d="M22 4h-4"></path>
                            <circle cx="4" cy="20" r="2"></circle>
                        </svg> Magic Autofill
                    </button>
                </div>
                <div class="hidden md:block">
                    <div class="aspect-2/3 bg-white/5 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-8 h-8 text-white/30 mb-2" aria-hidden="true">
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                        </svg>
                        <p class="text-xs text-white/40 font-medium italic">Cover preview will appear here</p>
                    </div>
                </div>
            </div>

            <form 
                method="POST" 
                action="/dashboard?/addBook" 
                enctype="multipart/form-data"
                use:enhance={() => {
                    loadingAdd = true;
                    return async ({ update, result }) => {
                        await update();
                        loadingAdd = false;
                        if (result.type === 'success') {
                            fileName = "";
                            userContext.isAddBookModalOpen = false;
                        }
                    };
                }} 
                class="flex-1 p-8 bg-white max-h-[80vh] overflow-y-auto"
            >
                <div class="space-y-4">
                    <div class="space-y-1">
                        <label for="title" class="text-xs font-bold text-gray-500 uppercase tracking-widest">Book Title</label>
                        <input name="title" id="title" required class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#1a232e]/5 transition-all outline-none" placeholder="e.g. The Midnight Library" />
                    </div>
                    <div class="space-y-1">
                        <label for="author" class="text-xs font-bold text-gray-500 uppercase tracking-widest">Author</label>
                        <input name="author" id="author" required class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#1a232e]/5 transition-all outline-none" placeholder="e.g. Matt Haig" />
                    </div>

                    <div class="space-y-1">
                        <label for="book_pdf" class="text-xs font-bold text-gray-500 uppercase tracking-widest">Upload PDF Book</label>
                        <div class="relative">
                            <input 
                                type="file" 
                                name="book_pdf" 
                                id="book_pdf" 
                                accept=".pdf" 
                                onchange={handleFileChange}
                                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div class="w-full px-4 py-2.5 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center gap-3 text-sm text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-up"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 12v6"/><path d="m15 15-3-3-3 3"/></svg>
                                <span class="truncate">{fileName || "Choose PDF file..."}</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="genre" class="text-xs font-bold text-gray-500 uppercase tracking-widest">Genre</label>
                            <select name="genre" id="genre" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#1a232e]/5 transition-all outline-none text-sm appearance-none">
                                <option value="Fiction">Fiction</option>
                                <option value="Classic">Classic</option>
                                <option value="Sci-Fi">Sci-Fi</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Non-Fiction">Non-Fiction</option>
                                <option value="Mystery">Mystery</option>
                                <option value="Gothic Fiction">Gothic Fiction</option>
                                <option value="Modern Classic">Modern Classic</option>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label for="status" class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
                            <select name="status" id="status" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#1a232e]/5 transition-all outline-none text-sm appearance-none">
                                <option value="All Books">In Collection</option>
                                <option value="Currently Reading">Reading</option>
                                <option value="Want to Read">To Read</option>
                            </select>
                        </div>
                    </div>
                    <div class="space-y-1">
                        <label for="cover_image_url" class="text-xs font-bold text-gray-500 uppercase tracking-widest">Cover Image URL</label>
                        <input name="cover_image_url" id="cover_image_url" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#1a232e]/5 transition-all outline-none" placeholder="https://images.unsplash.com/..." />
                    </div>
                    <div class="space-y-1">
                        <label for="synopsis" class="text-xs font-bold text-gray-500 uppercase tracking-widest">Synopsis</label>
                        <textarea name="synopsis" id="synopsis" rows="3" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#1a232e]/5 transition-all outline-none resize-none"></textarea>
                    </div>
                </div>
                <div class="mt-8 flex gap-4">
                    <button type="button" onclick={() => { userContext.isAddBookModalOpen = false; }} class="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer">Cancel</button>
                    <button type="submit" disabled={loadingAdd} class="flex-2 px-8 py-3 bg-[#1a232e] text-white font-bold rounded-xl hover:bg-[#2d3b4b] transition-all shadow-lg disabled:opacity-70 flex justify-center items-center cursor-pointer">
                        {#if loadingAdd}
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                        {:else}
                            Add to Shelf
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
{/if}