<script lang="ts">
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    let sectionRef = $state<HTMLElement>();
    let contentRef = $state<HTMLElement>();
    let buttonRef = $state<HTMLElement>();

    $effect(() => {
        if (!sectionRef) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context((self) => {
            // Section reveal
            if (contentRef) {
                gsap.from(contentRef, {
                    opacity: 0,
                    y: 30,
                    scale: 0.98,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef,
                        start: "top 80%"
                    }
                });
            }

            // Button subtle pulse
            if (buttonRef) {
                gsap.to(buttonRef, {
                    scale: 1.02,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }

            // Background pattern drift
            const selector = self.selector;
            if (selector) {
                gsap.to(selector(".bg-pattern"), {
                    backgroundPosition: "40px 40px",
                    duration: 20,
                    repeat: -1,
                    ease: "none"
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    });
</script>

<section bind:this={sectionRef} class="py-24 bg-[#1a232e] relative overflow-hidden">
    <div class="bg-pattern absolute inset-0 opacity-5 pointer-events-none" style="background-image: repeating-linear-gradient(45deg, rgb(255, 255, 255) 0px, rgb(255, 255, 255) 1px, transparent 1px, transparent 50%); background-size: 20px 20px;"></div>
    
    <div bind:this={contentRef} class="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div class="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-feather w-3 h-3" aria-hidden="true">
                <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"></path>
                <path d="M16 8 2 22"></path>
                <path d="M17.5 15H9"></path>
            </svg>Begin Your Journey
        </div>
        
        <h2 class="font-serif text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Your library is waiting to be built.</h2>
        <p class="text-gray-400 text-base sm:text-lg mb-10 leading-relaxed px-2">Every reader deserves a beautiful, organised collection. Start adding books today — it's completely free.</p>
        
        <div class="flex flex-wrap justify-center gap-4">
            <button bind:this={buttonRef} class="group w-full sm:w-auto flex items-center justify-center gap-3 bg-[#fdfaf6] text-[#1a232e] px-10 py-4 rounded-2xl font-bold text-base shadow-xl hover:bg-white hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library w-5 h-5" aria-hidden="true">
                    <path d="m16 6 4 14"></path>
                    <path d="M12 6v14"></path>
                    <path d="M8 8v12"></path>
                    <path d="M4 4v16"></path>
                </svg>Open My Library
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                </svg>
            </button>
        </div>
        
        <p class="text-gray-600 text-xs sm:text-sm mt-6 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield w-4 h-4" aria-hidden="true">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            </svg>Free to use · No account required · Private by default
        </p>
    </div>
</section>
