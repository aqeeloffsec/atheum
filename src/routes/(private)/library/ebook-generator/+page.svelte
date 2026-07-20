<script lang="ts">
    import { tick } from 'svelte';
    import { badge } from '$lib/stores/badge';
    import gsap from 'gsap';

    let { data } = $props();

    // ----- Chat State -----
    let messages = $state([
        { role: 'assistant', content: 'Welcome to the Atheum AI Publishing Studio! I am your personal editor and book architect. To get started, what topic would you like to write about? And what kind of document are you envisioning?' }
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
    let completedChapters = $state(0);
    let currentChapterTitle = $state('');
    let ebookContent = $state('');
    let error = $state('');
    let success = $state(false);
    let canGenerate = $state(false);
    let coverImageUrl = $state('');
    let isGeneratingPdf = $state(false);
    let isSavingToLibrary = $state(false);
    let savedToLibrary = $state(false);
    let elapsedSeconds = $state(0);
    let finalElapsedSeconds = $state(0);
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

    // Scroll chat only when messages change, and animate new bubbles
    let prevMessageCount = $state(0);
    $effect(() => {
        const count = messages.length;
        if (chatContainerRef && count > prevMessageCount) {
            const addedCount = count - prevMessageCount;
            prevMessageCount = count;
            tick().then(() => {
                const bubbles = chatContainerRef.querySelectorAll('.message-bubble');
                const newBubbles = Array.from(bubbles).slice(-addedCount);
                if (newBubbles.length > 0) {
                    gsap.fromTo(newBubbles, 
                        { opacity: 0, y: 15, scale: 0.95 }, 
                        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.5)' }
                    );
                }
                chatContainerRef.scrollTo({ top: chatContainerRef.scrollHeight, behavior: 'smooth' });
            });
        } else if (chatContainerRef && count < prevMessageCount) {
            prevMessageCount = count;
        }
    });

    $effect(() => {
        if (isChatting) {
            tick().then(() => {
                if (chatContainerRef) {
                    chatContainerRef.scrollTo({ top: chatContainerRef.scrollHeight, behavior: 'smooth' });
                }
            });
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

    // Dynamic progress percentage based on actual chapter progress
    let progressPercent = $derived.by(() => {
        if (progressPhase === 'idle') return 0;
        if (progressPhase === 'outlining') return 10;
        if (progressPhase === 'writing' && totalChapters > 0) {
            // 10% for outline + 75% for writing, distributed across chapters
            return 10 + Math.round((completedChapters / totalChapters) * 75);
        }
        if (progressPhase === 'finalizing') return 92;
        if (progressPhase === 'completed') return 100;
        return 0;
    });

    let selectedFormatDescription = $derived(
        availableFormats.find((f: any) => f.id === selectedFormat)?.description || ''
    );

    async function handleChatSubmit() {
        if (!inputMessage.trim()) return;

        const userMsg = inputMessage.trim();
        messages = [...messages, { role: 'user', content: userMsg }];
        inputMessage = '';
        isChatting = true;

        try {
            const response = await fetch('/api/chat-brainstorm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            });

            if (!response.ok) throw new Error('Failed to chat');

            const data = await response.json();

            if (data.reply) {
                messages = [...messages, { role: 'assistant', content: data.reply }];
                if (data.structured) {
                    const structured = data.structured;
                    if (structured.topic && !topic) topic = structured.topic;
                    if (structured.format && !selectedFormat) selectedFormat = structured.format;
                    if (structured.title && !customTitle) customTitle = structured.title;
                }
            } else if (data.error) {
                throw new Error(data.error);
            }
        } catch (err: any) {
            console.error(err);
            messages = [...messages, { role: 'assistant', content: "Connection issue detected, but you can manually configure and generate." }];
        } finally {
            isChatting = false;
        }
    }

    async function handleGenerate() {
        if (!topic.trim()) { error = 'Please ensure a topic is set in the configuration panel.'; return; }
        if (!selectedFormat) { error = 'Please select a document format.'; return; }
        if (!canGenerate) { error = 'Monthly limit reached.'; return; }

        error = '';
        success = false;
        generating = true;
        progressPhase = 'idle';
        progressMessage = 'Connecting to engine...';
        currentChapter = 0;
        totalChapters = 0;
        completedChapters = 0;
        currentChapterTitle = '';
        ebookContent = '';
        coverImageUrl = '';
        savedToLibrary = false;
        startTimer();

        messages = [...messages, { role: 'user', content: `Start generating: \nTopic: ${topic}\nFormat: ${selectedFormat}` }];
        messages = [...messages, { role: 'assistant', content: `Rendering sequence initiated! Monitor execution in the studio canvas.` }];

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
                throw new Error(result.error || 'Failed to generate');
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
                        if (message.status === 'keepalive') continue;

                        if (message.status === 'outlining') {
                            progressPhase = 'outlining';
                            totalChapters = message.totalChapters || 0;
                            progressMessage = `Architecting ${message.targetPages}-page document...`;
                        } else if (message.status === 'writing') {
                            progressPhase = 'writing';
                            currentChapter = message.chapter;
                            currentChapterTitle = message.title;
                            totalChapters = message.totalChapters || totalChapters;
                            if (message.completedChapters !== undefined) completedChapters = message.completedChapters;
                            progressMessage = `Authoring Segment ${message.chapter}: ${message.title}`;
                        } else if (message.status === 'finalizing') {
                            progressPhase = 'finalizing';
                            completedChapters = totalChapters;
                            progressMessage = 'Applying final stylistic polish...';
                        } else if (message.status === 'completed') {
                            ebookContent = message.content || '';
                            coverImageUrl = message.coverImageUrl || '';
                            progressPhase = 'completed';
                            success = true;
                            generating = false;
                            finalElapsedSeconds = elapsedSeconds;
                            monthlyUsed += 1;
                            canGenerate = monthlyUsed < monthlyLimit;
                            stopTimer();

                            messages = [...messages, { role: 'assistant', content: `Document rendered successfully.` }];

                            await tick();
                            if (rightPanelRef) {
                                gsap.fromTo(rightPanelRef,
                                    { opacity: 0, y: 20 },
                                    { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)' }
                                );
                            }
                        }
                    } catch (e: any) {
                        if (e.message !== "Unexpected end of JSON input" && !e.message.includes("JSON")) throw e;
                    }
                }
            }
            const formatLabel = availableFormats.find((f: any) => f.id === selectedFormat)?.label || 'Document';
            badge.show(`${formatLabel} complete!`, 'success');
        } catch (err: any) {
            error = err.message || 'Generation failed.';
            generating = false;
            stopTimer();
            messages = [...messages, { role: 'assistant', content: `Error: ${error}` }];
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
            if (!response.ok) throw new Error('PDF failed');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const filename = `${topic.replace(/\s+/g, '_') || 'ebook'}.pdf`;
            const link = document.createElement('a');
            link.href = url; link.download = filename;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            error = 'PDF generation failed.';
        } finally {
            isGeneratingPdf = false;
        }
    }

    async function saveToLibrary() {
        if (!ebookContent || savedToLibrary) return;
        isSavingToLibrary = true;
        error = '';
        try {
            const formData = new FormData();
            formData.append('topic', topic.trim());
            formData.append('content', ebookContent);
            formData.append('title', customTitle.trim() || `Guide to ${topic}`);
            const response = await fetch('/api/library/save-ebook', { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Save failed');
            savedToLibrary = true;
            badge.show('Saved to library!', 'success');
        } catch (err: any) {
            error = err.message || 'Save failed.';
        } finally {
            isSavingToLibrary = false;
        }
    }

    function startNew() {
        success = false; ebookContent = ''; coverImageUrl = ''; topic = ''; customTitle = '';
        selectedFormat = availableFormats.length > 0 ? availableFormats[0].id : '';
        error = ''; generating = false; progressPhase = 'idle'; currentChapter = 0; totalChapters = 0;
        completedChapters = 0; currentChapterTitle = ''; savedToLibrary = false; finalElapsedSeconds = 0;
    }

    function getFormatSelectedLabel() {
        return availableFormats.find((f: any) => f.id === selectedFormat)?.label || 'Document';
    }

    function renderMarkdown(md: string) {
        const lines = md.split('\n');
        let html = ''; let inList = false; let listType = 'ul'; let inBlockquote = false;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
                if (inList) { html += `</${listType}>`; inList = false; }
                if (inBlockquote) { html += '</blockquote>'; inBlockquote = false; }
                html += '<hr class="my-10 border-t border-[#e0e0e0] opacity-50">'; continue;
            }
            if (line.startsWith('### ')) {
                if (inList) { html += `</${listType}>`; inList = false; }
                if (inBlockquote) { html += '</blockquote>'; inBlockquote = false; }
                html += `<h3 class="text-xl font-bold tracking-tight text-[#111] mt-8 mb-4">${inlineFormat(line.slice(4))}</h3>`; continue;
            }
            if (line.startsWith('## ')) {
                if (inList) { html += `</${listType}>`; inList = false; }
                if (inBlockquote) { html += '</blockquote>'; inBlockquote = false; }
                html += `<h2 class="text-3xl font-serif font-bold text-[#111] mt-12 mb-6">${inlineFormat(line.slice(3))}</h2>`; continue;
            }
            if (line.startsWith('# ')) {
                if (inList) { html += `</${listType}>`; inList = false; }
                if (inBlockquote) { html += '</blockquote>'; inBlockquote = false; }
                html += `<h1 class="text-4xl lg:text-5xl font-serif font-bold text-[#050505] tracking-tight border-b border-[#eaeaea] pb-6 mb-10">${inlineFormat(line.slice(2))}</h1>`; continue;
            }
            if (line.startsWith('> ')) {
                if (inList) { html += `</${listType}>`; inList = false; }
                if (!inBlockquote) {
                    html += '<blockquote class="border-l-4 border-[#d4a853] pl-6 py-2 my-8 bg-linear-to-r from-[#d4a853]/5 to-transparent rounded-r-xl italic text-[#444] font-medium">';
                    inBlockquote = true;
                }
                html += `<p class="mb-2 text-lg">${inlineFormat(line.slice(2))}</p>`; continue;
            } else if (inBlockquote) { html += '</blockquote>'; inBlockquote = false; }

            if (/^\s*[-*]\s+/.test(line)) {
                if (!inList || listType !== 'ul') { if (inList) html += `</${listType}>`; html += '<ul class="my-6 space-y-3">'; inList = true; listType = 'ul'; }
                const text = line.replace(/^\s*[-*]\s+/, '');
                html += `<li class="ml-6 list-disc pl-2 text-[#333] leading-relaxed">${inlineFormat(text)}</li>`; continue;
            }
            if (/^\s*\d+\.\s+/.test(line)) {
                if (!inList || listType !== 'ol') { if (inList) html += `</${listType}>`; html += '<ol class="my-6 space-y-3">'; inList = true; listType = 'ol'; }
                const text = line.replace(/^\s*\d+\.\s+/, '');
                html += `<li class="ml-6 list-decimal pl-2 text-[#333] leading-relaxed">${inlineFormat(text)}</li>`; continue;
            }
            if (inList) { html += `</${listType}>`; inList = false; }
            if (!line.trim()) continue;
            html += `<p class="mb-6 leading-relaxed text-[#444] text-[17px] tracking-wide">${inlineFormat(line)}</p>`;
        }
        if (inList) html += `</${listType}>`;
        if (inBlockquote) html += '</blockquote>';
        return html;
    }

    function inlineFormat(text: string) {
        return text
            .replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-bold"><em class="italic">$1</em></strong>')
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-extrabold text-[#111]">$1</strong>')
            .replace(/\*(.+?)\*/g, '<em class="italic text-[#222]">$1</em>')
            .replace(/`(.+?)`/g, '<code class="bg-[#f0f0f0] text-[#111] px-2 py-0.5 rounded-md text-[0.85em] font-mono border border-[#e0e0e0]">$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#d4a853] font-semibold hover:text-[#a67c1a] border-b border-[#d4a853]/30 hover:border-[#a67c1a] transition-colors" target="_blank" rel="noopener">$1</a>');
    }
</script>

<main class="h-[calc(100vh-4rem)] flex overflow-hidden bg-[#fbfbfb] font-sans selection:bg-[#d4a853]/30">
    <!-- ====== LEFT SIDEBAR: DARK GLASSMORPHISM CHAT ====== -->
    <div class="w-full md:w-[380px] lg:w-[420px] bg-[#0A0A0A] text-white/90 border-r border-[#222] flex flex-col relative z-20 shadow-[12px_0_40px_rgba(0,0,0,0.2)]">
        <!-- Sidebar subtle gradient bg -->
        <div class="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none"></div>
        <div class="absolute -top-[100px] -left-[100px] w-[300px] h-[300px] bg-[#d4a853]/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div class="px-6 py-5 border-b border-white/10 relative z-10 flex items-center gap-4 bg-black/20 backdrop-blur-md">
            <div class="w-10 h-10 rounded-xl bg-linear-to-br from-[#d4a853] to-[#8B6914] flex flex-col items-center justify-center text-white shadow-[0_0_15px_rgba(212,168,83,0.3)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="opacity-90" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
            </div>
            <div>
                <h1 class="text-white font-bold text-sm tracking-wide">Editor Studio</h1>
                <p class="text-white/50 text-xs font-medium">Atheum Publishing Assistant</p>
            </div>
        </div>

        <div bind:this={chatContainerRef} class="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth relative z-10 custom-scrollbar">
            {#each messages as msg}
                <div class="message-bubble flex flex-col max-w-[88%] {msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}">
                    <span class="text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest px-1">
                        {msg.role === 'user' ? 'You' : 'Editor AI'}
                    </span>
                    <div class="px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed relative {msg.role === 'user' ? 'bg-[#222] border border-white/5 text-white/90 rounded-br-[4px]' : 'bg-linear-to-br from-[#1a1a1a] to-[#111] border border-white/10 text-white/90 rounded-bl-[4px] shadow-lg'}">
                        {msg.content}
                    </div>
                </div>
            {/each}

            {#if isChatting}
                 <div class="flex flex-col max-w-[85%] mr-auto items-start">
                    <span class="text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-widest px-1">Editor AI</span>
                    <div class="px-5 py-4 rounded-2xl bg-linear-to-br from-[#1a1a1a] to-[#111] border border-white/10 rounded-bl-[4px] shadow-lg flex gap-1.5 items-center">
                        <div class="w-2 h-2 rounded-full bg-[#d4a853] animate-pulse"></div>
                        <div class="w-2 h-2 rounded-full bg-[#d4a853] animate-pulse" style="animation-delay: 0.15s"></div>
                        <div class="w-2 h-2 rounded-full bg-[#d4a853] animate-pulse" style="animation-delay: 0.3s"></div>
                    </div>
                </div>
            {/if}
        </div>

        <div class="p-5 border-t border-white/10 bg-[#050505] relative z-10 hidden md:block">
            <form onsubmit={(e) => { e.preventDefault(); handleChatSubmit(); }} class="relative flex items-end rounded-2xl bg-[#111] border border-white/10 focus-within:border-[#d4a853] focus-within:shadow-[0_0_15px_rgba(212,168,83,0.15)] transition-all overflow-hidden group">
                <textarea
                    bind:value={inputMessage}
                    onkeydown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSubmit(); } }}
                    placeholder="Describe your book idea..."
                    class="w-full bg-transparent border-none outline-none focus:ring-0 resize-none py-4 pl-5 pr-14 text-sm text-white placeholder:text-white/30 max-h-32 min-h-[56px]"
                    rows="1"
                    disabled={isChatting || generating}
                ></textarea>
                <div class="absolute right-2 bottom-2 z-20">
                    <button type="submit" aria-label="Send message" disabled={isChatting || generating} class="w-10 h-10 rounded-xl bg-linear-to-br from-[#d4a853] to-[#8B6914] text-white flex items-center justify-center hover:brightness-110 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="shrink-0 group-focus-within:translate-x-0.5 transition-transform" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- ====== RIGHT PANEL: STUDIO CANVAS ====== -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto relative isolate bg-[#fcfcfc]">
        <!-- Sophisticated subtle background grid -->
        <div class="absolute inset-0 pointer-events-none opacity-[0.015]" style="background-image: radial-gradient(#1a1a1a 1px, transparent 1px); background-size: 24px 24px;"></div>
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-linear-to-br from-[#d4a853]/5 to-transparent blur-[120px] rounded-full pointer-events-none"></div>

        <!-- Error Banner -->
        {#if error && !generating}
            <div class="w-full max-w-2xl bg-white border border-red-100 rounded-2xl p-5 mb-8 shadow-sm relative z-10 flex gap-4 items-start">
                <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div class="flex-1 pt-1.5">
                    <h4 class="text-xs font-bold uppercase tracking-widest text-red-800 mb-1">Issue Detected</h4>
                    <p class="text-red-600 text-sm">{error}</p>
                </div>
                <button onclick={() => error = ''} aria-label="Dismiss error" class="mt-1 text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50 cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        {/if}

        {#if !generating && !success}
            <!-- Configuration Studio -->
            <div class="w-full max-w-[720px] bg-white border border-[#e5e5e5] rounded-[32px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.03)] relative z-10 transition-all hover:shadow-[0_20px_80px_rgba(0,0,0,0.06)] duration-500 group">
                <!-- Inner glow top edge -->
                <div class="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#d4a853]/30 to-transparent"></div>
                
                <div class="p-8 md:p-10">
                    <div class="flex items-start justify-between mb-10">
                        <div>
                            <h2 class="text-[28px] leading-tight font-serif font-bold text-[#1a1a1a] tracking-tight">Project Configuration</h2>
                            <p class="text-[15px] text-[#777] mt-2 font-medium">Finalize your manuscript details before initiating generation.</p>
                        </div>
                        <div class="flex flex-col gap-2 items-end">
                            <div class="flex items-center gap-3 bg-[#fafafa] px-4 py-2.5 rounded-2xl border border-[#ededed]">
                                <div class="text-right">
                                    <p class="text-[10px] uppercase font-bold text-[#999] tracking-widest mb-0.5">Plan Tier</p>
                                    <p class="text-xs font-bold text-[#d4a853]">{planLabel}</p>
                                </div>
                                <div class="h-6 w-px bg-[#e5e5e5]"></div>
                                <div class="text-right">
                                    <p class="text-[10px] uppercase font-bold text-[#999] tracking-widest mb-0.5">Quota</p>
                                    <p class="text-xs font-bold {quotaRemaining > 0 ? 'text-[#1a1a1a]' : 'text-red-500'}">{quotaRemaining} Rem.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-8">
                        <div class="space-y-3 group/field">
                            <label for="topic" class="text-xs font-bold uppercase tracking-widest text-[#888] flex items-center gap-2">
                                Target Topic
                                <div class="h-px bg-[#eee] flex-1 transition-colors group-focus-within/field:bg-[#d4a853]/30"></div>
                            </label>
                            <input type="text" id="topic" bind:value={topic} placeholder="e.g., The Architecture of Future Cities" class="w-full px-5 py-4 bg-[#fafafa] border border-[#eee] rounded-2xl text-[#1a1a1a] text-[15px] font-medium focus:bg-white focus:border-[#d4a853] outline-none transition-all placeholder:text-[#ccc]">
                            <p class="text-[13px] text-[#999] pt-1">The AI Editor can help you brainstorm this in the chat.</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="space-y-3 group/field">
                                <label for="format" class="text-xs font-bold uppercase tracking-widest text-[#888] flex items-center gap-2">
                                    Content Format
                                    <div class="h-px bg-[#eee] flex-1 transition-colors group-focus-within/field:bg-[#d4a853]/30"></div>
                                </label>
                                <div class="relative">
                                    <select id="format" bind:value={selectedFormat} class="w-full px-5 py-4 bg-[#fafafa] border border-[#eee] rounded-2xl text-[#1a1a1a] text-[15px] font-medium focus:bg-white focus:border-[#d4a853] outline-none appearance-none cursor-pointer transition-all">
                                        {#each availableFormats as fmt}
                                            <option value={fmt.id}>{fmt.label}</option>
                                        {/each}
                                    </select>
                                    <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#999]">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-3 group/field">
                                <label for="title" class="text-xs font-bold uppercase tracking-widest text-[#888] flex items-center gap-2">
                                    Custom Title <span class="text-[#bbb] font-medium text-[10px] bg-[#f5f5f5] px-1.5 py-0.5 rounded-sm">OPTIONAL</span>
                                    <div class="h-px bg-[#eee] flex-1 transition-colors group-focus-within/field:bg-[#d4a853]/30"></div>
                                </label>
                                <input type="text" id="title" bind:value={customTitle} placeholder="Leave blank for AI choice" class="w-full px-5 py-4 bg-[#fafafa] border border-[#eee] rounded-2xl text-[#1a1a1a] text-[15px] font-medium focus:bg-white focus:border-[#d4a853] outline-none transition-all placeholder:text-[#ccc]">
                            </div>
                        </div>

                        {#if selectedFormatDescription}
                            <div class="bg-[#fafafa] border border-[#f0f0f0] rounded-xl p-4 flex gap-3 items-start">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4a853" stroke-width="2.5" class="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                <p class="text-[13px] text-[#666] leading-relaxed">{selectedFormatDescription}</p>
                            </div>
                        {/if}

                        <div class="pt-8 mt-4 flex items-center justify-between border-t border-[#f0f0f0]">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
                                <p class="text-[13px] text-[#777] font-medium">Auto-scaling to <strong class="text-[#1a1a1a]">{pageRange.max} pages</strong> ({qualityTier})</p>
                            </div>

                            <button onclick={handleGenerate} disabled={!canGenerate || !topic.trim()} class="relative overflow-hidden group/btn flex items-center gap-3 bg-[#111] text-white px-8 py-4 rounded-2xl font-bold text-[14px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95">
                                <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="group-hover/btn:rotate-12 transition-transform"><path d="M12 3v6l3-2"/><path d="M12 3v6l-3-2"/><circle cx="12" cy="16" r="5"/></svg>
                                Render Manuscript
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        {:else if generating}
            <!-- Generating Overlay -->
            <div bind:this={generatingOverlayRef} class="w-full max-w-2xl bg-white border border-[#eaeaea] rounded-[32px] p-12 flex flex-col shadow-[0_30px_80px_rgba(0,0,0,0.06)] relative z-10 overflow-hidden">
                <div class="absolute inset-0 bg-linear-to-b from-white to-[#fafafa] pointer-events-none"></div>
                <!-- Premium top banner bar -->
                <div class="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-[#111] via-[#d4a853] to-[#111]"></div>
                <!-- Accent glow background -->
                <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#d4a85315,transparent_50%)]"></div>

                <div class="relative z-10 flex flex-col">
                    <div class="flex items-start justify-between mb-10">
                        <div>
                            <div class="flex items-center gap-2 mb-3">
                                <div class="w-2.5 h-2.5 rounded-full bg-[#d4a853] animate-pulse"></div>
                                <p class="text-[11px] font-bold tracking-widest text-[#d4a853] uppercase">System Active</p>
                            </div>
                            <h3 class="text-[28px] font-bold text-[#1a1a1a] font-serif leading-tight">Rendering Model</h3>
                            <p class="text-[#777] text-[15px] font-medium mt-1">{progressMessage}</p>
                        </div>
                        <div class="text-right bg-white border border-[#eee] rounded-2xl px-5 py-3 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                            <p class="text-[10px] font-bold tracking-widest text-[#999] uppercase mb-1">Time Elapsed</p>
                            <p class="text-[20px] font-bold text-[#1a1a1a] font-mono tracking-tight">{formatTime(elapsedSeconds)}</p>
                        </div>
                    </div>

                    <!-- Multi-step Dynamic Tracker -->
                    <div class="w-full mt-2 bg-white border border-[#f0f0f0] rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] relative">
                        <div class="flex items-center justify-between mb-8 relative">
                            <div class="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1.5 bg-[#f5f5f5] rounded-full z-0 overflow-hidden">
                                <div class="h-full bg-linear-to-r from-[#1a1a1a] to-[#d4a853] transition-all duration-700 ease-out rounded-full" style="width: {progressPercent}%"></div>
                            </div>
                            
                            <!-- Step 1: Outlining -->
                            <div class="relative z-10 flex flex-col items-center gap-3">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center {progressPhase === 'outlining' ? 'bg-[#1a1a1a] border-4 border-[#1a1a1a]/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] scale-110 transition-all duration-300' : progressPhase !== 'idle' ? 'bg-[#1a1a1a] text-white' : 'bg-white border-2 border-[#eee] text-[#ccc]'}">
                                    {#if progressPhase !== 'idle' && progressPhase !== 'outlining'}
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-[#d4a853]" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    {:else if progressPhase === 'outlining'}
                                        <div class="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                                    {:else}
                                        <span class="text-xs font-bold">1</span>
                                    {/if}
                                </div>
                                <span class="text-[11px] font-bold uppercase tracking-widest {progressPhase === 'outlining' ? 'text-[#1a1a1a]' : progressPhase !== 'idle' ? 'text-[#1a1a1a]' : 'text-[#aaa]'}">Outlining</span>
                            </div>
                            
                            <!-- Step 2: Researching -->
                            <div class="relative z-10 flex flex-col items-center gap-3">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center {(progressPhase === 'outlining' && progressPercent > 5) ? 'bg-[#1a1a1a] border-4 border-[#1a1a1a]/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] scale-110 transition-all duration-300' : progressPhase === 'writing' || progressPhase === 'finalizing' ? 'bg-[#1a1a1a] text-white' : 'bg-white border-2 border-[#eee] text-[#ccc]'}">
                                    {#if progressPhase === 'writing' || progressPhase === 'finalizing' || progressPhase === 'completed'}
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-[#d4a853]" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    {:else if progressPhase === 'outlining' && progressPercent > 5}
                                        <div class="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                                    {:else}
                                        <span class="text-xs font-bold">2</span>
                                    {/if}
                                </div>
                                <span class="text-[11px] font-bold uppercase tracking-widest {(progressPhase === 'outlining' && progressPercent > 5) || progressPhase === 'writing' || progressPhase === 'finalizing' ? 'text-[#1a1a1a]' : 'text-[#aaa]'}">Researching</span>
                            </div>

                            <!-- Step 3: Authoring -->
                            <div class="relative z-10 flex flex-col items-center gap-3">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center {progressPhase === 'writing' ? 'bg-[#1a1a1a] border-4 border-[#1a1a1a]/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] scale-110 transition-all duration-300' : progressPhase === 'finalizing' || progressPhase === 'completed' ? 'bg-[#1a1a1a] text-white' : 'bg-white border-2 border-[#eee] text-[#ccc]'}">
                                    {#if progressPhase === 'finalizing' || progressPhase === 'completed'}
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-[#d4a853]" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    {:else if progressPhase === 'writing'}
                                        <div class="w-3 h-3 rounded-full bg-[#d4a853] animate-ping"></div>
                                    {:else}
                                        <span class="text-xs font-bold">3</span>
                                    {/if}
                                </div>
                                <span class="text-[11px] font-bold uppercase tracking-widest {progressPhase === 'writing' || progressPhase === 'finalizing' ? 'text-[#1a1a1a]' : 'text-[#aaa]'}">Authoring</span>
                            </div>

                            <!-- Step 4: Finalizing -->
                            <div class="relative z-10 flex flex-col items-center gap-3">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center {progressPhase === 'finalizing' ? 'bg-[#1a1a1a] border-4 border-[#1a1a1a]/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] scale-110 transition-all duration-300' : progressPhase === 'completed' ? 'bg-[#1a1a1a] text-white' : 'bg-white border-2 border-[#eee] text-[#ccc]'}">
                                    {#if progressPhase === 'completed'}
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-[#d4a853]" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    {:else if progressPhase === 'finalizing'}
                                        <div class="w-3 h-3 rounded-full bg-[#d4a853] animate-pulse"></div>
                                    {:else}
                                        <span class="text-xs font-bold">4</span>
                                    {/if}
                                </div>
                                <span class="text-[11px] font-bold uppercase tracking-widest {progressPhase === 'finalizing' ? 'text-[#1a1a1a]' : 'text-[#aaa]'}">Finalizing</span>
                            </div>
                        </div>
                    </div>

                    <!-- Current Segment Output -->
                    {#if progressPhase === 'writing' && currentChapter > 0}
                        <div class="mt-6 w-full bg-[#fafafa] border border-[#eee] rounded-2xl p-6 text-left flex items-center justify-between gap-6 group hover:bg-white transition-colors duration-300">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full bg-white border border-[#eee] flex items-center justify-center shrink-0 shadow-sm group-hover:border-[#d4a853]/30 transition-colors">
                                    <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4a853" stroke-width="3"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="15"/></svg>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                        Authoring Module
                                        <span class="w-1 h-1 rounded-full bg-[#ccc]"></span>
                                        {currentChapter}/{totalChapters}
                                    </p>
                                    <p class="text-[16px] font-bold text-[#111] font-serif leading-snug">"{currentChapterTitle}"</p>
                                </div>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-linear-to-br from-[#f5f5f5] to-white border border-[#eee] flex items-center justify-center text-[#ccc]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>

        {:else if success && ebookContent}
            <!-- Finished Book Artifact -->
            <div bind:this={rightPanelRef} class="w-full max-w-4xl bg-white border border-[#eaeaea] rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.08)] overflow-hidden relative z-10 flex flex-col h-full max-h-full">
                <!-- Premium Artifact Header -->
                <div class="px-10 py-8 border-b border-[#f0f0f0] bg-white flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-6">
                    <div class="flex items-start gap-5">
                        <div class="w-14 h-14 bg-linear-to-br from-[#1a1a1a] to-black rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.15)] shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4a853" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><polyline points="9 11 11 13 15 9"/></svg>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-[#111] font-serif mb-1 wrap-break-word">{customTitle || topic || 'Generated Document'}</h2>
                            <div class="flex items-center gap-3">
                                <span class="bg-[#f5f5f5] text-[#111] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">{getFormatSelectedLabel()}</span>
                                {#if finalElapsedSeconds > 0}
                                    <span class="text-[11px] text-[#888] font-medium flex items-center gap-1.5">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        {formatTime(finalElapsedSeconds)}
                                    </span>
                                {/if}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <button onclick={saveToLibrary} disabled={isSavingToLibrary || savedToLibrary} class="flex-1 md:flex-none px-5 py-3 border border-[#eaeaea] hover:bg-[#fafafa] hover:border-[#ddd] rounded-xl text-[13px] font-bold text-[#111] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                            {#if isSavingToLibrary}
                                <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="15"/></svg>
                                Saving
                            {:else if savedToLibrary}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4a853" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                                Saved 
                            {:else}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                Library
                            {/if}
                        </button>
                        <button onclick={downloadEbook} disabled={isGeneratingPdf} class="flex-1 md:flex-none px-5 py-3 border border-[#eaeaea] hover:bg-[#fafafa] hover:border-[#ddd] rounded-xl text-[13px] font-bold text-[#111] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                            {#if isGeneratingPdf}
                                <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="15"/></svg>
                                PDF
                            {:else}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                PDF
                            {/if}
                        </button>
                        <button onclick={startNew} class="flex-1 md:flex-none px-5 py-3 bg-[#111] rounded-xl text-[13px] font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                            Start New
                        </button>
                    </div>
                </div>

                <!-- Document Content View -->
                <div class="flex-1 overflow-y-auto p-8 md:p-14 bg-white relative">
                    <div class="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
                    </div>
                    <div class="max-w-3xl mx-auto prose-preview">
                        {@html renderMarkdown(ebookContent)}
                    </div>
                </div>
            </div>
        {/if}
    </div>
</main>