<script lang="ts">
    import { enhance } from '$app/forms';   
    import gsap from 'gsap';

    import Input from '$lib/components/shared/Input.svelte';

    let signUpContainer = $state();

    let { form } = $props();

    let loadingSignUp = $state(false);
    let loadingGoogleAuth = $state(false);

    $effect(() => {
        if (signUpContainer) {
			const tween = gsap.fromTo(signUpContainer, 
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
                    delay: 0.2
                }
            );

            return () => tween.kill();
		}
    });
</script>
    
<div bind:this={signUpContainer} class="flex-1 flex flex-col items-center justify-center p-6 md:p-10 overflow-y-auto">
    <div class="lg:hidden flex items-center gap-2.5 mb-10 self-center">
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
                    </svg> Free account
                </div>
                <h1 class="font-serif text-3xl font-bold text-[#1a232e] mb-1">Create account</h1>
                <p class="text-gray-500 text-sm">Already a member? 
                    <a href="/login" class="text-[#1a232e] font-bold hover:underline">Sign in</a>
                </p>
            </div>
            {#if form && (form.errors.username?.length > 0 || form.errors.email?.length > 0 || form.errors.password?.length > 0 || form.errors.confirm_password?.length > 0 || form.errors.terms?.length > 0)}
                <div class="mb-5">
                    <div class="flex items-start gap-3 rounded-xl border px-4 py-3.5 bg-red-50 border-red-200 opacity-100 transform-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert w-4 h-4 mt-0.5 shrink-0 text-red-500" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" x2="12" y1="8" y2="12"></line>
                            <line x1="12" x2="12.01" y1="16" y2="16"></line>
                        </svg>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs font-bold mb-0.5 text-red-700">{form.errors?.username?.length + form.errors?.email?.length + form.errors?.password?.length + form.errors?.confirm_password?.length + form.errors?.terms?.length} errors found</p>
                            <p class="text-xs leading-relaxed text-red-700">Please review and fix the highlighted fields below.</p>
                        </div>
                        <button type="button" class="shrink-0 mt-0.5 hover:opacity-70 transition-opacity text-red-500" aria-label="Dismiss">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-3.5 h-3.5" aria-hidden="true">
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            {/if}
            <form method="POST" action="/google-auth" class="space-y-3 mb-5" use:enhance={() => {
                loadingGoogleAuth = true;

                return async ({ update }) => {
                    await update();
                    loadingGoogleAuth = false;
                };
            }}>
                <button type="submit" disabled={loadingGoogleAuth} class="flex items-center justify-center cursor-pointer gap-3 w-full py-3 px-4 rounded-[14px] border-2 border-[#e6e0d4] bg-white text-[#1a232e] text-sm font-semibold hover:border-[#1a232e]/30 hover:shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    {#if !loadingGoogleAuth}
                        Sign up with Google
                    {:else}
                        Google Signing up...
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-width="2" 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            class="animate-spin w-4 h-4" 
                            aria-hidden="true"
                        >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    {/if}
                </button>
            </form>
            <div class="flex items-center gap-3 my-2">
                <div class="flex-1 h-px bg-[#e6e0d4]"></div>
                <span class="text-[11px] text-gray-400 font-medium uppercase tracking-widest whitespace-nowrap">or continue with email</span>
                <div class="flex-1 h-px bg-[#e6e0d4]"></div>
            </div>
            <form class="space-y-4 mt-4" method="POST" use:enhance={() => {
                loadingSignUp = true;

                return async ({ update }) => {
                    await update();
                    loadingSignUp = false;
                };
            }}>
                <Input wrapper={true} name="username" label="Username" placeholder="Username" value={form?.username || ''} errorCondition={form && form.errors.username?.length > 0 ? true : false} error={form && form.errors.username[0]}>
                        {#snippet icon()}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user w-4 h-4" aria-hidden="true">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        {/snippet}
                </Input>
                <Input wrapper={true} name="email" label="Email address" placeholder="you@example.com" type="email" value={form?.email || ''} errorCondition={form && form.errors.email?.length > 0 ? true : false} error={form && form.errors.email[0]}>
                        {#snippet icon()}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail w-4 h-4" aria-hidden="true">
                                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                            </svg>
                        {/snippet}
                </Input>
                <Input wrapper={true} name="password" label="Password" placeholder="••••••••" type="password" value={form?.password || ''} errorCondition={form && form.errors.password?.length > 0 ? true : false} error={form && form.errors.password[0]}>
                        {#snippet icon()}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock w-4 h-4" aria-hidden="true">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        {/snippet}
                </Input>
                <Input wrapper={true} name="confirm_password" label="Confirm password" placeholder="••••••••" type="password" value={form?.confirm_password || ''} errorCondition={form && form.errors.confirm_password?.length > 0 ? true : false} error={form && form.errors.confirm_password[0]}>
                        {#snippet icon()}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock w-4 h-4" aria-hidden="true">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        {/snippet}
                </Input>
                <div class="space-y-1">
                    <label class="flex items-start gap-2.5 group" for="terms">
                        <input type="checkbox" name="terms" checked={form?.terms || false} class="w-4 h-4 rounded border-2 flex items-center focus:ring-0 focus:outline-none checked:bg-[#1a232e] checked:border-[#1a232e] checked:text-white justify-center transition-all shrink-0 mt-0.5 cursor-pointer {form && form.errors.terms?.length > 0 ? 'border-red-400' : 'border-[#c8c0b4] hover:border-[#1a232e]/50'}" />
                        <span class="text-xs text-gray-500 select-none leading-relaxed">I agree to the 
                            <a href="/" class="text-[#1a232e] font-bold hover:underline">Terms of Service</a> and 
                            <a href="/" class="text-[#1a232e] font-bold hover:underline">Privacy Policy</a>
                        </span>
                    </label>
                    {#if form && form.errors.terms?.length > 0}
                        <p class="flex items-center gap-1.5 text-xs text-red-500 font-medium opacity-100 transform-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert w-3.5 h-3.5 shrink-0" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" x2="12" y1="8" y2="12"></line>
                                <line x1="12" x2="12.01" y1="16" y2="16"></line>
                            </svg>
                            {form.errors.terms[0]}
                        </p>
                    {/if}
                </div>
                <button type="submit" disabled={loadingSignUp} class="w-full flex items-center cursor-pointer justify-center gap-2.5 bg-[#1a232e] text-white py-3.5 rounded-[14px] font-bold text-sm hover:bg-[#2d3b4b] hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                    {#if !loadingSignUp}
                        Sign Up
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-4 h-4" aria-hidden="true">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    {:else}
                        Signing up...
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-width="2" 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            class="animate-spin w-4 h-4" 
                            aria-hidden="true"
                        >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    {/if}
                </button>
            </form>
        </div>
    </div>
</div>

