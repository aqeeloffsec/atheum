<script lang="ts">
    import { fade, scale } from 'svelte/transition';

    let {
        isOpen = false,
        onConfirm,
        onCancel
    } = $props<{
        isOpen?: boolean;
        onConfirm: () => void;
        onCancel: () => void;
    }>();

    function handleConfirm() {
        onConfirm();
    }

    function handleCancel() {
        onCancel();
    }
</script>

{#if isOpen}
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        onclick={handleCancel}
        onkeydown={(e) => { if (e.key === 'Escape') handleCancel(); }}
        role="button"
        tabindex="-1"
        aria-label="Close modal"
    ></div>
    <div
        class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        transition:scale={{ duration: 200, start: 0.95 }}
    >
        <div class="p-8">
            <div class="mb-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 text-amber-500 mx-auto mb-4">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.692-1.333-3.464 0L3.732 13c-.77 1.333.292 3 1.732 3z"></path>
                </svg>
                <h3 class="text-2xl font-serif font-bold text-[#1a232e] mb-2">Switch to Free Plan?</h3>
                <p class="text-gray-500 text-sm">
                    Are you sure you want to switch to the free plan? You will lose access to premium features and your book limit will be reduced to 4 books.
                </p>
            </div>
            <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-3 pt-4">
                <button
                    onclick={handleConfirm}
                    class="w-full sm:w-auto py-3 min-h-[48px] px-6 rounded-xl font-bold text-sm text-white bg-emerald-500 hover:bg-emerald-400 transition-all shadow-lg cursor-pointer"
                >
                    Yes, Switch to Free
                </button>
                <button
                    onclick={handleCancel}
                    class="w-full sm:w-auto py-3 min-h-[48px] px-6 rounded-xl font-bold text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div>
{/if}