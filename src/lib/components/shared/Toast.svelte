<script lang="ts">
    import { toast } from '$lib/stores/toast.svelte';
    import { fly } from 'svelte/transition';
    import { flip } from 'svelte/animate';
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 p-4 pointer-events-none w-full max-w-sm">
    {#each toast.toasts as t (t.id)}
        <div 
            animate:flip={{ duration: 300 }}
            transition:fly={{ x: 100, duration: 300 }}
            class="pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-lg border border-opacity-10 
                {t.type === 'success' ? 'bg-[#1a232e] text-white border-[#1a232e]' : ''} 
                {t.type === 'error' ? 'bg-red-50 text-red-900 border-red-200' : ''} 
                {t.type === 'info' ? 'bg-white text-gray-800 border-gray-200' : ''}"
            role="alert"
        >
            {#if t.type === 'success'}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle w-5 h-5 text-green-400 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            {:else if t.type === 'error'}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle w-5 h-5 text-red-500 shrink-0"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info w-5 h-5 text-blue-500 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            {/if}
            <p class="text-sm font-medium leading-5">{t.message}</p>
            
            <button onclick={() => toast.remove(t.id)} class="ml-auto shrink-0 opacity-70 hover:opacity-100 transition-opacity" aria-label="Dismiss">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        </div>
    {/each}
</div>
