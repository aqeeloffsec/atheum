<script lang="ts">
    import gsap from "gsap";
    import ScrollTrigger from "gsap/ScrollTrigger";

    let sectionRef = $state<HTMLElement>();

    $effect(() => {
        if (!sectionRef) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context((self) => {
            const stats = [
                { target: 12400, suffix: "+" },
                { target: 3800, suffix: "+" },
                { target: 850, suffix: "k+" },
                { target: 99, suffix: "%" }
            ];

            // Staggered entrance for stat items
            gsap.from(".stat-item", {
                opacity: 0,
                y: 30,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef,
                    start: "top 85%"
                }
            });

            // Count-up animation using scoped selector
            const selector = self.selector;
            if (selector) {
                const counterElements = selector(".stat-number");
                counterElements.forEach((el: Element, i: number) => {
                    const data = stats[i];
                    if (!data) return;
                    
                    const obj = { value: 0 };
                    gsap.to(obj, {
                        value: data.target,
                        duration: 2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 90%",
                            once: true
                        },
                        onUpdate: () => {
                            const formatted = Math.floor(obj.value).toLocaleString();
                            el.textContent = `${formatted}${data.suffix}`;
                        }
                    });
                });
            }

            // Subtle icon bounce
            gsap.from(".stat-icon", {
                scale: 0.5,
                opacity: 0,
                duration: 1.5,
                stagger: 0.2,
                ease: "elastic.out(1, 0.5)",
                scrollTrigger: {
                    trigger: sectionRef,
                    start: "top 85%"
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    });
</script>

<section bind:this={sectionRef} class="bg-[#1a232e] py-20 overflow-hidden">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-2 min-[400px]:gap-4 sm:gap-8">
        <div class="stat-item text-center">
            <div class="stat-icon flex justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-6 h-6 text-amber-400" aria-hidden="true">
                    <path d="M12 7v14"></path>
                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                </svg>
            </div>
            <p class="stat-number font-serif text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1">12,400+</p>
            <p class="text-gray-400 text-xs sm:text-sm font-medium">Books Tracked</p>
        </div>

        <div class="stat-item text-center">
            <div class="stat-icon flex justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users w-6 h-6 text-amber-400" aria-hidden="true">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                </svg>
            </div>
            <p class="stat-number font-serif text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1">3,800+</p>
            <p class="text-gray-400 text-xs sm:text-sm font-medium">Active Readers</p>
        </div>

        <div class="stat-item text-center">
            <div class="stat-icon flex justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers w-6 h-6 text-amber-400" aria-hidden="true">
                    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
                    <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
                    <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
                </svg>
            </div>
            <p class="stat-number font-serif text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1">850k+</p>
            <p class="text-gray-400 text-xs sm:text-sm font-medium">Pages Read</p>
        </div>

        <div class="stat-item text-center">
            <div class="stat-icon flex justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star w-6 h-6 text-amber-400" aria-hidden="true">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
            </div>
            <p class="stat-number font-serif text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1">99%</p>
            <p class="text-gray-400 text-xs sm:text-sm font-medium">Stars Earned</p>
        </div>
    </div>
</section>