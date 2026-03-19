<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

    export type ButtonProps = {
        variant?: 'primary' | 'outline' | 'ghost' | 'none';
        size?: 'sm' | 'default' | 'lg' | 'icon' | 'none';
        class?: string;
        type?: 'button' | 'submit' | 'reset';
        children?: Snippet;
    } & (
        | (HTMLAnchorAttributes & { href: string })
        | (HTMLButtonAttributes & { href?: null | undefined })
    );

    let {
        href,
        variant = 'primary',
        type = 'button',
        size = 'default',
        class: customClass = '',
        children,
        ...restProps
    }: ButtonProps = $props();

    const baseClasses = 'items-center justify-center gap-2 font-bold transition-all cursor-pointer';
    
    const variantClasses = {
        primary: 'bg-[#1a232e] text-white hover:bg-[#2d3b4b] shadow-sm',
        outline: 'text-[#1a232e] border border-[#1a232e]/15 hover:bg-[#1a232e]/8',
        ghost: 'text-gray-600 hover:bg-gray-100 hover:text-[#1a232e]',
        none: ''
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm rounded-xl',
        default: 'px-5 py-2.5 text-sm rounded-[14px]',
        lg: 'px-8 py-4 text-base rounded-2xl',
        icon: 'p-2 rounded-lg',
        none: ''
    }

    let computedClass = $derived(
        [
            !customClass.match(/\b(hidden|flex|inline|block|grid|table)\b/) ? 'inline-flex' : '',
            baseClasses, 
            variantClasses[variant], 
            sizeClasses[size], 
            customClass
        ]
            .filter(Boolean)
            .join(' ')
    );
</script>

<svelte:element
    this={href ? 'a' : 'button'}
    {href}
    type={href ? undefined : type}
    class={computedClass}
    {...(restProps as any)}
>
    {@render children?.()}
</svelte:element>
