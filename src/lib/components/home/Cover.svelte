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

    //let { scrollToSection } = $props();

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
            // Defensive checks for refs
            const elementsToAnim = [badgeRef, titleRef, descRef, ctasRef, scrollHintRef].filter(Boolean);
            
            // Initial states
            if (elementsToAnim.length) {
                gsap.set(elementsToAnim, { 
                    opacity: 0, 
                    y: 30 
                });
            }
            const selector = self.selector;
            if (selector) {
                gsap.set(selector(".book-item"), { opacity: 0, scale: 0.8, y: 50 });

                // Hero Timeline
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
            }

            // Scroll Parallax for the entire books container
            if (booksRef) {
                gsap.to(booksRef, {
                    y: -50,
                    scrollTrigger: {
                        trigger: sectionRef,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        }, sectionRef);

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 40;
            const yPos = (clientY / window.innerHeight - 0.5) * 40;

            // Use context to scope mouse move selection
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
    class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#fdfaf6] pt-20"
>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f0ebe0_0%,#fdfaf6_60%)]"></div>
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a232e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);"></div>
    
    <div class="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div 
            bind:this={badgeRef}
            class="inline-flex items-center gap-2 bg-[#1a232e] text-[#fdfaf6] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest my-8 shadow-lg"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library w-3.5 h-3.5" aria-hidden="true">
                <path d="m16 6 4 14"></path>
                <path d="M12 6v14"></path>
                <path d="M8 8v12"></path>
                <path d="M4 4v16"></path>
            </svg>Your Personal Digital Library
        </div>

        <h1 
            bind:this={titleRef}
            class="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-[#1a232e] leading-[1.1] md:leading-[1.05] tracking-tight mb-6"
        >
            Every great story<br/>
            <span class="relative inline-block">
                <span class="relative z-10">deserves</span>
                <span class="absolute -bottom-1 left-0 right-0 h-3 bg-amber-200/70 rounded-sm origin-left z-0"></span>
            </span> a home.
        </h1>

        <p 
            bind:this={descRef}
            class="text-base md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10 px-2"
        >
            Atheum is a beautifully designed personal book library. Track your reading journey, organize your collection, and rediscover the joy of books.
        </p>

        <div 
            bind:this={ctasRef}
            class="flex flex-col min-[520px]:flex-row items-center justify-center gap-4 mb-16 px-4"
        >
            {#if user}
                 <Button href="/library" variant="primary" size="lg" class="w-full min-[520px]:w-auto group gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library w-5 h-5" aria-hidden="true">
                        <path d="m16 6 4 14"></path>
                        <path d="M12 6v14"></path>
                        <path d="M8 8v12"></path>
                        <path d="M4 4v16"></path>
                    </svg>Go to Library
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Button>
            {:else}
                <Button href="/sign-up" variant="primary" size="lg" class="w-full min-[520px]:w-auto group gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library w-5 h-5" aria-hidden="true">
                        <path d="m16 6 4 14"></path>
                        <path d="M12 6v14"></path>
                        <path d="M8 8v12"></path>
                        <path d="M4 4v16"></path>
                    </svg>Start for Free
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Button>
                <Button href="/login" variant="outline" size="lg" class="w-full min-[520px]:w-auto group border-2 border-[#1a232e]/20 hover:border-[#1a232e]/60 duration-200">Sign In
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-4 h-4 opacity-60" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Button>
            {/if}
            <button 
                onclick={scrollToFeatures}
                class="flex items-center gap-2 text-gray-500 px-5 py-4 font-medium text-base hover:text-[#1a232e] transition-all duration-200 cursor-pointer"
            >
                Explore Features
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-4 h-4" aria-hidden="true">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </button>
        </div>

        <div 
            bind:this={booksRef}
            class="relative flex justify-center items-end gap-5 md:gap-10 lg:gap-14 h-88 sm:h-96 md:h-128 mb-8"
        >
            <div class="book-item group relative cursor-pointer w-32 sm:w-40 md:w-52 lg:w-60 -mb-5 -rotate-8">
                <div class="relative aspect-2/3 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 will-change-transform group-hover:-translate-y-4 group-hover:scale-[1.03] group-hover:rotate-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] border border-white/20 after:absolute after:inset-0 after:rounded-2xl md:after:rounded-3xl after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)] z-0 group-hover:z-50">
                    <img alt="The Shadow of the Wind" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1667039487487-2af414218c49?auto=format&fit=crop&q=80&w=600&h=900">
                    <div class="absolute inset-0 bg-linear-to-t from-[#1a232e]/90 via-[#1a232e]/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-left transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                        <p class="font-serif font-bold text-white text-sm sm:text-base md:text-xl leading-tight line-clamp-2 drop-shadow-md">The Design of Everyday Things</p>
                        <p class="text-white/80 text-xs sm:text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 filter blur-[2px] group-hover:blur-none">Don Norman</p>
                    </div>
                </div>
            </div>

            <div class="book-item group relative cursor-pointer w-40 sm:w-48 md:w-64 lg:w-72 z-20 mb-0">
                <div class="absolute -inset-4 md:-inset-6 bg-amber-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 will-change-transform scale-90 group-hover:scale-100"></div>
                <div class="relative aspect-2/3 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 will-change-transform group-hover:-translate-y-6 group-hover:scale-[1.05] group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border border-white/20 after:absolute after:inset-0 after:rounded-2xl md:after:rounded-3xl after:shadow-[inset_0_2px_10px_0_rgba(255,255,255,0.15)] bg-[#1a232e]">
                    <img alt="Pride and Prejudice" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" src="https://images.unsplash.com/photo-1591202928585-ae660165f73c?auto=format&fit=crop&q=80&w=600&h=900">
                    <div class="absolute inset-0 bg-linear-to-t from-[#1a232e] via-[#1a232e]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-5 md:p-8 text-left transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <p class="font-serif font-bold text-white text-base sm:text-lg md:text-2xl leading-tight line-clamp-2 drop-shadow-lg">The Communication Book</p>
                        <p class="text-white/80 text-xs sm:text-sm md:text-base mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 transform translate-y-2 group-hover:translate-y-0">
                            <span class="w-4 h-px bg-amber-400"></span> Mikael Krogerus & Roman Tschäppeler
                        </p>
                    </div>
                </div>
                <div class="absolute -top-3 -right-3 md:-top-5 md:-right-5 bg-linear-to-br from-emerald-400 to-emerald-600 text-white text-[10px] md:text-xs lg:text-sm font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl shadow-xl uppercase tracking-widest transform group-hover:scale-110 transition-all duration-500 border border-emerald-300/30 z-30">★ Featured</div>
            </div>

            <div class="book-item group relative cursor-pointer w-32 sm:w-40 md:w-52 lg:w-60 z-10 -mb-5 rotate-8">
                <div class="relative aspect-2/3 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 will-change-transform group-hover:-translate-y-4 group-hover:scale-[1.03] group-hover:-rotate-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] border border-white/20 after:absolute after:inset-0 after:rounded-2xl md:after:rounded-3xl after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]">
                    <img alt="Dune" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&amp;fit=crop&amp;q=80&amp;w=600&amp;h=900">
                    <div class="absolute inset-0 bg-linear-to-t from-[#1a232e]/90 via-[#1a232e]/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-left transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                        <p class="font-serif font-bold text-white text-sm sm:text-base md:text-xl leading-tight line-clamp-2 drop-shadow-md">How Innovation Works</p>
                        <p class="text-white/80 text-xs sm:text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 filter blur-[2px] group-hover:blur-none">Matt Ridley</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <button 
        bind:this={scrollHintRef}
        onclick={scrollToFeatures}
        aria-label="scroll"
        class="bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#1a232e] cursor-pointer border-none bg-transparent"
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-4 h-4 animate-bounce" aria-hidden="true">
            <path d="m6 9 6 6 6-6"></path>
        </svg>
    </button>
</section>