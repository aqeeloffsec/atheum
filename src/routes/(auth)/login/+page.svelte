<script lang="ts">
    import gsap from 'gsap';

    let loginContainer = $state();

    $effect(() => {
        if (loginContainer) {
			const tween = gsap.fromTo(loginContainer,
                { 
                    opacity: 0, 
                    y: 20,
                },
                { 
                    opacity: 1, 
                    y: 0,
                    duration: 0.7, 
                    stagger: 0.12, 
                    ease: "power2.out",
                    overwrite: "auto",
                    delay: 0.2,
                }
            );

            return () => tween.kill();
		}
    });
</script>
    
<div bind:this={loginContainer} class="flex-1 flex flex-col items-center justify-center p-6 md:p-10 overflow-y-auto">
    <div class="lg:hidden flex items-center gap-2.5 mb-10 self-start">
        <div class="bg-[#1a232e] p-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library w-4 h-4 text-[#fdfaf6]" aria-hidden="true">
                <path d="m16 6 4 14"></path>
                <path d="M12 6v14"></path>
                <path d="M8 8v12"></path>
                <path d="M4 4v16"></path>
            </svg>
        </div>
        <span class="font-serif font-bold text-[#1a232e] text-lg">Atheum</span>
    </div>
    <div class="w-full max-w-sm">
        <div style="opacity: 1; transform: none;">
            <a href="/" class="flex items-center gap-1.5 text-gray-400 hover:text-[#1a232e] text-xs font-medium mb-8 transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true">
                    <path d="m12 19-7-7 7-7"></path>
                    <path d="M19 12H5"></path>
                </svg>Back to home
            </a>
            <div class="mb-8">
                <div class="inline-flex items-center gap-2 bg-[#1a232e]/6 text-[#1a232e] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-3 h-3" aria-hidden="true">
                        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                        <path d="M20 2v4"></path>
                        <path d="M22 4h-4"></path>
                        <circle cx="4" cy="20" r="2"></circle>
                    </svg> Welcome back
                </div>
                <h1 class="font-serif text-3xl font-bold text-[#1a232e] mb-1">Sign in</h1>
                <p class="text-gray-500 text-sm">Don't have an account? 
                    <a href="/sign-up" class="text-[#1a232e] font-bold hover:underline">Create one for free</a>
                </p>
            </div>
            <div class="space-y-3 mb-6">
                <button type="button" class="flex items-center justify-center cursor-pointer gap-3 w-full py-3 px-4 rounded-[14px] border-2 border-[#e6e0d4] bg-white text-[#1a232e] text-sm font-semibold hover:bg-[#fdfaf6] hover:border-[#1a232e]/30 hover:shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>Continue with Google
                </button>
            </div>
            <div class="flex items-center gap-3 my-2">
                <div class="flex-1 h-px bg-[#e6e0d4]"></div>
                <span class="text-[11px] text-gray-400 font-medium uppercase tracking-widest whitespace-nowrap">or continue with email</span>
                <div class="flex-1 h-px bg-[#e6e0d4]"></div>
            </div>
            <form class="space-y-4 mt-4">
                <div class="space-y-1.5">
                    <label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest" for="email">Email address</label>
                    <div class="relative">
                        <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail w-4 h-4" aria-hidden="true">
                                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                            </svg>
                        </div>
                        <input placeholder="you@example.com" autocomplete="email" class="w-full py-3 rounded-[14px] border bg-[#fdfaf6] text-[#1a232e] text-sm transition-all outline-none placeholder:text-gray-300 pl-10 pr-4 border-[#e6e0d4] focus:border-[#1a232e]/40 focus:ring-2 focus:ring-[#1a232e]/8" type="email" value="">
                    </div>
                </div>
                <div>
                    <div class="space-y-1.5">
                        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest" for="password">Password</label>
                        <div class="relative">
                            <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock w-4 h-4" aria-hidden="true">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                            <input placeholder="Enter your password" autocomplete="current-password" class="w-full py-3 rounded-[14px] border bg-[#fdfaf6] text-[#1a232e] text-sm transition-all outline-none placeholder:text-gray-300 pl-10 pr-10 border-[#e6e0d4] focus:border-[#1a232e]/40 focus:ring-2 focus:ring-[#1a232e]/8" type="password" value="">
                            <button type="button" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Toggle password visibility">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye w-4 h-4" aria-hidden="true">
                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between pt-1">
                    <label class="flex items-center gap-2 group" for="remember me">
                        <input type="checkbox" class="w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer focus:ring-0 focus:outline-none checked:bg-[#1a232e] checked:border-[#1a232e] checked:text-white border-[#c8c0b4] group-hover:border-[#1a232e]/50" />
                        <span class="text-xs text-gray-500 select-none">Remember me</span>
                    </label>
                    <a href="/forgot-password" class="text-xs font-bold text-[#1a232e] hover:underline transition-all">Forgot password?</a>
                </div>
                <button type="submit" class="w-full flex items-center cursor-pointer justify-center gap-2.5 bg-[#1a232e] text-white py-3.5 rounded-[14px] font-bold text-sm hover:bg-[#2d3b4b] hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2">Sign In 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-4 h-4" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </button>
            </form>
            <p class="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield w-3 h-3" aria-hidden="true">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                </svg> Your data is encrypted and fully protected
            </p>
        </div>
    </div>
</div>