<script lang="ts">
    import gsap from "gsap";
    import ScrollTrigger from "gsap/ScrollTrigger";
    
    let sectionRef = $state<HTMLElement>();
    let lineRef = $state<HTMLElement>();
    let lineProgressRef = $state<HTMLElement>();

    $effect(() => {
        if (!sectionRef) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context((self) => {
            const selector = self.selector;

            // Animate step blocks
            if (selector) {
                const steps = selector(".step-block");
                steps.forEach((step: HTMLElement, i: number) => {
                    const content = step.querySelector('.step-content');
                    const visual = step.querySelector('.step-visual');
                    const number = step.querySelector('.step-number');
                    
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: step,
                            start: "top 80%",
                        }
                    });

                    tl.from(number, {
                        opacity: 0,
                        x: i % 2 === 0 ? -30 : 30,
                        duration: 1,
                        ease: "power3.out"
                    })
                    .from([visual, content], {
                        opacity: 0,
                        y: 40,
                        duration: 1,
                        stagger: 0.2,
                        ease: "power4.out"
                    }, "-=0.6");

                    // Parallax effect for images
                    const img = visual?.querySelector('img');
                    if (img) {
                        gsap.to(img, {
                            y: -20,
                            ease: "none",
                            scrollTrigger: {
                                trigger: step,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true
                            }
                        });
                    }
                });
            }

            // Animate middle line progress
            if (lineRef && lineProgressRef) {
                gsap.to(lineProgressRef, {
                    scaleY: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef,
                        start: "top 50%",
                        end: "bottom 80%",
                        scrub: 0.5
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    });
</script>

<section bind:this={sectionRef} class="py-32 bg-[#faf8f4] relative overflow-hidden">
    <!-- Ambient glowing faint background -->
    <div class="absolute top-[30%] -left-[10%] w-[40vw] h-[40vw] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[20%] -right-[10%] w-[40vw] h-[40vw] bg-amber-200/20 rounded-full blur-[120px] pointer-events-none"></div>

	<div class="max-w-7xl mx-auto px-6 relative z-10">
		<div class="text-center mb-28">
			<div class="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#1a232e]/5 shadow-sm text-[#1a232e] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 translate-y-0 hover:-translate-y-0.5 transition-transform">
				<div class="w-2 h-2 rounded-full bg-linear-to-r from-purple-500 to-amber-500 animate-pulse"></div>
				Process
			</div>
			<h2 class="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a232e] mb-6 tracking-tight">Simple. Beautiful. Yours.</h2>
			<p class="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium">Getting started takes less than a minute. Four steps to a library you'll love.</p>
		</div>

		<div class="relative max-w-5xl mx-auto">
            <!-- Center Line for desktop -->
            <div bind:this={lineRef} class="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gray-200 -translate-x-1/2 rounded-full z-0 overflow-hidden">
                <div bind:this={lineProgressRef} class="w-full h-full bg-linear-to-b from-purple-500 via-indigo-500 to-amber-500 origin-top transform scale-y-0 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)]"></div>
            </div>

			<div class="space-y-32 sm:space-y-48">
                <!-- Step 1 -->
				<div class="step-block flex flex-col md:flex-row gap-8 md:gap-20 items-center relative z-10 w-full group">
                    <div class="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-gray-200 rounded-full z-20 shadow-sm group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-500"></div>

					<div class="step-visual w-full md:w-1/2">
                        <div class="p-3 sm:p-4 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative group-hover:-translate-y-3 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700 ease-out will-change-transform">
                            <div class="aspect-16/10 rounded-[2.2rem] overflow-hidden shadow-inner relative bg-gray-100">
                                <img alt="Add Your Books" loading="lazy" decoding="async" class="w-full h-full object-cover scale-110 transition-transform duration-1000 group-hover:scale-115" src="/images/how-it-works/step1.png" />
                                <div class="absolute inset-0 bg-linear-to-br from-black/5 to-transparent"></div>
                            </div>
                            <div class="absolute -bottom-5 -right-5 md:right-6 w-20 h-20 bg-white border border-gray-100 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 z-30 text-[#1a232e]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                            </div>
                        </div>
					</div>
					<div class="step-content w-full md:w-1/2 relative">
						<span class="step-number absolute -top-24 -left-6 md:-left-12 font-serif text-[10rem] md:text-[14rem] font-bold text-gray-900/3 leading-none z-0 pointer-events-none select-none">01</span>
						<div class="relative z-10 pt-4">
                            <h3 class="font-serif text-4xl md:text-5xl font-bold text-[#1a232e] mb-6 tracking-tight">Add Your Books</h3>
                            <p class="text-gray-500 text-lg md:text-xl leading-relaxed max-w-md font-medium">Scan your physical library or hunt for digital gems. Our intelligent onboarding makes adding books feel like a reward, not a chore.</p>
                        </div>
					</div>
				</div>

                <!-- Step 2 -->
				<div class="step-block flex flex-col md:flex-row-reverse gap-8 md:gap-20 items-center relative z-10 w-full group">
                    <div class="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-gray-200 rounded-full z-20 shadow-sm group-hover:border-indigo-400 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-500"></div>

					<div class="step-visual w-full md:w-1/2 relative z-10">
						<div class="p-3 sm:p-4 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative group-hover:-translate-y-3 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700 ease-out will-change-transform">
                            <div class="aspect-16/10 rounded-[2.2rem] overflow-hidden shadow-inner relative bg-indigo-50/20">
                                <img alt="Organise & Filter" loading="lazy" decoding="async" class="w-full h-full object-cover scale-110 transition-transform duration-1000 group-hover:scale-115" src="/images/how-it-works/step2.png" />
                                <div class="absolute inset-0 bg-linear-to-bl from-indigo-500/5 to-transparent"></div>
                            </div>
                            <div class="absolute -bottom-5 -left-5 md:left-6 w-20 h-20 bg-white border border-gray-100 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 z-30 text-indigo-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path></svg>
                            </div>
                        </div>
					</div>
					<div class="step-content w-full md:w-1/2 relative">
						<span class="step-number absolute -top-24 -right-6 md:-right-12 font-serif text-[10rem] md:text-[14rem] font-bold text-gray-900/3 leading-none z-0 pointer-events-none select-none">02</span>
						<div class="relative z-10 pt-4 md:text-right">
                            <h3 class="font-serif text-4xl md:text-5xl font-bold text-[#1a232e] mb-6 tracking-tight">Organise &amp; Filter</h3>
                            <p class="text-gray-500 text-lg md:text-xl leading-relaxed md:ml-auto max-w-md font-medium">Categories that adapt to you. Sort by mood, genre, or progress. Our instant search handles thousands of books without a blink.</p>
                        </div>
					</div>
				</div>

                <!-- Step 3 -->
				<div class="step-block flex flex-col md:flex-row gap-8 md:gap-20 items-center relative z-10 w-full group">
                    <div class="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-gray-200 rounded-full z-20 shadow-sm group-hover:border-teal-400 group-hover:shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all duration-500"></div>
					<div class="step-visual w-full md:w-1/2 relative z-10">
						<div class="p-3 sm:p-4 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative group-hover:-translate-y-3 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700 ease-out will-change-transform">
                            <div class="aspect-16/10 rounded-[2.2rem] overflow-hidden shadow-inner relative bg-teal-50/20">
                                <img alt="Dive Into Details" loading="lazy" decoding="async" class="w-full h-full object-cover scale-110 transition-transform duration-1000 group-hover:scale-115" src="/images/how-it-works/step3.png" />
                                <div class="absolute inset-0 bg-linear-to-br from-teal-500/5 to-transparent"></div>
                            </div>
                            <div class="absolute -bottom-5 -right-5 md:right-6 w-20 h-20 bg-white border border-gray-100 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 z-30 text-teal-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
                            </div>
                        </div>
					</div>
					<div class="step-content w-full md:w-1/2 relative">
						<span class="step-number absolute -top-24 -left-6 md:-left-12 font-serif text-[10rem] md:text-[14rem] font-bold text-gray-900/3 leading-none z-0 pointer-events-none select-none">03</span>
						<div class="relative z-10 pt-4">
                            <h3 class="font-serif text-4xl md:text-5xl font-bold text-[#1a232e] mb-6 tracking-tight">Explore & Rediscover</h3>
                            <p class="text-gray-500 text-lg md:text-xl leading-relaxed max-w-md font-medium">Immerse yourself in rich detail views. Every book has a story beyond its pages — metadata, summaries, and your personal notes, all in one place.</p>
                        </div>
					</div>
				</div>

                <!-- Step 4 - Premium AI Step -->
				<div class="step-block flex flex-col md:flex-row-reverse gap-8 md:gap-20 items-center relative z-10 w-full group">
                    <div class="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-linear-to-br from-purple-500 to-amber-500 rounded-full z-20 shadow-[0_0_30px_rgba(168,85,247,0.6)] group-hover:scale-125 transition-all duration-500 border-4 border-white"></div>

					<div class="step-visual w-full md:w-1/2 relative z-10">
                        <div class="absolute -inset-4 bg-linear-to-r from-purple-500 to-amber-500 rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
						<div class="p-[2px] bg-linear-to-tr from-indigo-500 via-purple-500 to-amber-500 rounded-[3.2rem] relative group-hover:-translate-y-3 group-hover:shadow-[0_40px_100px_rgba(168,85,247,0.25)] transition-all duration-700 ease-out will-change-transform">
                            <div class="bg-white/90 backdrop-blur-2xl rounded-[3.1rem] p-3 sm:p-4 h-full relative z-10">
                                <div class="aspect-16/10 rounded-[2.2rem] overflow-hidden relative bg-purple-50/10">
                                    <img alt="Generate AI Ebooks" loading="lazy" decoding="async" class="w-full h-full object-cover scale-110 transition-transform duration-1000 group-hover:scale-115" src="/images/how-it-works/step4.png" />
                                    <div class="absolute inset-0 bg-linear-to-tr from-purple-500/10 via-transparent to-amber-500/10"></div>
                                </div>
                                <div class="absolute -bottom-5 -left-5 md:left-6 w-20 h-20 bg-linear-to-br from-[#1a232e] to-black border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 z-30 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path></svg>
                                </div>
                            </div>
                        </div>
					</div>
					<div class="step-content w-full md:w-1/2 relative">
						<span class="step-number absolute -top-24 -right-6 md:-right-12 font-serif text-[10rem] md:text-[14rem] font-bold text-transparent bg-clip-text bg-linear-to-br from-purple-200/40 to-amber-200/40 leading-none z-0 pointer-events-none select-none">04</span>
						<div class="relative z-10 pt-4 md:text-right">
                            <h3 class="font-serif text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-amber-600 mb-6 inline-block">Generate AI Ebooks</h3>
                            <p class="text-gray-500 text-lg md:text-xl leading-relaxed md:ml-auto max-w-md font-medium">Bespoke literature at the touch of a button. Our AI doesn't just write; it crafts experiences with flawless typography and academic depth.</p>
                        </div>
					</div>
				</div>

			</div>
		</div>
	</div>
</section>