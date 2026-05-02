<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
    {#each Array(12) as _}
    <div class="animate-pulse">
        <div class="relative aspect-2/3 rounded-xl overflow-hidden shadow-md bg-[#e6e0d4]/50 border border-[#1a232e]/5"></div>
        <div class="mt-4 space-y-2.5">
            <div class="h-4 bg-[#e6e0d4]/80 rounded-md w-3/4"></div>
            <div class="h-2.5 bg-[#e6e0d4]/60 rounded-md w-1/2"></div>
            <div class="flex gap-2 pt-1.5">
                <div class="h-3.5 bg-[#e6e0d4]/70 rounded-md w-16"></div>
                <div class="h-3.5 bg-[#e6e0d4]/70 rounded-md w-12"></div>
            </div>
        </div>
    </div>
    {/each}
</div>
