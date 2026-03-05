<script lang="ts">
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    let sectionRef = $state<HTMLElement>();
    let headerRef = $state<HTMLElement>();

    $effect(() => {
        if (!sectionRef) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context((self) => {
            // Header reveal
            if (headerRef) {
                gsap.from(headerRef, {
                    opacity: 0,
                    y: 20,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef,
                        start: "top 90%"
                    }
                });
            }

            // FAQ items staggered reveal
            const selector = self.selector;
            if (selector) {
                gsap.from(selector(".faq-item"), {
                    opacity: 0,
                    y: 20,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: selector(".space-y-3"),
                        start: "top 85%"
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    });
</script>

<section bind:this={sectionRef} class="py-24 bg-[#fdfaf6] overflow-hidden">
    <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <div bind:this={headerRef} class="text-center mb-14">
            <div class="inline-flex items-center gap-2 bg-[#1a232e]/8 text-[#1a232e] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-3 h-3" aria-hidden="true">
                    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                    <path d="M20 2v4"></path>
                    <path d="M22 4h-4"></path>
                    <circle cx="4" cy="20" r="2"></circle>
                </svg>FAQ
            </div>
            <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a232e] mb-4">Questions? We've got answers.</h2>
        </div>

        <div class="space-y-3">
            <div class="faq-item bg-white border border-[#e6e0d4] rounded-2xl overflow-hidden">
                <button class="w-full flex items-center justify-between p-5 text-left group">
                    <span class="font-serif font-bold text-[#1a232e] text-sm md:text-base pr-4 group-hover:text-amber-600 transition-colors">Is Atheum completely free to use?</span>
                    <div class="transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-5 h-5 text-gray-400 shrink-0" aria-hidden="true">
                            <path d="m6 9 6 6 6-6"></path>
                        </svg>
                    </div>
                </button>
            </div>

            <div class="faq-item bg-white border border-[#e6e0d4] rounded-2xl overflow-hidden">
                <button class="w-full flex items-center justify-between p-5 text-left group">
                    <span class="font-serif font-bold text-[#1a232e] text-sm md:text-base pr-4 group-hover:text-amber-600 transition-colors">Can I import my Goodreads library?</span>
                    <div class="transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-5 h-5 text-gray-400 shrink-0" aria-hidden="true">
                            <path d="m6 9 6 6 6-6"></path>
                        </svg>
                    </div>
                </button>
            </div>

            <div class="faq-item bg-white border border-[#e6e0d4] rounded-2xl overflow-hidden">
                <button class="w-full flex items-center justify-between p-5 text-left group">
                    <span class="font-serif font-bold text-[#1a232e] text-sm md:text-base pr-4 group-hover:text-amber-600 transition-colors">Does it work on mobile?</span>
                    <div class="transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-5 h-5 text-gray-400 shrink-0" aria-hidden="true">
                            <path d="m6 9 6 6 6-6"></path>
                        </svg>
                    </div>
                </button>
            </div>

            <div class="faq-item bg-white border border-[#e6e0d4] rounded-2xl overflow-hidden">
                <button class="w-full flex items-center justify-between p-5 text-left group">
                    <span class="font-serif font-bold text-[#1a232e] text-sm md:text-base pr-4 group-hover:text-amber-600 transition-colors">How do I add a book cover?</span>
                    <div class="transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-5 h-5 text-gray-400 shrink-0" aria-hidden="true">
                            <path d="m6 9 6 6 6-6"></path>
                        </svg>
                    </div>
                </button>
            </div>

            <div class="faq-item bg-white border border-[#e6e0d4] rounded-2xl overflow-hidden">
                <button class="w-full flex items-center justify-between p-5 text-left group">
                    <span class="font-serif font-bold text-[#1a232e] text-sm md:text-base pr-4 group-hover:text-amber-600 transition-colors">Is my reading data private?</span>
                    <div class="transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-5 h-5 text-gray-400 shrink-0" aria-hidden="true">
                            <path d="m6 9 6 6 6-6"></path>
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    </div>
</section>