<script lang="ts">
    import gsap from "gsap";
    import ScrollTrigger from "gsap/ScrollTrigger";
    
    gsap.registerPlugin(ScrollTrigger);

    interface Feature {
        title: string;
        description: string;
        icon: string;
        colorClass: string;
        bgClass: string;
        isFeatured?: boolean;
    }

    const features: Feature[] = [
        {
            title: "Instant Search",
            description: "Find any book in your collection instantly by title, author, or genre with real-time filtering.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>`,
            colorClass: "text-blue-600",
            bgClass: "bg-blue-50"
        },
        {
            title: "Smart Categories",
            description: "Organize books into Reading, Want to Read, Favorites, and custom genre shelves effortlessly.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path></svg>`,
            colorClass: "text-emerald-600",
            bgClass: "bg-emerald-50"
        },
        {
            title: "Star Ratings",
            description: "Rate each book and instantly surface your highest-rated reads when you need a recommendation.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>`,
            colorClass: "text-amber-500",
            bgClass: "bg-amber-50"
        },
        {
            title: "Favorites Shelf",
            description: "Mark books as favorites and build a curated collection of your most beloved reads.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>`,
            colorClass: "text-rose-500",
            bgClass: "bg-rose-50"
        },
        {
            title: "Rich Book Cards",
            description: "Add cover art, ISBN, descriptions, and metadata to create beautiful, detailed book entries.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>`,
            colorClass: "text-indigo-500",
            bgClass: "bg-indigo-50"
        },
        {
            title: "AI Ebook Generator",
            description: "Transform any topic into a professional, structured ebook with cover art and pristine typography.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg>`,
            colorClass: "text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-amber-600",
            bgClass: "bg-white shadow-[0_0_20px_rgba(168,85,247,0.15)]",
            isFeatured: true
        },
        {
            title: "Detailed View",
            description: "Slide-over panels show synopsis, metadata, and quick actions elegantly all in one place.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>`,
            colorClass: "text-teal-600",
            bgClass: "bg-teal-50"
        },
        {
            title: "Responsive Design",
            description: "Enjoy a flawless experience on any device — desktop, tablet, or mobile with a seamless interface.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>`,
            colorClass: "text-orange-500",
            bgClass: "bg-orange-50"
        }
    ];

    let sectionRef = $state<HTMLElement>();
    let headerRef = $state<HTMLElement>();
    let gridRef = $state<HTMLElement>();

    $effect(() => {
        if (!sectionRef) return;

        const ctx = gsap.context((self) => {
            if (headerRef) {
                gsap.fromTo(headerRef, { opacity: 0, y: 30 }, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef,
                        start: "top 85%"
                    }
                });
            }

            const selector = self.selector;
            if (gridRef && selector) {
                gsap.fromTo(selector(".feature-wrapper"), {
                    opacity: 0,
                    y: 50,
                    scale: 0.95
                }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    stagger: {
                        amount: 0.6,
                        from: "start"
                    },
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: gridRef,
                        start: "top 80%",
                        once: true
                    },
                    clearProps: "opacity,transform"
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    });
</script>

<section bind:this={sectionRef} class="py-32 bg-[#faf8f4] overflow-hidden relative">
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div bind:this={headerRef} class="text-center mb-20">
            <div class="inline-flex items-center gap-2 bg-white border border-[#1a232e]/5 shadow-sm text-[#1a232e] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border-b border-b-gray-200">
                <div class="w-2 h-2 rounded-full bg-linear-to-r from-purple-500 to-amber-500 animate-pulse"></div>
                Features
            </div>
            <h2 class="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a232e] mb-6 tracking-tight">Everything a bibliophile needs</h2>
            <p class="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium">Thoughtfully crafted tools to help you track, organize, and celebrate every book in your life.</p>
        </div>
        
        <div bind:this={gridRef} class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {#each features as feature, i}
                <div class="feature-wrapper h-full">
                    {#if feature.isFeatured}
                        <!-- Premium AI Card -->
                        <div class="h-full group relative p-px rounded-4xl overflow-hidden bg-linear-to-br from-indigo-500/50 via-purple-500/50 to-amber-500/50 hover:from-indigo-500 hover:via-purple-500 hover:to-amber-500 shadow-xl hover:shadow-[0_8px_40px_rgba(168,85,247,0.3)] transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                            <div class="absolute inset-0 bg-linear-to-tr from-indigo-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                            
                            <!-- Shimmer effect -->
                            <div class="absolute inset-0 -translate-x-[150%] skew-x-[-15deg] group-hover:animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/40 to-transparent z-20"></div>

                            <div class="bg-white/95 backdrop-blur-xl h-full w-full rounded-[calc(2rem-1px)] p-8 relative z-10 flex flex-col items-start bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-purple-50/50 to-transparent">
                                <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 {feature.bgClass} {feature.colorClass} border border-purple-100 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <svg viewBox="0 0 24 24" class="w-0 h-0 absolute"><defs><linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4f46e5" /><stop offset="50%" stop-color="#9333ea" /><stop offset="100%" stop-color="#ea580c" /></linearGradient></defs></svg>
                                    <div style="color: url(#glow-grad);">
                                        {@html feature.icon.replace('stroke="currentColor"', 'stroke="url(#glow-grad)"')}
                                    </div>
                                </div>
                                <h3 class="font-serif font-bold text-[#1a232e] text-[1.35rem] mb-3 leading-tight">{feature.title}</h3>
                                <p class="text-gray-500/90 text-sm md:text-base leading-relaxed font-medium">{feature.description}</p>
                                
                                <div class="mt-auto pt-6 w-full">
                                    <div class="inline-flex items-center text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-amber-500 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                        Powered by AI <span class="ml-1 text-purple-500">→</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {:else}
                        <!-- Standard Card -->
                        <div class="h-full group bg-white/60 backdrop-blur-md border border-[#e6e0d4]/80 rounded-4xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:bg-white hover:border-transparent transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden will-change-transform">
                            <div class="absolute inset-0 bg-linear-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 {feature.bgClass} {feature.colorClass} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-sm border border-black/5">
                                    {@html feature.icon}
                                </div>
                                <h3 class="font-serif font-bold text-[#1a232e] text-lg mb-3">{feature.title}</h3>
                                <p class="text-gray-500 text-sm md:text-[0.95rem] leading-relaxed font-medium">{feature.description}</p>
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    @keyframes shimmer {
        100% {
            transform: translateX(150%) skewX(-15deg);
        }
    }
</style>
