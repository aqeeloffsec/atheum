<script lang="ts">
    import Button from "$lib/components/shared/Button.svelte";
    import gsap from "gsap";
    import ScrollTrigger from "gsap/ScrollTrigger";
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
            class="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-[#1a232e] leading-[1.1] md:leading-[1.05] tracking-tight mb-6"
        >
            Every great story 
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
            class="flex flex-col min-[400px]:flex-row items-center justify-center gap-4 mb-16 px-4"
        >
            {#if user}
                 <Button href="/library" variant="primary" size="lg" class="w-full min-[400px]:w-auto group gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 duration-200">
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
                <Button href="/sign-up" variant="primary" size="lg" class="w-full min-[400px]:w-auto group gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 duration-200">
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
                <Button href="/login" variant="outline" size="lg" class="w-full min-[400px]:w-auto group border-2 border-[#1a232e]/20 hover:border-[#1a232e]/60 duration-200">Sign In
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-4 h-4 opacity-60" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Button>
            {/if}
            <a href="#features" class="flex items-center gap-2 text-gray-500 px-5 py-4 font-medium text-base hover:text-[#1a232e] transition-all duration-200">Explore Features
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-4 h-4" aria-hidden="true">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </a>
        </div>

        <div 
            bind:this={booksRef}
            class="relative flex justify-center items-end gap-4 md:gap-6 h-72 md:h-96"
        >
            <div class="book-item relative cursor-pointer w-28 md:w-36" style="margin-bottom: -16px; transform: rotate(-6deg);">
                <div class="relative aspect-2/3 rounded-xl overflow-hidden shadow-2xl">
                    <img alt="The Shadow of the Wind" class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&amp;fit=crop&amp;q=80&amp;w=300&amp;h=450">
                    <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-3 text-left">
                        <p class="font-serif font-bold text-white text-xs leading-tight line-clamp-2">The Shadow of the Wind</p>
                    </div>
                </div>
            </div>

            <div class="book-item relative cursor-pointer w-36 md:w-48 z-10" style="margin-bottom: 0px;">
                <div class="relative aspect-2/3 rounded-xl overflow-hidden shadow-2xl">
                    <img alt="Pride and Prejudice" class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&amp;fit=crop&amp;q=80&amp;w=300&amp;h=450">
                    <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-3 text-left">
                        <p class="font-serif font-bold text-white text-xs leading-tight line-clamp-2">Pride and Prejudice</p>
                    </div>
                </div>
                <div class="absolute -top-3 -right-3 bg-emerald-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg uppercase tracking-wide">★ Featured</div>
            </div>

            <div class="book-item relative cursor-pointer w-28 md:w-36" style="margin-bottom: -16px; transform: rotate(6deg);">
                <div class="relative aspect-2/3 rounded-xl overflow-hidden shadow-2xl">
                    <img alt="Dune" class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&amp;fit=crop&amp;q=80&amp;w=300&amp;h=450">
                    <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-3 text-left">
                        <p class="font-serif font-bold text-white text-xs leading-tight line-clamp-2">Dune</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div 
        bind:this={scrollHintRef}
        class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 cursor-pointer"
    >
        <span class="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-4 h-4 animate-bounce" aria-hidden="true">
            <path d="m6 9 6 6 6-6"></path>
        </svg>
    </div>
</section>