<script lang="ts">
    import { tick } from 'svelte';
    import { badge } from '$lib/stores/badge';
    import gsap from 'gsap';

    let { data } = $props();

    // ----- Chat State -----
    let messages = $state([
        { role: 'assistant', content: 'Welcome to the Atheum AI Publishing Studio! I am your personal editor and book architect. To get started, what topic would you like to write about? And what kind of document are you envisioning (e.g., standard ebook, academic paper, playbook)?' }
    ]);
    let inputMessage = $state('');
    let isChatting = $state(false);

    // ----- Book Generation State -----
    let topic = $state('');
    let customTitle = $state('');
    let selectedFormat = $state('');
    let generating = $state(false);
    let progressMessage = $state('Connecting to generation engine...');
    let progressPhase = $state<'idle' | 'outlining' | 'writing' | 'finalizing' | 'completed'>('idle');
    let currentChapter = $state(0);
    let totalChapters = $state(0);
    let currentChapterTitle = $state('');
    let ebookContent = $state('');
    let error = $state('');
    let success = $state(false);
    let canGenerate = $state(false);
    let coverImageUrl = $state('');
    let isGeneratingPdf = $state(false);
    let elapsedSeconds = $state(0);
    let timerInterval: ReturnType<typeof setInterval> | null = null;

    // ----- Plan State -----
    let planTier = $state('free');
    let planLabel = $state('');
    let pageRange = $state({ min: 0, max: 0 });
    let monthlyLimit = $state(0);
    let monthlyUsed = $state(0);
    let qualityTier = $state('');
    let availableFormats: any[] = $state([]);

    // DOM refs
    let chatContainerRef: HTMLDivElement = $state(null!);
    let rightPanelRef: HTMLDivElement = $state(null!);
    let generatingOverlayRef: HTMLDivElement = $state(null!);

    $effect(() => {
        if (data) {
            planTier = data.planTier || 'free';
            planLabel = data.planLabel || '';
            pageRange = data.pageRange || { min: 0, max: 0 };
            monthlyLimit = data.monthlyLimit || 0;
            monthlyUsed = data.monthlyUsed || 0;
            qualityTier = data.qualityTier || '';
            canGenerate = data.canGenerate ?? false;
            availableFormats = data.availableFormats || [];

            if (availableFormats.length > 0 && !selectedFormat) {
                selectedFormat = availableFormats[0].id;
            }
        }
    });

    $effect(() => {
        if (chatContainerRef) {
            chatContainerRef.scrollTop = chatContainerRef.scrollHeight;
        }
    });

    function startTimer() {
        elapsedSeconds = 0;
        timerInterval = setInterval(() => { elapsedSeconds++; }, 1000);
    }
    function stopTimer() {
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    }
    function formatTime(s: number) {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
    }

    let quotaRemaining = $derived(monthlyLimit - monthlyUsed);

    async function handleChatSubmit() {
        if (!inputMessage.trim()) return;
        
        const userMsg = inputMessage.trim();
        messages = [...messages, { role: 'user', content: userMsg }];
        inputMessage = '';
        isChatting = true;

        // Auto-extract topic and format from user messages as a quick heuristic
        if (!topic && userMsg.length > 5) {
            // Very naive auto-fill for demo purposes; the real chat route does the heavy lifting
            topic = userMsg; 
        }

        try {
            const response = await fetch('/api/chat-brainstorm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            });

            if (!response.ok) throw new Error('Failed to chat');
            
            const data = await response.json();
            console.log('[chat] API response received:', data);
            
            if (data.reply) {
                messages = [...messages, { role: 'assistant', content: data.reply }];
            } else if (data.error) {
                throw new Error(data.error);
            } else {
                throw new Error('Empty response from editor assistant');
            }

            // Simulate automatic extraction from AI if it suggests formats
            if (data.reply.toLowerCase().includes('playbook')) selectedFormat = 'playbook';
            if (data.reply.toLowerCase().includes('cheatsheet')) selectedFormat = 'cheatsheet';

        } catch (err: any) {
            console.error(err);
            messages = [...messages, { role: 'assistant', content: "I'm having trouble connecting right now. But feel free to manually set your book settings on the right panel and hit Generate!" }];
        } finally {
            isChatting = false;
        }
    }

    async function handleGenerate() {
        if (!topic.trim()) { error = 'Please ensure a topic is set in the Book Settings panel.'; return; }
        if (!selectedFormat) { error = 'Please select a document format.'; return; }
        if (!canGenerate) { error = 'Monthly generation limit reached.'; return; }

        error = '';
        success = false;
        generating = true;
        progressPhase = 'idle';
        progressMessage = 'Connecting to generation engine...';
        currentChapter = 0;
        totalChapters = 0;
        currentChapterTitle = '';
        ebookContent = '';
        coverImageUrl = '';
        startTimer();

        // Add to chat
        messages = [...messages, { 
            role: 'user', 
            content: `Start generating the book: \nTopic: ${topic}\nFormat: ${selectedFormat}` 
        }];
        messages = [...messages, { 
            role: 'assistant', 
            content: `Excellent. I have initiated the rendering engine for your ${selectedFormat.replace('_', ' ')}. You can watch the progression in the studio canvas!` 
        }];

        await tick();
        if (generatingOverlayRef) {
            gsap.fromTo(generatingOverlayRef,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
            );
        }

        const formData = {
            topic: topic.trim(),
            pages: pageRange.max,
            title: customTitle.trim() || undefined,
            format: selectedFormat,
            planTier,
            audience: 'General public',
            style: 'Professional and authoritative'
        };

        try {
            const response = await fetch('/api/generate-ebook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok || !response.body) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.error || 'Failed to generate ebook');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const message = JSON.parse(line);
                        if (message.error) throw new Error(message.error);

                        if (message.status === 'outlining') {
                            progressPhase = 'outlining';
                            totalChapters = message.totalChapters || 0;
                            progressMessage = `Architecting ${message.targetPages}-page ${(message.format || 'document').replace(/_/g, ' ')}...`;
                        } else if (message.status === 'writing') {
                            progressPhase = 'writing';
                            currentChapter = message.chapter;
                            currentChapterTitle = message.title;
                            totalChapters = message.totalChapters || totalChapters;
                            progressMessage = `Writing Chapter ${message.chapter} of ${totalChapters}: ${message.title}`;
                        } else if (message.status === 'finalizing') {
                            progressPhase = 'finalizing';
                            progressMessage = 'Polishing final touches and generating cover...';
                        } else if (message.status === 'completed') {
                            ebookContent = message.content || '';
                            coverImageUrl = message.coverImageUrl || '';
                            progressPhase = 'completed';
                            success = true;
                            generating = false;
                            monthlyUsed += 1;
                            canGenerate = monthlyUsed < monthlyLimit;
                            stopTimer();
                            
                            messages = [...messages, { 
                                role: 'assistant', 
                                content: `Your book is complete! Check the studio canvas on the right to read and download your finished piece.` 
                            }];

                            await tick();
                            if (rightPanelRef) {
                                gsap.fromTo(rightPanelRef,
                                    { opacity: 0, y: 20 },
                                    { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)' }
                                );
                            }
                        }
                    } catch (e: any) {
                        if (e.message !== "Unexpected end of JSON input" && !e.message.includes("JSON")) {
                            throw e;
                        }
                    }
                }
            }

            const formatLabel = availableFormats.find((f: any) => f.id === selectedFormat)?.label || 'Document';
            badge.show(`${formatLabel} generated successfully! "${topic}"`, 'success');
        } catch (err: any) {
            console.error('Generation error:', err);
            error = err.message || 'Failed to generate. Please try again.';
            generating = false;
            stopTimer();
            messages = [...messages, { role: 'assistant', content: `Generation failed: ${error}` }];
        }
    }

    async function downloadEbook() {
        if (!ebookContent) return;
        isGeneratingPdf = true;
        try {
            const formData = new FormData();
            formData.append('markdown', ebookContent);
            formData.append('author', 'AI Author');

            const response = await fetch('/api/download-pdf', { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Failed to generate PDF');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const filename = `${topic.replace(/\s+/g, '_') || 'ebook'}.pdf`;

            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('PDF generation error:', err);
            error = 'Failed to generate PDF. Please try again.';
        } finally {
            isGeneratingPdf = false;
        }
    }

    function getFormatSelectedLabel(): string {
        return availableFormats.find((f: any) => f.id === selectedFormat)?.label || 'Document';
    }
</script>

<main class="h-[calc(100vh-4rem)] flex overflow-hidden bg-[#faf7f2]">
    <!-- ====== LEFT SIDEBAR: CHAT UI ====== -->
    <div class="w-full md:w-[400px] border-r border-[#e8e0d2] bg-white flex flex-col shadow-[4px_0_24px_rgba(139,105,20,0.03)] z-10">
        <div class="px-5 py-4 border-b border-[#e8e0d2] bg-linear-to-r from-[#faf5eb] to-[#f5edd8] flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-linear-to-br from-[#d4a853] to-[#8B6914] flex flex-col items-center justify-center text-white shadow-xs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="opacity-90" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
            </div>
            <div>
                <h1 class="text-[#3d3526] font-semibold text-sm">Editor Chat</h1>
                <p class="text-[#8a7e6b] text-xs">Atheum Publishing Assistant</p>
            </div>
        </div>

        <div bind:this={chatContainerRef} class="flex-1 overflow-y-auto p-5 pb-8 space-y-6 scroll-smooth">
            {#each messages as msg}
                <div class="flex flex-col max-w-[90%] {msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}">
                    <span class="text-[11px] font-medium text-[#c4b89e] mb-1.5 uppercase tracking-wide px-1">
                        {msg.role === 'user' ? 'You' : 'Editor AI'}
                    </span>
                    <div class="px-4 py-3 rounded-2xl text-[14px] leading-relaxed relative {msg.role === 'user' ? 'bg-[#3d3526] text-[#faf7f2] rounded-br-[4px]' : 'bg-[#f8f5ed] border border-[#e8e0d2] text-[#2d2518] rounded-bl-[4px] shadow-xs'}">
                        {msg.content}
                    </div>
                </div>
            {/each}
            
            {#if isChatting}
                 <div class="flex flex-col max-w-[85%] mr-auto items-start">
                    <span class="text-[11px] font-medium text-[#c4b89e] mb-1.5 uppercase tracking-wide px-1">Editor AI</span>
                    <div class="px-5 py-4 rounded-2xl bg-[#f8f5ed] border border-[#e8e0d2] rounded-bl-[4px] shadow-xs flex gap-1.5 items-center">
                        <div class="w-1.5 h-1.5 rounded-full bg-[#d4a853] animate-bounce"></div>
                        <div class="w-1.5 h-1.5 rounded-full bg-[#d4a853] animate-bounce" style="animation-delay: 0.15s"></div>
                        <div class="w-1.5 h-1.5 rounded-full bg-[#d4a853] animate-bounce" style="animation-delay: 0.3s"></div>
                    </div>
                </div>
            {/if}
        </div>

        <div class="p-4 border-t border-[#e8e0d2] bg-white">
            <form onsubmit={(e) => { e.preventDefault(); handleChatSubmit(); }} class="relative flex items-end shadow-xs border border-[#e0d8c8] rounded-2xl bg-[#fdfaf6] focus-within:border-[#d4a853] focus-within:ring-1 focus-within:ring-[#d4a853] transition-all">
                <textarea 
                    bind:value={inputMessage}
                    onkeydown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSubmit(); } }}
                    placeholder="Describe your book idea..." 
                    class="w-full bg-transparent border-none focus:ring-0 resize-none py-3.5 pl-4 pr-12 text-sm text-[#1a1a1a] placeholder:text-[#bfb49e] max-h-32 min-h-[52px]"
                    rows="1"
                    disabled={isChatting || generating}
                ></textarea>
                <div class="absolute right-2 bottom-2 z-20">
                    <button type="submit" aria-label="Send message" class="w-9 h-9 rounded-xl bg-[#8B6914] text-white flex items-center justify-center hover:bg-[#a67c1a] shadow-md transition-all active:scale-95 cursor-pointer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="shrink-0" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- ====== RIGHT PANEL: STUDIO CANVAS ====== -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto relative isolate">
        <!-- Abstract background pattern -->
        <div class="absolute inset-0 pointer-events-none opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83v58.34h-58.34l-.83-.83L54.627 0zM52.97 0l.83.83v56.68h-56.68l-.83-.83L52.97 0zM51.313 0l.83.83v55.02h-55.02l-.83-.83L51.313 0z\' fill=\'%238B6914\' fill-rule=\'evenodd\'/%3E%3C/svg%3E');"></div>

        <!-- Error Banner -->
        {#if error && !generating}
            <div class="w-full max-w-2xl bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4 mb-6 shadow-xs relative z-10 flex gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" class="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p class="text-[#7f1d1d] text-sm">{error}</p>
            </div>
        {/if}

        {#if !generating && !success}
            <!-- Configuration Studio -->
            <div class="w-full max-w-2xl bg-white border border-[#e8e0d2] rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(139,105,20,0.06)] relative z-10 transition-all">
                <div class="p-6 md:p-8">
                    <div class="flex items-center justify-between mb-8 pb-6 border-b border-[#f0e8da]">
                        <div>
                            <h2 class="text-2xl font-serif font-bold text-[#1a1a1a]">Canvas Settings</h2>
                            <p class="text-sm text-[#8a7e6b] mt-1">Configure your document before initiating rendering.</p>
                        </div>
                        <div class="flex items-center gap-4 bg-[#f8f5ed] px-4 py-2 rounded-xl border border-[#e8e0d2]">
                            <div class="text-right">
                                <p class="text-[10px] uppercase font-bold text-[#a89b85] tracking-wider mb-0.5">Quota</p>
                                <p class="text-sm font-semibold {quotaRemaining > 0 ? 'text-[#6d8a50]' : 'text-red-500'}">{quotaRemaining} Remaining</p>
                            </div>
                            <div class="h-8 w-px bg-[#e0d8c8]"></div>
                            <div class="text-right">
                                <p class="text-[10px] uppercase font-bold text-[#a89b85] tracking-wider mb-0.5">Tier</p>
                                <p class="text-sm font-semibold text-[#8B6914]">{planLabel}</p>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label for="topic" class="text-xs font-semibold uppercase tracking-wider text-[#a89b85]">Target Topic</label>
                            <input type="text" id="topic" bind:value={topic} placeholder="e.g., The Physics of Black Holes" class="w-full px-4 py-3 bg-[#fdfaf6] border border-[#e0d8c8] rounded-xl text-[#3d3526] text-sm focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/20 outline-none transition-all">
                            <p class="text-xs text-[#c4b89e]">The AI Editor can help you brainstorm this in the chat.</p>
                        </div>

                        <div class="grid grid-cols-2 gap-5">
                            <div class="space-y-2">
                                <label for="format" class="text-xs font-semibold uppercase tracking-wider text-[#a89b85]">Content Format</label>
                                <select id="format" bind:value={selectedFormat} class="w-full px-4 py-3 bg-[#fdfaf6] border border-[#e0d8c8] rounded-xl text-[#3d3526] text-sm focus:border-[#d4a853] outline-none appearance-none">
                                    {#each availableFormats as fmt}
                                        <option value={fmt.id}>{fmt.label}</option>
                                    {/each}
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label for="title" class="text-xs font-semibold uppercase tracking-wider text-[#a89b85]">Custom Title (Optional)</label>
                                <input type="text" id="title" bind:value={customTitle} placeholder="Leave blank for AI choice" class="w-full px-4 py-3 bg-[#fdfaf6] border border-[#e0d8c8] rounded-xl text-[#3d3526] text-sm focus:border-[#d4a853] outline-none">
                            </div>
                        </div>

                        <div class="pt-6 mt-4 flex items-center justify-between border-t border-[#f0e8da]">
                            <p class="text-xs text-[#8a7e6b]">Estimated length: <strong class="text-[#3d3526]">{pageRange.max} pages</strong> ({qualityTier})</p>
                            
                            <button onclick={handleGenerate} disabled={!canGenerate} class="flex items-center gap-2 bg-linear-to-r from-[#1a1a1a] to-[#2d2518] text-white px-6 py-3 rounded-xl font-medium text-sm hover:translate-y-[-2px] hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v6l3-2"/><path d="M12 3v6l-3-2"/><circle cx="12" cy="16" r="5"/></svg>
                                Render Final Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        {:else if generating}
            <!-- Generating Overlay (Inline) -->
            <div bind:this={generatingOverlayRef} class="w-full max-w-xl bg-white border border-[#e8e0d2] rounded-[24px] p-10 flex flex-col items-center text-center shadow-[0_20px_60px_rgba(139,105,20,0.08)] relative z-10 overflow-hidden">
                <div class="absolute inset-0 opacity-[0.02]" style="background: radial-gradient(circle at center, #8B6914 0%, transparent 70%);"></div>
                
                <div class="w-20 h-20 mb-8 relative">
                    <div class="absolute inset-0 rounded-full border-4 border-[#f0e8da]"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-[#d4a853] border-t-transparent animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center text-[#8B6914]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
                    </div>
                </div>

                <h3 class="text-xl font-bold text-[#1a1a1a] mb-2 font-serif">Rendering {getFormatSelectedLabel()}</h3>
                <p class="text-[#8a7e6b] text-sm max-w-xs">{progressMessage}</p>

                <!-- Phase Track -->
                <div class="w-full max-w-sm mt-10">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[10px] font-bold tracking-wider uppercase {progressPhase === 'outlining' ? 'text-[#8B6914]' : 'text-[#c4b89e]'}">Architecture</span>
                        <span class="text-[10px] font-bold tracking-wider uppercase {progressPhase === 'writing' ? 'text-[#8B6914]' : 'text-[#c4b89e]'}">Writing</span>
                        <span class="text-[10px] font-bold tracking-wider uppercase {progressPhase === 'finalizing' ? 'text-[#8B6914]' : 'text-[#c4b89e]'}">Polishing</span>
                    </div>
                    <div class="h-1.5 w-full bg-[#f0e8da] rounded-full overflow-hidden">
                        <div class="h-full bg-linear-to-r from-[#d4a853] to-[#8B6914] transition-all duration-700 ease-out" 
                             style="width: {progressPhase === 'outlining' ? '20%' : progressPhase === 'writing' ? '60%' : progressPhase === 'finalizing' ? '90%' : '100%'}"></div>
                    </div>
                </div>

                {#if progressPhase === 'writing' && currentChapter > 0}
                    <div class="mt-6 w-full max-w-sm bg-[#fcfaf7] border border-[#f0e8da] rounded-xl p-4 text-left">
                        <p class="text-xs font-semibold text-[#8a7e6b] uppercase tracking-wider mb-2">Current Segment: {currentChapter}/{totalChapters}</p>
                        <p class="text-sm font-medium text-[#3d3526] truncate">"{currentChapterTitle}"</p>
                    </div>
                {/if}

                <p class="text-xs text-[#c4b89e] mt-8 flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Elapsed: {formatTime(elapsedSeconds)}
                </p>
            </div>

        {:else if success && ebookContent}
            <!-- Finished Book Artifact -->
            <div bind:this={rightPanelRef} class="w-full max-w-3xl bg-white border border-[#e8e0d2] rounded-[24px] shadow-[0_20px_60px_rgba(139,105,20,0.06)] overflow-hidden relative z-10 flex flex-col h-full max-h-full">
                <!-- Artifact Header -->
                <div class="px-8 py-5 border-b border-[#f0e8da] bg-[#fdfaf6] flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-[#6d8a50] rounded-xl flex items-center justify-center shadow-xs">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><polyline points="9 11 11 13 15 9"/></svg>
                        </div>
                        <div>
                            <h2 class="text-lg font-bold text-[#1a1a1a] font-serif truncate max-w-[300px]">{customTitle || topic || 'Generated Document'}</h2>
                            <p class="text-xs font-medium text-[#8B6914] uppercase tracking-wider">{getFormatSelectedLabel()}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick={downloadEbook} disabled={isGeneratingPdf} class="px-4 py-2 border border-[#e8e0d2] hover:bg-[#f8f5ed] rounded-lg text-xs font-semibold text-[#3d3526] transition-colors flex items-center gap-1.5 disabled:opacity-50">
                            {#if isGeneratingPdf}
                                <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="15"/></svg>
                                Rendering...
                            {:else}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                PDF
                            {/if}
                        </button>
                        <button onclick={() => { success = false; ebookContent = ''; }} class="px-4 py-2 bg-linear-to-b from-[#1a1a1a] to-[#2d2518] rounded-lg text-xs font-semibold text-white shadow-xs hover:translate-y-[-1px] transition-all">
                            Start New
                        </button>
                    </div>
                </div>

                <!-- Document Content View -->
                <div class="flex-1 overflow-y-auto p-8 md:p-12 prose-preview bg-white">
                    {@html ebookContent
                            .replace(/^# (.+)$/gm, '<h1 class="text-3xl lg:text-4xl font-serif font-bold text-[#1a1a1a] border-b-2 border-[#f0e8da] pb-6 mb-10">$1</h1>')
                            .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-serif font-bold text-[#2d2518] mt-12 mb-4">$1</h2>')
                            .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-[#3d3526] mt-8 mb-3">$1</h3>')
                            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-[#1a1a1a]">$1</strong>')
                            .replace(/\*(.+?)\*/g, '<em class="italic text-[#3d3526]">$1</em>')
                            .replace(/`(.+?)`/g, '<code class="bg-[#f0e8da]/50 text-[#8B6914] px-1.5 py-0.5 rounded-md text-[0.9em] font-mono">$1</code>')
                            .replace(/^\s*[-*]\s+(.+)$/gm, '<li class="ml-6 list-disc mb-2 pl-2 text-[#3d3526] leading-relaxed">$1</li>')
                            .replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="ml-6 list-decimal mb-2 pl-2 text-[#3d3526] leading-relaxed">$1</li>')
                            .replace(/^(<li.*<\/li>\s*)+/gm, '<ul class="my-5">$&</ul>')
                            .replace(/\n\n/g, '</p><p class="mb-5 leading-relaxed text-[#4a4235]">')
                            .replace(/\n/g, '<br>')
                            .replace(/^<p>/, '<p class="mb-5 leading-relaxed text-[#4a4235]">')
                    }
                </div>
            </div>
        {/if}
    </div>
</main>