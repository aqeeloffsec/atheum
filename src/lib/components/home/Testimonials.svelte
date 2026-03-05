<script lang="ts">
    const testimonials = [
        {
            name: "Eleanor M.",
            role: "Avid Reader · 120 books tracked",
            rating: 5,
            quote: "Atheum completely changed how I track my reading. The design is so beautiful I actually want to open it every day.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
        },
        {
            name: "James T.",
            role: "Literature Professor · 340 books tracked",
            rating: 3,
            quote: "The bookish aesthetic is spot-on. It feels like a proper library on my screen. The slide-over detail view is my favourite feature.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"
        },
        {
            name: "Sophia K.",
            role: "Book Club Organiser · 87 books tracked",
            rating: 4,
            quote: "Finally, a reading tracker that doesn't look like a spreadsheet. The genre filtering and favorites shelf are incredibly useful.",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100"
        },
    ]
</script>

<section class="py-24 bg-[#1a232e] overflow-hidden">
    <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
            <div class="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote w-3 h-3" aria-hidden="true">
                    <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                    <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                </svg>Testimonials
            </div>
            <h2 class="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Loved by readers everywhere</h2>
            <p class="text-gray-400 text-lg max-w-xl mx-auto">Join thousands of bibliophiles who've made Atheum their literary home.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {#each testimonials as testimonial}
                <div class="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 flex flex-col gap-6 justify-between opacity-100 transform-none">
                    <div class="flex flex-col gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote w-8 h-8 text-amber-400/60" aria-hidden="true">
                            <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                            <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                        </svg>
                        <p class="text-gray-300 leading-relaxed text-sm italic">"{testimonial.quote}"</p>
                    </div>
                    <div class="flex flex-row items-center gap-3">
                        <img alt="{testimonial.name}" class="w-10 h-10 rounded-full object-cover border-2 border-white/20" src="{testimonial.image}">
                        <div>
                            <p class="font-bold text-white text-sm">{testimonial.name}</p>
                            <p class="text-gray-500 text-xs">{testimonial.role}</p>
                        </div>
                        <div class="ml-auto">
                            <div class="flex gap-0.5">
                                {#each Array(5) as _, i}
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="24" height="24" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        stroke-width="2" 
                                        stroke-linecap="round" 
                                        stroke-linejoin="round" 
                                        class="w-3 h-3 transition-colors {i < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-600'}"
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>