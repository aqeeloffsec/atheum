<script lang="ts">
    import { navigating } from '$app/state';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    const progress = tweened(0, { duration: 400, easing: cubicOut });
    let visible = $state(false);
    
    $effect(() => {
        if (navigating.to) {
            visible = true;
            progress.set(0, { duration: 0 });
            // Simulate 70% loading over 3 seconds
            progress.set(0.7, { duration: 3000 });
        } else {
            // Once navigation resolves, zip to 100% and fade out
            progress.set(1).then(() => {
                setTimeout(() => { visible = false; }, 400);
            });
        }
    });
</script>

{#if visible}
    <div class="fixed top-0 left-0 w-full h-1 z-9999 pointer-events-none transition-opacity duration-300" style="opacity: {$progress === 1 ? 0 : 1};">
        <div 
            class="h-full bg-[#1a232e] shadow-[0_0_10px_rgba(26,35,46,0.7)]" 
            style="width: {$progress * 100}%"
        ></div>
    </div>
{/if}
