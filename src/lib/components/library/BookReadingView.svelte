<script lang="ts">
    import type { PageFlip, PageFlipEvent } from 'page-flip';
    import { getUserState } from "$lib/state/user-state.svelte";
    import { fade } from 'svelte/transition';
    import { tick } from 'svelte';

    let pdfjs: any;
    let PageFlipClass: any;

    let { book } = $props<{ book: any }>();
    let userContext = getUserState();
    
    let bookContainer = $state<HTMLElement>();
    let flipBook = $state<PageFlip | null>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let totalPages = $state(0);
    let currentPage = $state(1);
    let pages: HTMLCanvasElement[] = $state([]);

    async function loadPdf() {

        if (!pdfjs || !book.file_url) {
        error = !book.file_url ? "No PDF file associated with this book." : "Reader not initialized.";
        loading = false;
        return;
    }

    try {
        let pdfUrl = book.file_url;

        if (!book.file_url.startsWith('http')) {
            // FIX: Remove leading slash if it exists
            const storagePath = book.file_url.replace(/^\/+/, '');
            
            console.log("Downloading from bucket 'book-pdfs' with path:", storagePath);
            
            const { data: blob, error: downloadError } = await userContext.supabase!.storage
                .from('book-pdfs')
                .download(storagePath);

            if (downloadError) {
                console.error("Storage Download Error:", downloadError);
                throw new Error(`Supabase RLS Error: ${downloadError.message}. Please ensure you have added a 'SELECT' policy for the 'book-pdfs' bucket in Supabase Storage so users can read files.`);
            }
            
            pdfUrl = URL.createObjectURL(blob);
        }

        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        totalPages = pdf.numPages;

            // 3. Render all pages to canvases
            const canvasPromises = [];
            for (let i = 1; i <= totalPages; i++) {
                canvasPromises.push(renderPage(pdf, i));
            }
            pages = await Promise.all(canvasPromises);

            // 4. Render the container by setting loading to false
            loading = false;
            await tick();

            // 5. Initialize PageFlip after canvases are ready
            initPageFlip();
        } catch (e: any) {
            console.error("Failed to load PDF:", e);
            error = e.message || "An unexpected error occurred while loading the PDF.";
            loading = false;
        }
    }

    async function renderPage(pdf: any, pageNum: number): Promise<HTMLCanvasElement> {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        return canvas;
    }

    function initPageFlip() {
        if (!bookContainer || !PageFlipClass) return;

        const instance = new PageFlipClass(bookContainer, {
            width: 550, // base page width
            height: 733, // base page height
            size: "stretch",
            minWidth: 315,
            maxWidth: 1000,
            minHeight: 420,
            maxHeight: 1350,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: false
        });

        const pageElements = bookContainer.querySelectorAll(".page-content");
        if (pageElements.length > 0) {
            instance.loadFromHTML(Array.from(pageElements) as HTMLElement[]);
        } else {
            console.warn("No pages found to load into PageFlip");
        }

        instance.on('flip', (e: PageFlipEvent) => {
            currentPage = (e.data as number) + 1;
        });

        flipBook = instance;
    }

    $effect(() => {
        // Run on the client after the component is mounted
        (async () => {
            // Dynamically import libraries only on the client to avoid SSR/CJS errors
            try {
                const [pdfjsLib, pageFlipLib] = await Promise.all([
                    import('pdfjs-dist'),
                    import('page-flip')
                ]);

                pdfjs = pdfjsLib;
                pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
                //pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

                // Handle CommonJS / ESM interop for page-flip
                PageFlipClass = pageFlipLib.PageFlip || pageFlipLib.default?.PageFlip || pageFlipLib.default;
                
                loadPdf();
            } catch (err) {
                console.error("Failed to initialize reader libraries:", err);
                error = "Failed to load reader engine.";
                loading = false;
            }
        })();

        // Return a cleanup function
        return () => {
            if (flipBook) {
                flipBook.destroy();
            }
        };
    });
</script>

<div class="flex-1 w-full h-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
    {#if loading}
        <div class="flex flex-col items-center gap-4" transition:fade>
            <div class="w-12 h-12 border-4 border-[#1a232e]/10 border-t-[#1a232e] rounded-full animate-spin"></div>
            <p class="text-gray-500 font-medium animate-pulse">Opening your book...</p>
        </div>
    {:else if error}
        <div class="max-w-md text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100" transition:fade>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle text-red-500 mx-auto mb-4">
                <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>
            <h3 class="text-lg font-bold text-[#1a232e] mb-2">Failed to load reader</h3>
            <p class="text-sm text-gray-500 mb-6">{error}</p>
            <button onclick={() => window.location.reload()} class="px-6 py-2 bg-[#1a232e] text-white rounded-xl font-bold text-sm hover:bg-[#2d3b4b] transition-all">
                Try Again
            </button>
        </div>
    {:else}
        <!-- Flipbook UI -->
        <div class="w-full h-full flex flex-col items-center justify-center max-w-7xl mx-auto" transition:fade>
            <!-- Shadow/Glow Background -->
            <div class="absolute w-[80%] max-w-4xl aspect-1.5/1 bg-[#1a232e]/5 blur-[120px] rounded-full opacity-50 pointer-events-none"></div>

            <div class="relative w-full h-[85vh] flex items-center justify-center">
                <!-- PageFlip Container -->
                <div bind:this={bookContainer} class="flip-book shadow-2xl">
                    {#each pages as canvas, i}
                        <div class="page-content bg-white shadow-inner overflow-hidden flex items-center justify-center" data-density="hard">
                            <div class="page-wrapper relative w-full h-full flex items-center justify-center bg-white">
                                <!-- Parchment Texture Overlay -->
                                <div class="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] z-10"></div>
                                
                                <!-- The Page Canvas -->
                                <div class="w-full h-full flex items-center justify-center p-2 md:p-4">
                                    <img src={canvas.toDataURL()} alt="Page {i + 1}" class="max-w-full max-h-full object-contain shadow-sm" />
                                </div>

                                <!-- Page Number -->
                                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 tracking-widest z-20">
                                    {i + 1}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Controls -->
            <div class="mt-8 flex items-center gap-6 bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-[#e6e0d4] z-50">
                <button 
                    aria-label="Previous Page"
                    onclick={() => flipBook?.flipPrev()} 
                    class="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={currentPage === 1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                
                <div class="flex flex-col items-center">
                    <span class="text-xs font-bold text-[#1a232e]">Page {currentPage} of {totalPages}</span>
                    <div class="w-32 h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                        <div class="h-full bg-[#1a232e] transition-all duration-300" style="width: {(currentPage / totalPages) * 100}%"></div>
                    </div>
                </div>

                <button 
                    aria-label="Next Page"
                    onclick={() => flipBook?.flipNext()} 
                    class="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={currentPage === totalPages}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    :global(.flip-book) {
        background-size: cover;
    }

    :global(.flip-book.st-covered) {
        display: block;
    }

    .page-content {
        box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.05);
    }
</style>
