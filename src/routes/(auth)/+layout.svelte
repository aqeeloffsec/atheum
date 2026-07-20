<script lang="ts">
	import { page } from '$app/state';
    import gsap from 'gsap';

    import AtheumLogo from '$lib/components/shared/AtheumLogo.svelte';

	let { children } = $props();

    let isSignUpRoute = $derived(page.url.pathname === '/sign-up');
    let isLoginRoute = $derived(page.url.pathname === '/login');
    let isForgotPasswordRoute = $derived(page.url.pathname === '/forgot-password');
   
    let sideBanner = $state();

    $effect(() => {
        if (sideBanner) {
			const tween = gsap.fromTo(sideBanner,
                { 
                    opacity: 0, 
                },
                { 
                    opacity: 1, 
                    duration: 0.7, 
                    stagger: 0.12, 
                    ease: "power2.out",
                    overwrite: "auto",
                    delay: 0.1
                }
            );

            return () => tween.kill();
		}
    });
</script>

<div class="hidden lg:flex lg:w-[42%] xl:w-[45%] bg-[#1a232e] flex-col justify-between p-12 relative overflow-hidden">
    <div class="absolute inset-0 opacity-[0.04]" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);"></div>
    <div class="absolute inset-0 bg-linear-to-b from-[#1a232e] via-[#1a232e] to-[#2d3b4b]"></div>
    <!-- Floating accent blobs matching landing page -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute w-64 h-64 bg-purple-500/[0.07] rounded-full blur-[80px]" style="top: 15%; left: -10%;"></div>
        <div class="absolute w-48 h-48 bg-amber-500/6 rounded-full blur-[80px]" style="bottom: 20%; right: -5%;"></div>
        <div class="absolute w-32 h-32 bg-indigo-500/5 rounded-full blur-[60px]" style="top: 50%; left: 40%;"></div>
    </div>
    <div class="relative z-10">
        <div class="mb-16 w-fit">
            <AtheumLogo isDark={true} />
        </div>
        {#if isSignUpRoute}
            <div bind:this={sideBanner} class="space-y-6">
                <div>
                    <h2 class="font-serif text-3xl font-bold text-white mb-2">Start your literary journey today.</h2>
                    <p class="text-gray-400 text-sm leading-relaxed">Join thousands of readers who've made Atheum their personal library. Free forever to get started.</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white/5 border border-white/10 rounded-[14px] p-3 hover:bg-white/8 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mb-2" aria-hidden="true">
                            <defs><linearGradient id="feat-grad-1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c084fc" /><stop offset="100%" stop-color="#fbbf24" /></linearGradient></defs>
                            <path d="m21 21-4.34-4.34" stroke="url(#feat-grad-1)"></path><circle cx="11" cy="11" r="8" stroke="url(#feat-grad-1)"></circle>
                        </svg>
                        <p class="text-white text-xs font-semibold mb-0.5">Instant Search</p>
                        <p class="text-gray-500 text-[10px]">Find any book instantly</p>
                    </div>
                    <div class="bg-white/5 border border-white/10 rounded-[14px] p-3 hover:bg-white/8 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mb-2" aria-hidden="true">
                            <defs><linearGradient id="feat-grad-2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c084fc" /><stop offset="100%" stop-color="#fbbf24" /></linearGradient></defs>
                            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" stroke="url(#feat-grad-2)"></path>
                        </svg>
                        <p class="text-white text-xs font-semibold mb-0.5">AI Ebook Generator</p>
                        <p class="text-gray-500 text-[10px]">Create books with AI</p>
                    </div>
                    <div class="bg-white/5 border border-white/10 rounded-[14px] p-3 hover:bg-white/8 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mb-2" aria-hidden="true">
                            <defs><linearGradient id="feat-grad-3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c084fc" /><stop offset="100%" stop-color="#fbbf24" /></linearGradient></defs>
                            <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" stroke="url(#feat-grad-3)"></path>
                            <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" stroke="url(#feat-grad-3)"></path>
                            <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" stroke="url(#feat-grad-3)"></path>
                        </svg>
                        <p class="text-white text-xs font-semibold mb-0.5">Smart Categories</p>
                        <p class="text-gray-500 text-[10px]">Organize effortlessly</p>
                    </div>
                    <div class="bg-white/5 border border-white/10 rounded-[14px] p-3 hover:bg-white/8 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mb-2" aria-hidden="true">
                            <defs><linearGradient id="feat-grad-4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c084fc" /><stop offset="100%" stop-color="#fbbf24" /></linearGradient></defs>
                            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" stroke="url(#feat-grad-4)"></path>
                        </svg>
                        <p class="text-white text-xs font-semibold mb-0.5">Star Ratings</p>
                        <p class="text-gray-500 text-[10px]">Rate & rank your reads</p>
                    </div>
                </div>
            </div>
        {/if}
        {#if isLoginRoute}
            <div bind:this={sideBanner} class="space-y-6">
                <div>
                    <h2 class="font-serif text-3xl font-bold text-white mb-2">Welcome back,<br>bibliophile.</h2>
                    <p class="text-gray-400 text-sm leading-relaxed">Sign in to access your personal library, track your reading, and rediscover the books you love.</p>
                </div>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-3 h-3 text-purple-400" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m9 12 2 2 4-4"></path>
                            </svg>
                        </div>
                        <span class="text-gray-300 text-sm">Track your reading progress</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-3 h-3 text-purple-400" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m9 12 2 2 4-4"></path>
                            </svg>
                        </div>
                        <span class="text-gray-300 text-sm">Generate ebooks with AI</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-3 h-3 text-purple-400" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m9 12 2 2 4-4"></path>
                            </svg>
                        </div>
                        <span class="text-gray-300 text-sm">Organize books by genre & status</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-3 h-3 text-purple-400" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m9 12 2 2 4-4"></path>
                            </svg>
                        </div>
                        <span class="text-gray-300 text-sm">Rate, favorite & search instantly</span>
                    </div>
                </div>
            </div>
        {/if}
        {#if isForgotPasswordRoute}
            <div bind:this={sideBanner} class="space-y-5">
                <div>
                    <h2 class="font-serif text-3xl font-bold text-white mb-2">We've got you covered.</h2>
                    <p class="text-gray-400 text-sm leading-relaxed">Forgot your password? No problem. Enter your email and we'll send you a secure reset link right away.</p>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                    <div class="flex items-center gap-3">
                        <span class="font-serif text-xs font-bold w-6 shrink-0 bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-amber-400">01</span>
                        <span class="text-gray-300 text-sm">Enter your email address below</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="font-serif text-xs font-bold w-6 shrink-0 bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-amber-400">02</span>
                        <span class="text-gray-300 text-sm">Check your inbox for the reset link</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="font-serif text-xs font-bold w-6 shrink-0 bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-amber-400">03</span>
                        <span class="text-gray-300 text-sm">Create a new secure password</span>
                    </div>
                </div>
            </div>
        {/if}
    </div>
    <div class="relative z-10">
        <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p class="font-serif text-white/80 text-sm italic leading-relaxed mb-4">"A room without books is like a body without a soul."</p>
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-amber-500 flex items-center justify-center">
                    <span class="text-xs font-bold text-white">C</span>
                </div>
                <div>
                    <p class="text-white text-xs font-semibold">Marcus Tullius Cicero</p>
                    <p class="text-gray-500 text-[10px]">Roman philosopher &amp; statesman</p>
                </div>
            </div>
        </div>
    </div>
</div>

{@render children()}