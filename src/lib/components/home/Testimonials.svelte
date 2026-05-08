<script lang="ts">
    import gsap from "gsap";
    import ScrollTrigger from "gsap/ScrollTrigger";

    const testimonials = [
        {
            name: "Eleanor M.",
            role: "Avid Reader · 120 books tracked",
            rating: 5,
            quote: "Atheum completely changed how I track my reading. The design is so beautiful I actually want to open it every day.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=60&fm=webp&w=100&h=100"
        },
        {
            name: "James T.",
            role: "Literature Professor · 340 books tracked",
            rating: 5,
            quote: "The AI Ebook Generator is shockingly good. It structured my research topic instantly. This is a game-changer for literature.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=60&fm=webp&w=100&h=100"
        },
        {
            name: "Sophia K.",
            role: "Book Club Organiser · 87 books tracked",
            rating: 5,
            quote: "Finally, a tracking app that feels like a premium tool. The slide-over detail view is my absolute favourite feature.",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=60&fm=webp&w=100&h=100"
        },
    ]

    let sectionRef = $state<HTMLElement>();

    $effect(() => {
        if (!sectionRef) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context((self) => {
            const selector = self.selector;
            
            if (selector) {
                gsap.fromTo(selector(".testi-card"), {
                    opacity: 0,
                    y: 60,
                    rotateX: 10
                }, {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef,
                        start: "top 85%"
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    });
</script>

<section bind:this={sectionRef} class="py-32 bg-[#0b1016] overflow-hidden relative">
    <div class="absolute inset-0 bg-linear-to-b from-transparent via-[#1a232e]/50 to-transparent pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="text-center mb-20">
            <div class="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 text-purple-400" aria-hidden="true"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path></svg>
                Testimonials
            </div>
            <h2 class="font-serif text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Loved by readers everywhere</h2>
            <p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">Join thousands of bibliophiles who've made Atheum their intelligent, digital literary home.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {#each testimonials as testimonial}
                <div class="testi-card group relative p-px rounded-[2.5rem] overflow-hidden bg-white/10 hover:bg-linear-to-br hover:from-purple-500/40 hover:to-amber-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                    <div class="h-full bg-[#121921] rounded-[calc(2.5rem-1px)] p-8 sm:p-10 flex flex-col gap-8 justify-between relative z-10 backdrop-blur-3xl">
                        <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 group-hover:text-purple-400 transition-all duration-500 transform group-hover:rotate-12 translate-x-4 -translate-y-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path></svg>
                        </div>
                        
                        <div class="flex flex-col gap-6 relative z-10">
                            <div class="flex gap-1 justify-start">
                                {#each Array(5) as _, i}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="w-5 h-5 {i < testimonial.rating ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'fill-white/10 text-white/10'}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                {/each}
                            </div>
                            <p class="text-gray-300 text-lg md:text-[1.1rem] leading-relaxed font-serif tracking-wide group-hover:text-white transition-colors duration-300">"{testimonial.quote}"</p>
                        </div>
                        <div class="flex flex-row items-center gap-4 border-t border-white/10 pt-6 mt-2 relative z-10">
                            <img alt="{testimonial.name}" loading="lazy" decoding="async" class="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg group-hover:border-purple-400 transition-colors" src="{testimonial.image}">
                            <div>
                                <p class="font-bold text-white text-base">{testimonial.name}</p>
                                <p class="text-gray-400 text-xs mt-0.5 tracking-wide">{testimonial.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>