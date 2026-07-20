<script lang="ts">
    import Button from "$lib/components/shared/Button.svelte";
    import gsap from "gsap";
    import ScrollTrigger from "gsap/ScrollTrigger";
    import ScrollToPlugin from "gsap/ScrollToPlugin";
    import { navigationState } from "$lib/state/navigation-state.svelte";
    import { getUserState } from "$lib/state/user-state.svelte";

    let sectionRef = $state<HTMLElement>();
    let badgeRef = $state<HTMLElement>();
    let titleRef = $state<HTMLElement>();
    let descRef = $state<HTMLElement>();
    let ctasRef = $state<HTMLElement>();
    let booksRef = $state<HTMLDivElement>();
    let scrollHintRef = $state<HTMLElement>();
    let blobsRef = $state<HTMLElement>();

    let userContext = getUserState();
    let { user } = $derived(userContext);

    const scrollToFeatures = () => {
        gsap.registerPlugin(ScrollToPlugin);
        if (navigationState.features) {
            gsap.to(window, {
                duration: 1.2,
                ease: "power3.out",
                scrollTo: {
                    y: navigationState.features,
                    autoKill: true
                }
            });
        }
    };

    $effect(() => {
        if (!sectionRef) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context((self) => {
            const elementsToAnim = [badgeRef, titleRef, descRef, ctasRef, scrollHintRef].filter(Boolean);
            
            if (elementsToAnim.length) {
                gsap.set(elementsToAnim, { 
                    opacity: 0, 
                    y: 30 
                });
            }
            const selector = self.selector;
            if (selector) {
                gsap.set(selector(".book-item"), { opacity: 0, scale: 0.8, y: 50 });

                const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });

                if (badgeRef) tl.to(badgeRef, { opacity: 1, y: 0, duration: 0.8 });
                if (titleRef) tl.to(titleRef, { opacity: 1, y: 0, stagger: 0.1 }, "-=0.6");
                if (descRef) tl.to(descRef, { opacity: 1, y: 0 }, "-=0.8");
                if (ctasRef) tl.to(ctasRef, { opacity: 1, y: 0 }, "-=0.8");
                
                tl.to(selector(".book-item"), { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    stagger: 0.15,
                    ease: "back.out(1.7)" 
                }, "-=1");

                if (scrollHintRef) tl.to(scrollHintRef, { opacity: 1, y: 0 }, "-=0.5");

                // Floating Animation for books
                gsap.to(selector(".book-item"), {
                    y: "random(-15, 15)",
                    x: "random(-10, 10)",
                    rotation: "random(-2, 2)",
                    duration: "random(2, 4)",
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });

                // Ambient blob animations
                if (blobsRef) {
                    gsap.to(selector(".ambient-blob"), {
                        x: "random(-50, 50)",
                        y: "random(-50, 50)",
                        scale: "random(0.8, 1.2)",
                        rotation: "random(-45, 45)",
                        duration: "random(5, 10)",
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                        stagger: 0.5
                    });
                }
            }

            if (booksRef) {
                gsap.to(booksRef, {
                    y: -60,
                    scrollTrigger: {
                        trigger: sectionRef,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1
                    }
                });
            }
        }, sectionRef);

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 40;
            const yPos = (clientY / window.innerHeight - 0.5) * 40;

            ctx.add(() => {
                gsap.to(".book-item", {
                    x: (i) => xPos * (i + 1) * 0.2,
                    y: (i) => yPos * (i + 1) * 0.2,
                    duration: 1,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            ctx.revert();
            window.removeEventListener("mousemove", handleMouseMove);
        };
    });
</script>

<section 
    bind:this={sectionRef}
    class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#faf8f4] pt-20"
>
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0 overflow-hidden" bind:this={blobsRef}>
        <div class="ambient-blob absolute top-[20%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[120px] opacity-70 will-change-transform"></div>
        <div class="ambient-blob absolute top-[30%] right-[10%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-amber-300/20 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[120px] opacity-60 will-change-transform"></div>
        <div class="ambient-blob absolute bottom-[10%] left-[30%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] bg-indigo-400/15 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[120px] opacity-70 will-change-transform"></div>
    </div>
    
    <div class="absolute inset-0 z-0 opacity-[0.02]" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a232e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);"></div>
    <div class="absolute inset-0 bg-linear-to-b from-[#faf8f4]/10 via-transparent to-[#faf8f4] z-0"></div>
    
    <div class="relative z-10 text-center px-4 max-w-6xl mx-auto w-full">
        <!-- Badge -->
        <div 
            bind:this={badgeRef}
            class="group inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] text-[#1a232e] py-1.5 pl-2 pr-5 rounded-full text-xs font-bold uppercase tracking-widest my-8 ring-1 ring-purple-500/10 hover:ring-purple-500/40 hover:shadow-[0_4px_24px_rgba(147,51,234,0.2)] transition-all duration-500 cursor-default will-change-transform"
        >
            <div class="relative flex items-center justify-center w-7 h-7 rounded-full">
                <!-- Sweeping border effect -->
                <div class="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_280deg,#9333ea_360deg)] animate-[spin_3s_linear_infinite] group-hover:animate-[spin_1.5s_linear_infinite] opacity-60"></div>
                <div class="absolute inset-px bg-linear-to-tr from-purple-50 to-amber-50 rounded-full flex items-center justify-center z-10 shadow-inner group-hover:scale-[0.95] transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-4 h-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-15">
                        <defs>
                            <linearGradient id="badge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#7e22ce" />
                                <stop offset="50%" stop-color="#d946ef" />
                                <stop offset="100%" stop-color="#ea580c" />
                            </linearGradient>
                        </defs>
                        <!-- Orbital paths 
                        <circle cx="12" cy="12" r="8" stroke="url(#badge-grad)" stroke-width="1.5" stroke-dasharray="6 3" class="animate-[spin_10s_linear_infinite_reverse] origin-center" />-->
                        <!-- Solid star core -->
                        <path stroke="url(#badge-grad)" fill="url(#badge-grad)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                    </svg>
                </div>
            </div>
            <span class="bg-clip-text text-transparent bg-linear-to-r from-gray-800 to-gray-900 group-hover:from-purple-800 group-hover:to-amber-600 transition-all duration-500">
                AI-Powered Digital Library
            </span>
        </div>

        <!-- Title -->
        <h1 
            bind:this={titleRef}
            class="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-[#1a232e] leading-[1.05] md:leading-[1.02] tracking-tight mb-6 will-change-transform"
        >
            Every great story<br/>
            deserves an <span class="relative inline-block whitespace-nowrap">
                <span class="relative z-10 bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-amber-500">
                    intelligent home.
                </span>
                <span class="absolute -bottom-1 lg:-bottom-2 left-0 right-0 h-3 lg:h-4 bg-linear-to-r from-purple-200 via-indigo-200 to-amber-200 rounded-sm origin-left z-0 opacity-50"></span>
            </span>
        </h1>

        <!-- Description -->
        <p 
            bind:this={descRef}
            class="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10 px-2 font-medium will-change-transform"
        >
            Atheum is your premium digital library. Track your reading journey, organize your collection, and <strong class="text-[#1a232e] font-semibold">generate complete, professional ebooks</strong> on any topic with advanced AI.
        </p>

        <!-- CTAs -->
        <div 
            bind:this={ctasRef}
            class="flex flex-col min-[520px]:flex-row items-center justify-center gap-4 mb-20 px-4 relative z-20 will-change-transform"
        >
            {#if user}
                 <Button href="/library" variant="primary" size="lg" class="w-full min-[520px]:w-auto group gap-3 bg-[#1a232e] hover:bg-black text-white shadow-[0_8px_30px_rgb(26,35,46,0.3)] hover:shadow-[0_8px_40px_rgb(26,35,46,0.4)] hover:-translate-y-0.5 duration-300 rounded-2xl py-4 px-8 border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" aria-hidden="true">
                        <path d="m16 6 4 14"></path>
                        <path d="M12 6v14"></path>
                        <path d="M8 8v12"></path>
                        <path d="M4 4v16"></path>
                    </svg>Go to Library
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Button>
            {:else}
                <Button href="/sign-up" variant="primary" size="lg" class="inline-flex w-full min-[520px]:w-auto group gap-3 bg-[#1a232e] hover:bg-black text-white shadow-[0_8px_30px_rgb(26,35,46,0.3)] hover:shadow-[0_8px_40px_rgb(26,35,46,0.4)] hover:-translate-y-0.5 duration-300 rounded-2xl py-4 px-8 border border-white/10 relative overflow-hidden">
                    <div class="absolute inset-0 bg-linear-to-r from-purple-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span class="relative z-10 flex items-center gap-2 drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 inline mr-2" aria-hidden="true">
                            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                        </svg>Start for Free
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform relative z-10" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Button>
                <Button href="/login" variant="outline" size="lg" class="w-full min-[520px]:w-auto group bg-white/70 backdrop-blur-md border border-[#1a232e]/10 hover:border-[#1a232e]/30 shadow-sm hover:shadow-md hover:bg-white text-[#1a232e] duration-300 rounded-2xl py-4 px-8">Sign In
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ml-2 inline opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Button>
            {/if}
            <button 
                onclick={scrollToFeatures}
                class="flex items-center gap-2 text-gray-500 px-5 py-4 font-medium text-base hover:text-[#1a232e] transition-all duration-300 cursor-pointer rounded-2xl hover:bg-gray-100/50"
            >
                Explore Features
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </button>
        </div>

        <!-- Books Visual -->
        <div
            bind:this={booksRef}
            class="relative flex justify-center items-end gap-2 sm:gap-5 md:gap-7 lg:gap-10 h-56 min-[400px]:h-64 sm:h-80 md:h-104 lg:h-128 mb-6 z-10 will-change-transform"
        >
            <div class="book-item group relative cursor-pointer w-24 min-[400px]:w-32 sm:w-40 md:w-56 lg:w-64 -mb-5 -rotate-10 shrink-0 transform-origin-bottom will-change-transform">
                <div class="relative aspect-2/3 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 will-change-transform group-hover:-translate-y-5 group-hover:scale-[1.04] group-hover:rotate-3 group-hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.4)] border border-white/40 ring-1 ring-black/5">
                    <img alt="The Design of Everyday Things" decoding="async" fetchpriority="high" loading="eager" width="600" height="900" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1667039487487-2af414218c49?auto=format&fit=crop&q=60&fm=webp&w=600&h=900">
                    <div class="absolute inset-0 bg-linear-to-t from-[#1a232e]/95 via-[#1a232e]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-left transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                        <p class="font-serif font-bold text-white text-sm sm:text-base md:text-xl leading-tight line-clamp-2 drop-shadow-md">The Design of Everyday Things</p>
                        <p class="text-white/80 text-xs sm:text-sm mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 transform translate-y-2 group-hover:translate-y-0">Don Norman</p>
                    </div>
                </div>
            </div>

            <div class="book-item group relative cursor-pointer w-32 min-[400px]:w-40 sm:w-48 md:w-72 lg:w-80 z-20 mb-0 shrink-0 transform-origin-bottom will-change-transform">
                <div class="absolute -inset-4 md:-inset-8 bg-linear-to-tr from-amber-500/30 to-purple-500/30 blur-2xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 will-change-transform scale-90 group-hover:scale-100 mix-blend-multiply"></div>
                <div class="relative aspect-2/3 rounded-2xl md:rounded-4xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(26,35,46,0.5)] transition-all duration-500 will-change-transform group-hover:-translate-y-8 group-hover:scale-[1.06] group-hover:shadow-[0_40px_70px_-20px_rgba(26,35,46,0.6)] border border-white/40 ring-1 ring-black/5 bg-[#1a232e]">
                    <img alt="The Communication Book" decoding="async" fetchpriority="high" loading="eager" width="600" height="900" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" src="https://images.unsplash.com/photo-1591202928585-ae660165f73c?auto=format&fit=crop&q=60&fm=webp&w=600&h=900">
                    <div class="absolute inset-0 bg-linear-to-t from-[#1a232e] via-[#1a232e]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-5 md:p-8 text-left transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <p class="font-serif font-bold text-white text-base sm:text-lg md:text-3xl leading-tight line-clamp-2 drop-shadow-lg">The Communication Book</p>
                        <p class="text-white/80 text-xs sm:text-sm md:text-base mt-2 md:mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-2 group-hover:translate-y-0">
                            <span class="w-6 md:w-8 h-[2px] bg-amber-400 rounded-full"></span> Mikael Krogerus
                        </p>
                    </div>
                </div>
                <!-- Premium Glow Tag -->
                <div class="absolute -top-3 -right-3 md:-top-5 md:-right-5 bg-linear-to-br from-indigo-500 via-purple-500 to-amber-500 text-white text-[10px] md:text-xs lg:text-sm font-bold px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl shadow-xl uppercase tracking-widest transform group-hover:scale-110 transition-all duration-500 border border-white/20 z-30 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 md:w-4 md:h-4" aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path></svg>
                    AI Generated
                </div>
            </div>

            <div class="book-item group relative cursor-pointer w-24 min-[400px]:w-32 sm:w-40 md:w-56 lg:w-64 z-10 -mb-5 rotate-10 shrink-0 transform-origin-bottom will-change-transform">
                <div class="relative aspect-2/3 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 will-change-transform group-hover:-translate-y-5 group-hover:scale-[1.04] group-hover:-rotate-3 group-hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.4)] border border-white/40 ring-1 ring-black/5">
                    <img alt="How Innovation Works" decoding="async" fetchpriority="high" loading="eager" width="600" height="900" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&amp;fit=crop&amp;q=60&amp;fm=webp&amp;w=600&amp;h=900">
                    <div class="absolute inset-0 bg-linear-to-t from-[#1a232e]/95 via-[#1a232e]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-left transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                        <p class="font-serif font-bold text-white text-sm sm:text-base md:text-xl leading-tight line-clamp-2 drop-shadow-md">How Innovation Works</p>
                        <p class="text-white/80 text-xs sm:text-sm mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 transform translate-y-2 group-hover:translate-y-0">Matt Ridley</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <button 
        bind:this={scrollHintRef}
        onclick={scrollToFeatures}
        aria-label="scroll"
        class="bottom-4 flex flex-col items-center gap-2 text-[#1a232e]/60 hover:text-[#1a232e] transition-colors cursor-pointer border-none bg-transparent group z-20 will-change-transform"
    >
        <div class="w-18 h-18 flex items-center justify-center transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 animate-bounce mt-1" aria-hidden="true">
                <path d="m6 9 6 6 6-6"></path>
            </svg>
        </div>
    </button>
</section>