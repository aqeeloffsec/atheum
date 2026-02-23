<script lang="ts">
	import { page } from '$app/state';
    import gsap from 'gsap';

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
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute opacity-[0.06] text-[#1a232e]" style="left: 8%; top: 24.6015%; transform: translateY(14.7985px) rotate(3.94626deg);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked w-7 h-7" aria-hidden="true">
                <path d="M10 2v8l3-3 3 3V2"></path>
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
            </svg>
        </div>
        <div class="absolute opacity-[0.06] text-[#1a232e]" style="left: 20%; top: 64.0588%; transform: translateY(-1.41536px) rotate(-0.37743deg);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked w-7 h-7" aria-hidden="true">
                <path d="M10 2v8l3-3 3 3V2"></path>
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
            </svg>
        </div>
        <div class="absolute opacity-[0.06] text-[#1a232e]" style="left: 35%; top: 31.6691%; transform: translateY(-3.92499px) rotate(-1.04666deg);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked w-7 h-7" aria-hidden="true">
                <path d="M10 2v8l3-3 3 3V2"></path>
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
            </svg>
        </div>
        <div class="absolute opacity-[0.06] text-[#1a232e]" style="left: 55%; top: 52.9403%; transform: translateY(-1.85248px) rotate(-0.493993deg);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked w-7 h-7" aria-hidden="true">
                <path d="M10 2v8l3-3 3 3V2"></path>
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
            </svg>
        </div>
        <div class="absolute opacity-[0.06] text-[#1a232e]" style="left: 70%; top: 46.3351%; transform: translateY(12.7635px) rotate(3.4036deg);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked w-7 h-7" aria-hidden="true">
                <path d="M10 2v8l3-3 3 3V2"></path>
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
            </svg>
        </div>
        <div class="absolute opacity-[0.06] text-[#1a232e]" style="left: 85%; top: 89.8291%; transform: translateY(-12.5386px) rotate(-3.34363deg);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked w-7 h-7" aria-hidden="true">
                <path d="M10 2v8l3-3 3 3V2"></path>
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
            </svg>
        </div>
    </div>
    <div class="relative z-10">
        <a href="/" class="flex items-center gap-3 mb-16 w-fit">
            <div class="bg-[#fdfaf6] p-2 rounded-[10px] shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library w-5 h-5 text-[#1a232e]" aria-hidden="true">
                    <path d="m16 6 4 14"></path>
                    <path d="M12 6v14"></path>
                    <path d="M8 8v12"></path>
                    <path d="M4 4v16"></path>
                </svg>
            </div>
            <span class="font-serif font-bold text-[#fdfaf6] text-xl tracking-tight">Atheum</span>
        </a>
        {#if isSignUpRoute}
            <div bind:this={sideBanner} class="space-y-6">
                <div>
                    <h2 class="font-serif text-3xl font-bold text-white mb-2">Start your literary journey today.</h2>
                    <p class="text-gray-400 text-sm leading-relaxed">Join thousands of readers who've made Athenaeum their personal library. Free forever to get started.</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white/5 border border-white/10 rounded-[14px] p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked w-4 h-4 text-amber-400 mb-2" aria-hidden="true">
                            <path d="M10 2v8l3-3 3 3V2"></path>
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
                        </svg>
                        <p class="text-white text-xs font-semibold mb-0.5">Unlimited shelves</p>
                        <p class="text-gray-500 text-[10px]">Organize to your heart's content</p>
                    </div>
                    <div class="bg-white/5 border border-white/10 rounded-[14px] p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-4 h-4 text-amber-400 mb-2" aria-hidden="true">
                            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                            <path d="M20 2v4"></path>
                            <path d="M22 4h-4"></path>
                            <circle cx="4" cy="20" r="2"></circle>
                        </svg>
                        <p class="text-white text-xs font-semibold mb-0.5">Smart search</p>
                        <p class="text-gray-500 text-[10px]">Find any book instantly</p>
                    </div>
                    <div class="bg-white/5 border border-white/10 rounded-[14px] p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield w-4 h-4 text-amber-400 mb-2" aria-hidden="true">
                            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                        </svg>
                        <p class="text-white text-xs font-semibold mb-0.5">100% private</p>
                        <p class="text-gray-500 text-[10px]">Your data stays yours</p>
                    </div>
                    <div class="bg-white/5 border border-white/10 rounded-[14px] p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-4 h-4 text-amber-400 mb-2" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="m9 12 2 2 4-4"></path>
                        </svg>
                        <p class="text-white text-xs font-semibold mb-0.5">Always free</p>
                        <p class="text-gray-500 text-[10px]">No credit card needed</p>
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
                        <div class="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-3 h-3 text-amber-400" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m9 12 2 2 4-4"></path>
                            </svg>
                        </div>
                        <span class="text-gray-300 text-sm">Track your reading progress</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-3 h-3 text-amber-400" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m9 12 2 2 4-4"></path>
                            </svg>
                        </div>
                        <span class="text-gray-300 text-sm">Organize books by genre &amp; status</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-3 h-3 text-amber-400" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m9 12 2 2 4-4"></path>
                            </svg>
                        </div>
                        <span class="text-gray-300 text-sm">Access your favorites anywhere</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check w-3 h-3 text-amber-400" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m9 12 2 2 4-4"></path>
                            </svg>
                        </div>
                        <span class="text-gray-300 text-sm">Set and smash reading goals</span>
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
                        <span class="font-serif text-xs text-amber-400/80 font-bold w-6 shrink-0">01</span>
                        <span class="text-gray-300 text-sm">Enter your email address below</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="font-serif text-xs text-amber-400/80 font-bold w-6 shrink-0">02</span>
                        <span class="text-gray-300 text-sm">Check your inbox for the reset link</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="font-serif text-xs text-amber-400/80 font-bold w-6 shrink-0">03</span>
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
                <div class="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                    <span class="text-xs font-bold text-[#1a232e]">C</span>
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