<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLInputAttributes } from 'svelte/elements';

    interface InputProps extends Omit<HTMLInputAttributes, 'value'> {
        name: string;
        label?: string;
        icon?: Snippet;
        errorCondition?: boolean;
        error?: string;
        wrapper?: boolean;
        value?: string;
    }

    let { 
        name, 
        label, 
        icon, 
        placeholder, 
        type = 'text', 
        class: className = '', 
        value = $bindable(''), 
        errorCondition, 
        error, 
        disabled, 
        wrapper = false,
        ...restProps 
    }: InputProps = $props();

    const normalFieldClass = "border-[#e6e0d4] focus:border-[#1a232e]/40 focus:ring-[#1a232e]/8";
    const errorFieldClass = "border-red-300 focus:border-red-400 focus:ring-red-100";

    let showPassword = $state(false);

    const togglePasswordVisibility = () => {
        showPassword = !showPassword;
    }
</script>

<svelte:element this={wrapper ? 'div' : 'svelte:fragment'} class={wrapper ? "space-y-1.5" : ""}>
    {#if label}
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest" for={name}>{label}</label>
    {/if}
    <div class="relative">
        {#if icon}
            <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                {@render icon()}
            </div>
        {/if}
        <input 
            id={name} 
            {placeholder} 
            {name} 
            {disabled}
            type={type === 'password' && showPassword ? 'text' : type}
            bind:value={value}
            class="w-full py-3 rounded-[14px] border bg-[#fdfaf6] text-[#1a232e] text-sm transition-all outline-none placeholder:text-gray-300 {icon !== undefined ? 'pl-10' : 'pl-4'} {type === 'password' ? 'pr-10' : 'pr-4'} focus:ring-2 {className} {errorCondition ? errorFieldClass : normalFieldClass}"
            {...restProps}
        />

        {#if type === 'password'}
            <button type="button" onclick={togglePasswordVisibility} class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye w-4 h-4" aria-hidden="true">
                    {#if !showPassword}
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                        <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" y1="2" x2="22" y2="22"></line>
                {:else}
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                {/if}
            </svg>
        </button>
        {/if}
    </div>

    {#if errorCondition && error}
        <p class="flex items-center gap-1.5 text-xs text-red-500 font-medium" style="opacity: 1; transform: none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert w-3.5 h-3.5 shrink-0" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" x2="12" y1="8" y2="12"></line>
                <line x1="12" x2="12.01" y1="16" y2="16"></line>
            </svg>
            {error}
        </p>
    {/if}
</svelte:element>