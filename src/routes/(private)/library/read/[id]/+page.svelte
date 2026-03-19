<script lang="ts">
    import BookReadingView from "$lib/components/library/BookReadingView.svelte";
    
    let { data } = $props();
</script>

<div class="h-full w-full bg-[#f5f3f0] flex flex-col overflow-hidden">
    <!-- Header with Back Button -->
    <div class="h-16 flex items-center px-6 border-b border-[#e6e0d4] bg-white/50 backdrop-blur-md z-20 shrink-0">
        <a 
            href="/dashboard" 
            class="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1a232e] transition-all"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
            Back to Library
        </a>
    </div>

    <!-- Reading View Container -->
    <div class="flex-1 overflow-auto flex items-center justify-center p-4">
        <BookReadingView book={data.book} />
    </div>
</div>
