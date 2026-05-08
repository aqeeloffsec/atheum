<script lang="ts">
    import gsap from "gsap";
    import ScrollTrigger from "gsap/ScrollTrigger";

    let sectionRef = $state<HTMLElement>();
    let cardRef = $state<HTMLElement>();

    $effect(() => {
        if (!sectionRef) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context((self) => {
            if (cardRef) {
                gsap.from(cardRef, {
                    opacity: 0,
                    y: 50,
                    scale: 0.95,
                    rotateX: 5,
                    duration: 1.5,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: sectionRef,
                        start: "top 80%"
                    }
                });

                // Mesh gradient animation
                gsap.to(cardRef, {
                    backgroundPosition: "200% 50%",
                    duration: 15,
                    repeat: -1,
                    ease: "none"
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    });
</script>

<section bind:this={sectionRef} class="py-32 bg-[#faf8f4] overflow-hidden px-4 md:px-6 relative">
    <!-- Ambient transition from Testimonials to BeginJourney -->
    <div class="absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-[#0b1016] to-transparent pointer-events-none"></div>

    <div 
        bind:this={cardRef} 
        class="max-w-6xl mx-auto rounded-[3rem] p-10 sm:p-16 md:p-24 relative overflow-hidden shadow-[0_20px_80px_rgba(147,51,234,0.2)]"
        style="background: linear-gradient(120deg, #4f46e5 0%, #9333ea 50%, #ea580c 100%); background-size: 200% auto;"
    >
        <!-- Card Inner Assets -->
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        <div class="absolute inset-0 bg-linear-to-b from-white/10 to-transparent border border-white/20 rounded-[3rem]"></div>
        <div class="absolute -top-32 -left-32 w-64 h-64 bg-white/20 blur-3xl rounded-full pointer-events-none"></div>
        
        <div class="relative z-10 text-center flex flex-col items-center">
            <div class="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md text-white border border-white/20 shadow-inner px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"></path><path d="M16 8 2 22"></path><path d="M17.5 15H9"></path></svg>
                Begin Your Journey
            </div>
            
            <h2 class="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight drop-shadow-md">
                Your intelligent library<br class="hidden sm:block"/> is waiting.
            </h2>
            <p class="text-white/80 text-lg md:text-xl lg:text-2xl mb-12 leading-relaxed max-w-3xl font-medium">
                Every reader deserves a beautiful, organized collection. Start tracking your books or generate your own AI ebooks today.
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 w-full sm:w-auto">
                <a href="/library" class="group w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-purple-900 px-8 md:px-10 py-5 rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] hover:-translate-y-1 hover:bg-gray-50 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="m16 6 4 14"></path><path d="M12 6v14"></path><path d="M8 8v12"></path><path d="M4 4v16"></path></svg>
                    Start for Free
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 ml-1 group-hover:translate-x-1.5 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </a>
            </div>
        </div>
    </div>
</section>
