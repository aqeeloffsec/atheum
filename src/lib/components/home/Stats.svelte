<script lang="ts">
    import gsap from "gsap";
    import ScrollTrigger from "gsap/ScrollTrigger";

    let { stats = { books: 12400, users: 3800, ebooks: 450, stars: 99 } } = $props();

    let sectionRef = $state<HTMLElement>();

    $effect(() => {
        if (!sectionRef) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context((self) => {
            const statsArray = [
                { target: stats.books, suffix: "+" },
                { target: stats.users, suffix: "+" },
                { target: stats.ebooks, suffix: "+" },
                { target: stats.stars, suffix: "%" }
            ];

            // Ambient background animation
            const selector = self.selector;
            if (selector) {
                gsap.to(selector(".ambient-glow"), {
                    x: "random(-30, 30)",
                    y: "random(-30, 30)",
                    scale: "random(0.8, 1.2)",
                    duration: "random(3, 6)",
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    stagger: 0.2
                });
            }

            // Staggered entrance for stat items
            gsap.fromTo(".stat-item", {
                opacity: 0,
                y: 40,
                scale: 0.95
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                stagger: 0.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: sectionRef,
                    start: "top 80%"
                }
            });

            // Count-up animation
            if (selector) {
                const counterElements = selector(".stat-number");
                counterElements.forEach((el: Element, i: number) => {
                    const data = statsArray[i];
                    if (!data) return;
                    
                    const obj = { value: 0 };
                    gsap.to(obj, {
                        value: data.target,
                        duration: 2.5,
                        ease: "power3.out",
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

        }, sectionRef);

        return () => ctx.revert();
    });
</script>

<section bind:this={sectionRef} class="bg-[#0b1016] py-32 relative overflow-hidden">
    <!-- Ambient Background -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="ambient-glow absolute top-[-20%] left-[10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen will-change-transform"></div>
        <div class="ambient-glow absolute bottom-[-20%] right-[10%] w-[40vw] h-[40vw] bg-amber-500/10 rounded-full blur-[100px] mix-blend-screen will-change-transform"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEg0djRIMGYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
            <div class="stat-item flex flex-col items-center justify-center p-6 bg-white/2 border border-white/5 rounded-3xl backdrop-blur-md shadow-2xl hover:bg-white/4 transition-all duration-300 will-change-transform">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-linear-to-br from-indigo-500/20 to-purple-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-indigo-400" aria-hidden="true"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
                </div>
                <p class="stat-number font-serif text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-white to-gray-400 mb-2 drop-shadow-md">12,400+</p>
                <p class="text-gray-400 text-sm font-medium tracking-wide uppercase">Books Tracked</p>
            </div>

            <div class="stat-item flex flex-col items-center justify-center p-6 bg-white/2 border border-white/5 rounded-3xl backdrop-blur-md shadow-2xl hover:bg-white/4 transition-all duration-300 will-change-transform">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-linear-to-br from-purple-500/20 to-pink-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-purple-400" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>
                </div>
                <p class="stat-number font-serif text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-white to-gray-400 mb-2 drop-shadow-md">3,800+</p>
                <p class="text-gray-400 text-sm font-medium tracking-wide uppercase">Active Readers</p>
            </div>

            <div class="stat-item relative p-px rounded-3xl overflow-hidden group">
                <div class="absolute inset-0 bg-linear-to-br from-purple-500/60 via-indigo-500/60 to-amber-500/60 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:animate-[shimmer_2s_infinite]"></div>
                <div class="relative h-full flex flex-col items-center justify-center p-6 bg-[#0b1016]/90 rounded-[calc(1.5rem-1px)] backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-linear-to-br from-purple-500 to-amber-500 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6" aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path></svg>
                    </div>
                    <p class="stat-number font-serif text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-amber-400 mb-2 drop-shadow-md">450+</p>
                    <p class="text-sm font-bold tracking-wide uppercase text-center bg-clip-text text-transparent bg-linear-to-r from-purple-200 to-amber-200">AI Ebooks Built</p>
                </div>
            </div>

            <div class="stat-item flex flex-col items-center justify-center p-6 bg-white/2 border border-white/5 rounded-3xl backdrop-blur-md shadow-2xl hover:bg-white/4 transition-all duration-300">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-linear-to-br from-amber-500/20 to-orange-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-amber-500" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                </div>
                <p class="stat-number font-serif text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-white to-gray-400 mb-2 drop-shadow-md">99%</p>
                <p class="text-gray-400 text-sm font-medium tracking-wide uppercase">Stars Earned</p>
            </div>
        </div>
    </div>
</section>