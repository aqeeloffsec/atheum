<script lang="ts">
    import gsap from "gsap";
    import ScrollTrigger from "gsap/ScrollTrigger";
    import { slide } from 'svelte/transition';

    let sectionRef = $state<HTMLElement>();
    let headerRef = $state<HTMLElement>();
    
    let activeIndex = $state<number | null>(null);

    const faqs = [
        {
            question: "Is Atheum completely free to use?",
            answer: "Yes, Atheum offers a fully functional free tier that allows you to manage your library, track reading progress, and use core features. We also offer premium tiers for users who want advanced AI capabilities and analytics."
        },
        {
            question: "Can I import my Goodreads library?",
            answer: "Absolutely! We support direct CSV imports from Goodreads. Simply export your data from Goodreads and upload it in your Atheum settings. All your shelves, ratings, and reviews will be seamlessly transferred over."
        },
        {
            question: "Does it work on mobile?",
            answer: "Atheum is built as a fully responsive progressive web app. You can use it flawlessly on any device, whether it's your desktop, tablet, or smartphone. We are also optimizing specialized mobile experiences."
        },
        {
            question: "How do I add a book cover?",
            answer: "When adding a book, our system automatically searches our database for the cover. If one isn't found, or if you prefer a different edition's cover, you can easily upload your own beautiful high-res image directly in the edit panel."
        },
        {
            question: "How does the AI Ebook Generator work?",
            answer: "The AI Ebook Generator leverages bleeding-edge language models to craft customized, structured, and engaging ebooks based on your prompts. You simply provide a topic, outline constraints, and tone, and our architect AI drafts chapters that you can then finalize."
        },
        {
            question: "Is my reading data private?",
            answer: "We take your privacy seriously. Your reading habits, personal notes, and library data are completely private by default. You have full control over what you choose to share publicly or keep completely private."
        }
    ];

    $effect(() => {
        if (!sectionRef) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context((self) => {
            if (headerRef) {
                gsap.from(headerRef, {
                    opacity: 0,
                    y: 30,
                    scale: 0.98,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef,
                        start: "top 85%"
                    }
                });
            }

            const selector = self.selector;
            if (selector) {
                gsap.fromTo(selector(".faq-item"), {
                    opacity: 0,
                    x: -20
                }, {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: selector(".space-y-4"),
                        start: "top 85%"
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    });

    function toggleFaq(index: number) {
        activeIndex = activeIndex === index ? null : index;
    }
</script>

<section bind:this={sectionRef} class="py-32 bg-[#faf8f4] overflow-hidden relative">
    <!-- Ambient glow behind FAQ -->
    <div class="absolute left-0 top-[20%] w-[40vw] h-[40vw] bg-purple-200/30 rounded-full blur-[120px] pointer-events-none -translate-x-1/2"></div>
    <div class="absolute right-0 bottom-[20%] w-[40vw] h-[40vw] bg-amber-200/30 rounded-full blur-[120px] pointer-events-none translate-x-1/2"></div>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div bind:this={headerRef} class="text-center mb-16">
            <div class="inline-flex items-center gap-2 bg-white border border-[#1a232e]/5 shadow-sm text-[#1a232e] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border-b border-b-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#glow-grad-faq)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><defs><linearGradient id="glow-grad-faq" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9333ea" /><stop offset="100%" stop-color="#f59e0b" /></linearGradient></defs><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg>
                FAQ
            </div>
            <h2 class="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a232e] mb-4 tracking-tight">Questions? Answers.</h2>
        </div>

        <div class="space-y-4 relative">
            <div class="absolute left-6 top-6 bottom-6 w-px bg-linear-to-b from-purple-200 via-amber-200 to-transparent z-0"></div>

            {#each faqs as faq, index}
                <div class="faq-item relative z-10 group bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:bg-white/90 transition-all duration-300">
                    <button class="w-full flex items-center p-6 sm:p-8 text-left cursor-pointer" onclick={() => toggleFaq(index)}>
                        <div class="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center mr-5 {activeIndex === index ? 'bg-linear-to-br from-purple-500 to-amber-500 shadow-md text-white' : 'bg-[#f5f3f0] text-gray-400 group-hover:bg-[#ece8e0]'} transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-transform duration-500 {activeIndex === index ? 'rotate-180' : ''}"><path d="m6 9 6 6 6-6"></path></svg>
                        </div>
                        <span class="font-serif font-bold text-[#1a232e] text-lg sm:text-xl pr-4 transition-colors {activeIndex === index ? 'text-purple-700' : 'group-hover:text-purple-600'}">{faq.question}</span>
                    </button>
                    {#if activeIndex === index}
                        <div transition:slide={{ duration: 400, axis: 'y' }} class="px-6 sm:px-8 pb-8 pt-0 pl-22 sm:pl-26">
                            <p class="text-base sm:text-lg text-gray-600 leading-relaxed font-medium">
                                {faq.answer}
                            </p>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>