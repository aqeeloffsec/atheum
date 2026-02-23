<script lang="ts">
    import gsap from 'gsap';

    let forgotPasswordContainer = $state();

    $effect(() => {
        if (forgotPasswordContainer) {
			const tween = gsap.fromTo(forgotPasswordContainer,
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
    
<div bind:this={forgotPasswordContainer} class="flex-1 flex flex-col items-center justify-center p-6 md:p-10 overflow-y-auto">
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
            <a href="/login" class="flex items-center gap-1.5 text-gray-400 hover:text-[#1a232e] text-xs font-medium mb-8 transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true">
                    <path d="m12 19-7-7 7-7"></path>
                    <path d="M19 12H5"></path>
                </svg>Back to sign in
            </a>
            <div class="mb-8">
                <div class="w-12 h-12 bg-[#1a232e]/8 rounded-[14px] flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail w-5 h-5 text-[#1a232e]" aria-hidden="true">
                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    </svg>
                </div>
                <h1 class="font-serif text-3xl font-bold text-[#1a232e] mb-1">Forgot password</h1>
                <p class="text-gray-500 text-sm">Enter the email linked to your account and we'll send a reset link.</p>
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
                <button type="submit" class="w-full flex items-center cursor-pointer justify-center gap-2.5 bg-[#1a232e] text-white py-3.5 rounded-[14px] font-bold text-sm hover:bg-[#2d3b4b] hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2">Send Reset Link 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-4 h-4" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </button>
                <a href="/login" class="w-full py-3 flex justify-center text-sm font-medium cursor-pointer text-gray-500 hover:text-[#1a232e] transition-colors">Cancel — return to sign in</a>
            </form>
        </div>
    </div>
</div>