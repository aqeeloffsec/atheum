<script lang="ts">
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    
    gsap.registerPlugin(ScrollTrigger);

    interface Feature {
        title: string;
        description: string;
        icon: string;
        colorClass: string;
        bgClass: string;
    }

    const features: Feature[] = [
        {
            title: "Instant Search",
            description: "Find any book in your collection instantly by title, author, or genre with real-time filtering.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search w-5 h-5" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>`,
            colorClass: "text-blue-700",
            bgClass: "bg-blue-50"
        },
        {
            title: "Smart Categories",
            description: "Organize books into Reading, Want to Read, Favorites, and custom genre shelves effortlessly.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers w-5 h-5" aria-hidden="true"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path></svg>`,
            colorClass: "text-emerald-700",
            bgClass: "bg-emerald-50"
        },
        {
            title: "Star Ratings",
            description: "Rate each book and instantly surface your highest-rated reads when you need a recommendation.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star w-5 h-5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>`,
            colorClass: "text-amber-700",
            bgClass: "bg-amber-50"
        },
        {
            title: "Favorites Shelf",
            description: "Mark books as favorites and build a curated collection of your most beloved reads.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-5 h-5" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>`,
            colorClass: "text-red-700",
            bgClass: "bg-red-50"
        },
        {
            title: "Rich Book Cards",
            description: "Add cover art, ISBN, descriptions, and metadata to create beautiful, detailed book entries.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-5 h-5" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>`,
            colorClass: "text-purple-700",
            bgClass: "bg-purple-50"
        },
        {
            title: "Reading Goals",
            description: "Set an annual reading goal and watch your progress bar fill as you conquer your reading list.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up w-5 h-5" aria-hidden="true"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>`,
            colorClass: "text-indigo-700",
            bgClass: "bg-indigo-50"
        },
        {
            title: "Detailed View",
            description: "Slide-over book detail panels show synopsis, metadata, ratings, and quick actions all in one place.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-5 h-5" aria-hidden="true"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>`,
            colorClass: "text-teal-700",
            bgClass: "bg-teal-50"
        },
        {
            title: "Responsive Design",
            description: "Enjoy a flawless experience on any device — desktop, tablet, or mobile with a collapsible sidebar.",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe w-5 h-5" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>`,
            colorClass: "text-orange-700",
            bgClass: "bg-orange-50"
        }
    ];

    let sectionRef = $state<HTMLElement>();
    let headerRef = $state<HTMLElement>();
    let gridRef = $state<HTMLElement>();

    $effect(() => {
        if (!sectionRef) return;

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

            // Cards staggered reveal
            const selector = self.selector;
            if (gridRef && selector) {
                gsap.from(selector(".feature-card"), {
                    opacity: 0,
                    y: 40,
                    scale: 0.95,
                    duration: 1.2,
                    stagger: {
                        amount: 0.8,
                        from: "start"
                    },
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: gridRef,
                        start: "top 85%",
                        once: true
                    },
                    clearProps: "opacity,transform"
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    });
</script>

<section bind:this={sectionRef} class="py-24 bg-[#fdfaf6] overflow-hidden">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div bind:this={headerRef} class="text-center mb-16">
            <div class="inline-flex items-center gap-2 bg-[#1a232e]/8 text-[#1a232e] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-3 h-3" aria-hidden="true">
                    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                    <path d="M20 2v4"></path>
                    <path d="M22 4h-4"></path>
                    <circle cx="4" cy="20" r="2"></circle>
                </svg>Features
            </div>
            <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a232e] mb-4">Everything a bibliophile needs</h2>
            <p class="text-gray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">Thoughtfully crafted tools to help you track, organize, and celebrate every book in your life.</p>
        </div>
        <div bind:this={gridRef} class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {#each features as feature}
                <div class="feature-card group bg-white border border-[#e6e0d4] rounded-2xl p-6 hover:shadow-xl hover:border-transparent transition duration-300 cursor-default">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4 {feature.bgClass} {feature.colorClass}">
                        {@html feature.icon}
                    </div>
                    <h3 class="font-serif font-bold text-[#1a232e] text-base mb-2">{feature.title}</h3>
                    <p class="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
            {/each}
        </div>
    </div>
</section>
