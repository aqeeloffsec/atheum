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
            answer: "Yes, Atheum offers a fully functional free tier that allows you to manage your library, track reading progress, and use core features. We also offer premium tier for users who want advanced AI capabilities and analytics."
        },
        {
            question: "Can I import my Goodreads library?",
            answer: "Absolutely! We support direct CSV imports from Goodreads. Simply export your data from Goodreads and upload it in your Atheum settings. All your shelves, ratings, and reviews will be seamlessly transferred over."
        },
        {
            question: "Does it work on mobile?",
            answer: "Atheum is built as a fully responsive web application. You can use it flawlessly on any device, whether it's your desktop, tablet, or smartphone. We are also working on dedicated mobile apps for iOS and Android."
        },
        {
            question: "How do I add a book cover?",
            answer: "When adding a book, our system automatically searches our database for the cover. If one isn't found, or if you prefer a different edition's cover, you can easily upload your own image or paste an image URL in the book's edit panel."
        },
        {
            question: "How does the AI Ebook Generator work?",
            answer: "The AI Ebook Generator leverages bleeding-edge language models to craft customized, structured, and engaging ebooks based on your prompts. You simply provide a topic, outline constraints, and tone, and our AI drafts chapters that you can then edit and finalize."
        },
        {
            question: "Is my reading data private?",
            answer: "We take your privacy seriously. Your reading habits, personal notes, and library data are completely private by default. You have full control over what you choose to share publicly or keep strictly for your own eyes."
        }
    ];

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

    function toggleFaq(index: number) {
        activeIndex = activeIndex === index ? null : index;
    }
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
            {#each faqs as faq, index}
                <div class="faq-item bg-white border border-[#e6e0d4] rounded-2xl overflow-hidden">
                    <button class="w-full flex items-center justify-between p-5 text-left group" onclick={() => toggleFaq(index)}>
                        <span class="font-serif font-bold text-[#1a232e] text-sm md:text-base pr-4 group-hover:text-amber-600 transition-colors">{faq.question}</span>
                        <div class="transition-transform duration-300 {activeIndex === index ? 'rotate-180' : ''}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-5 h-5 text-gray-400 shrink-0" aria-hidden="true">
                                <path d="m6 9 6 6 6-6"></path>
                            </svg>
                        </div>
                    </button>
                    {#if activeIndex === index}
                        <div transition:slide={{ duration: 300 }} class="px-5 pb-5">
                            <p class="text-sm md:text-base text-gray-600 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>