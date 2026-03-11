<script lang="ts">
	import AtheumLogo from "$lib/components/shared/AtheumLogo.svelte";

</script>

<div class="fixed inset-y-0 left-0 z-40 w-64 bg-[#1a232e] text-cream transition-transform duration-300 lg:static lg:translate-x-0 -translate-x-full">
    <div class="flex flex-col h-full">
        <AtheumLogo isDark={true} />
        
        <nav class="flex-1 px-4 py-4 space-y-1">
            <button class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group bg-[#fdfaf6] text-[#1a232e]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library w-5 h-5 text-[#1a232e]" aria-hidden="true">
                    <path d="m16 6 4 14"></path>
                    <path d="M12 6v14"></path>
                    <path d="M8 8v12"></path>
                    <path d="M4 4v16"></path>
                </svg>
                <span class="font-medium">All Books</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right ml-auto w-4 h-4" aria-hidden="true">
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
            </button>
            <button class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-gray-400 hover:text-white hover:bg-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-5 h-5 text-gray-500 group-hover:text-gray-300" aria-hidden="true">
                    <path d="M12 7v14"></path>
                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                </svg>
                <span class="font-medium">Reading</span>
            </button>
            <button class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-gray-400 hover:text-white hover:bg-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark w-5 h-5 text-gray-500 group-hover:text-gray-300" aria-hidden="true">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                </svg>
                <span class="font-medium">To Read</span>
            </button>
            <button class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-gray-400 hover:text-white hover:bg-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-5 h-5 text-gray-500 group-hover:text-gray-300" aria-hidden="true">
                    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                </svg>
                <span class="font-medium">Favorites</span>
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
            <button class="flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-gray-400 hover:text-white hover:bg-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers w-5 h-5 text-gray-500 group-hover:text-gray-300" aria-hidden="true">
                    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
                    <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
                    <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
                </svg>
                <span class="font-medium">Genres</span>
            </button>
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