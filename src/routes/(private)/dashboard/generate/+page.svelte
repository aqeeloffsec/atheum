<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import PremiumBookViewer from '$lib/components/book/PremiumBookViewer.svelte';
	import { paginateContent, type BookPage, type SemanticSection } from '$lib/utils/pagination';

	let topic = $state('');
	let audience = $state('');
	let style = $state('');
	let pagesTarget = $state(5);
	
	let isGenerating = $state(false);
	let error = $state('');
	let successMessage = $state('');
	
	let generatedTitle = $state('Untitled Ebook');
	let generatedAuthor = $state('AI Author');
	let bookPages = $state<BookPage[]>([]);
	let showViewer = $state(false);

	/**
	 * Extracts title and semantic sections from raw AI markdown
	 */
	function parseSemanticContent(markdown: string): { title: string; sections: SemanticSection[]; footnotes: string[] } {
		const lines = markdown.split('\n');
		let title = 'Untitled Ebook';
		const sections: SemanticSection[] = [];
		const footnoteMap = new Map<string, string>();
		const inTextFootnotes: string[] = [];
		
		let inCodeBlock = false;
		let codeBuffer = '';

		// First pass: extract footnote definitions and title
		for (const line of lines) {
			const trimmed = line.trim();
			if (trimmed.startsWith('# ') && title === 'Untitled Ebook') {
				title = trimmed.replace('# ', '').replace(/\*\*/g, '');
			}
			const fnDefMatch = trimmed.match(/^\[\^(\d+)\]:\s+(.+)$/);
			if (fnDefMatch) {
				footnoteMap.set(fnDefMatch[1], fnDefMatch[2]);
			}
		}

		// Second pass: build sections
		for (const line of lines) {
			const trimmed = line.trim();
			
			// Code blocks
			if (trimmed.startsWith('```')) {
				if (inCodeBlock) {
					sections.push({ type: 'code', text: codeBuffer.trim() });
					codeBuffer = '';
					inCodeBlock = false;
				} else {
					inCodeBlock = true;
				}
				continue;
			}
			if (inCodeBlock) {
				codeBuffer += line + '\n';
				continue;
			}

			if (!trimmed || trimmed.startsWith('[^')) continue; // Skip empty and footnote defs
			if (trimmed.startsWith('COVER_IMAGE_PROMPT:')) continue; // Skip cover image prompt if it snuck through

			if (trimmed.startsWith('### ')) {
				sections.push({ type: 'h3', text: trimmed.replace('### ', '') });
			} else if (trimmed.startsWith('## ')) {
				sections.push({ type: 'h2', text: trimmed.replace('## ', '') });
			} else if (trimmed.startsWith('# ')) {
				continue; // Title handled
			} else if (trimmed.startsWith('> ')) {
				sections.push({ type: 'quote', text: trimmed.replace('> ', '') });
			} else {
				// Paragraph with footnote detection
				let text = trimmed;
				let footnoteIdx: number | undefined = undefined;
				const fnMatch = text.match(/\[\^(\d+)\]/);
				if (fnMatch) {
					const fnId = fnMatch[1];
					const fnContent = footnoteMap.get(fnId);
					if (fnContent) {
						if (!inTextFootnotes.includes(fnContent)) {
							inTextFootnotes.push(fnContent);
						}
						footnoteIdx = inTextFootnotes.indexOf(fnContent);
						text = text.replace(/\[\^(\d+)\]/g, ''); // Clean the tag for rendering
					}
				}
				sections.push({ type: 'paragraph', text, footnoteIdx });
			}
		}

		return { title, sections, footnotes: inTextFootnotes };
	}

	async function handleGeneratePreview() {
		if (!topic) {
			error = 'Please enter a topic.';
			return;
		}

		isGenerating = true;
		error = '';
		showViewer = false;

		try {
			const response = await fetch('/api/generate-ebook', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ topic, audience, style, pages: pagesTarget })
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error || 'Generation failed');

			const parsed = parseSemanticContent(data.content);
			generatedTitle = parsed.title;
			bookPages = paginateContent(parsed.title, generatedAuthor, parsed.sections, parsed.footnotes, data.coverImageUrl);
			showViewer = true;
		} catch (err: any) {
			error = err.message;
		} finally {
			isGenerating = false;
		}
	}

	function handleGenerateEnhance() {
		return ({ result, update }: { result: any; update: () => void }) => {
			isGenerating = false;
			if (result.type === 'success' && result.data) {
				successMessage = result.data.message;
				
				// Store the server URL for the download function
				if (result.data.fileUrl) {
					(window as any)._lastGeneratedFileUrl = result.data.fileUrl;
				}

				// After saving, we can still show the viewer if content was returned
				if (result.data.content) {
					const parsed = parseSemanticContent(result.data.content);
					generatedTitle = parsed.title;
					bookPages = paginateContent(
						parsed.title, 
						generatedAuthor, 
						parsed.sections, 
						parsed.footnotes, 
						result.data.fileUrl ? result.data.coverImageUrl : undefined // Use the coverImageUrl if provided
					);
					showViewer = true;
				}
				error = '';
			} else if (result.type === 'failure') {
				error = result.data?.message || 'Generation failed.';
			}
			update();
		};
	}

	async function downloadPdf() {
		// If we already have a server-generated PDF, just download that for 100% fidelity
		const serverUrl = (window as any)._lastGeneratedFileUrl;
		if (serverUrl) {
			const link = document.createElement('a');
			link.href = serverUrl;
			link.download = `${generatedTitle.toLowerCase().replace(/\s+/g, '_')}_official_edition.pdf`;
			link.target = "_blank";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			return;
		}

		const { default: html2pdf } = await import('html2pdf.js');
		
		// Create a temporary container for 1:1 rendering
		// IMPORTANT: html2canvas needs the element to be in the DOM and NOT display:none
		const element = document.createElement('div');
		element.className = "pdf-export-container";
		element.style.position = 'absolute';
		element.style.left = '0';
		element.style.top = '0';
		element.style.zIndex = '-9999';
		element.style.width = '210mm'; // A4 Width
		document.body.appendChild(element);

		try {
			// Find all page containers
			const pagesElems = document.querySelectorAll('.page-container');
			
			if (pagesElems.length === 0) {
				error = "Could not find book pages to generate PDF. Please try again.";
				return;
			}

			// Clone each page and append to the export container
			pagesElems.forEach((p, i) => {
				const clone = p.cloneNode(true) as HTMLElement;
				// Reset any transformations or absolute positioning that page-flip might have added
				clone.style.position = 'relative';
				clone.style.left = '0';
				clone.style.top = '0';
				clone.style.transform = 'none';
				clone.style.display = 'block';
				clone.style.visibility = 'visible';
				clone.style.margin = '0';
				clone.style.boxShadow = 'none';
				element.appendChild(clone);
			});

			const opt = {
				margin: 0,
				filename: `${generatedTitle.toLowerCase().replace(/\s+/g, '_')}_preview.pdf`,
				image: { type: 'jpeg' as const, quality: 0.98 },
				html2canvas: { 
					scale: 2, 
					useCORS: true, 
					letterRendering: true,
					logging: false
				},
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
				pagebreak: { mode: ['css', 'legacy'] as any, after: '.page-container' }
			};

			await html2pdf().set(opt).from(element).save();
		} catch (err: any) {
			console.error("PDF Export Error:", err);
			error = "Failed to generate PDF: " + err.message;
		} finally {
			document.body.removeChild(element);
		}
	}

	function reset() {
		showViewer = false;
		bookPages = [];
		successMessage = '';
		error = '';
	}
</script>

<svelte:head>
	<title>Premium Ebook Generator | Atheum</title>
</svelte:head>

<div class="min-h-screen bg-[#fdfaf3] text-[#1a232e]">
	{#if !showViewer}
		<div class="max-w-4xl mx-auto pt-16 px-6 pb-24" transition:fade>
			<!-- Header -->
			<header class="text-center mb-16 space-y-4">
				<div class="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
					Premium Publishing Studio
				</div>
				<h1 class="text-5xl md:text-6xl font-serif font-bold tracking-tight text-[#1a232e]">
					Create an Official <span class="italic text-[#d4a853]">Hardcover</span>
				</h1>
				<p class="text-lg text-gray-600 max-w-xl mx-auto font-light">
					Professional typography, 3D interactive book preview, and high-fidelity PDF generation powered by advanced AI.
				</p>
			</header>

			<!-- Generator Box -->
			<div class="bg-white rounded-[2rem] shadow-2xl border border-[#e6e0d4] p-8 md:p-12 relative overflow-hidden group">
				<div class="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
				
				<div class="relative z-10 space-y-8">
					<div class="grid gap-6">
						<div class="space-y-2">
							<label for="topic" class="text-xs font-bold uppercase tracking-widest text-gray-400">Ebook Topic or Title</label>
							<input 
								id="topic"
								bind:value={topic}
								placeholder="e.g. The Architecture of Modern Civilizations"
								class="w-full text-2xl font-serif bg-transparent border-b-2 border-gray-100 focus:border-[#d4a853] outline-none py-4 transition-all placeholder:text-gray-200"
							/>
						</div>

						<div class="grid md:grid-cols-2 gap-8">
							<div class="space-y-2">
								<label for="target" class="text-xs font-bold uppercase tracking-widest text-gray-400">Target Audience</label>
								<input 
									id="target"
									bind:value={audience}
									placeholder="e.g. Academic Scholars"
									class="w-full bg-gray-50/50 rounded-xl px-4 py-3 border border-transparent focus:border-[#d4a853] focus:bg-white outline-none transition-all"
								/>
							</div>
							<div class="space-y-2">
								<label for="pages" class="text-xs font-bold uppercase tracking-widest text-gray-400">Target Page Count (Max 2500)</label>
								<input 
									id="pages"
									type="number"
									bind:value={pagesTarget}
									min="1" max="2500"
									class="w-full bg-gray-50/50 rounded-xl px-4 py-3 border border-transparent focus:border-[#d4a853] focus:bg-white outline-none transition-all"
								/>
							</div>
						</div>
					</div>

					{#if error}
						<div class="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3" transition:slide>
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
							{error}
						</div>
					{/if}

					<div class="flex flex-col sm:flex-row gap-4 pt-4">
						<button 
							onclick={handleGeneratePreview}
							disabled={isGenerating || !topic}
							class="flex-1 px-8 py-5 bg-[#1a232e] text-white rounded-2xl font-bold text-lg hover:bg-[#d4a853] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-amber-200/50"
						>
							{#if isGenerating}
								<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
								Curating Content...
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
								Generate Preview
							{/if}
						</button>

						<form 
							method="POST" 
							action="?/generateAndSave"
							use:enhance={handleGenerateEnhance}
							class="flex-1"
						>
							<input type="hidden" name="topic" value={topic} />
							<input type="hidden" name="audience" value={audience} />
							<input type="hidden" name="style" value={style} />
							<input type="hidden" name="pages" value={pagesTarget} />
							
							<button 
								type="submit"
								disabled={isGenerating || !topic}
								class="w-full px-8 py-5 bg-white text-[#1a232e] border-2 border-[#1a232e] rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
							>
								Generate & Save to Library
							</button>
						</form>
					</div>
				</div>
			</div>

			<!-- Features List -->
			<div class="mt-24 grid md:grid-cols-3 gap-12 text-center">
				<div class="space-y-4">
					<div class="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto text-[#d4a853]">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
					</div>
					<h3 class="font-serif font-bold text-xl">Official Layout</h3>
					<p class="text-sm text-gray-500 font-light">1:1 PDF fidelity with justified typography and proper hyphenation.</p>
				</div>
				<div class="space-y-4">
					<div class="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto text-[#d4a853]">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
					</div>
					<h3 class="font-serif font-bold text-xl">3D Interactive</h3>
					<p class="text-sm text-gray-500 font-light">Experience the book with realistic 3D curl animations and sound effects.</p>
				</div>
				<div class="space-y-4">
					<div class="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto text-[#d4a853]">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
					</div>
					<h3 class="font-serif font-bold text-xl">High-Fidelity PDF</h3>
					<p class="text-sm text-gray-500 font-light">Advanced headings, feature boxes for code, and academic footnotes.</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="w-full h-screen" transition:fade>
			<!-- Back Button -->
			<button 
				onclick={reset}
				class="fixed top-24 left-8 z-[200] flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-lg border border-gray-100 hover:bg-[#1a232e] hover:text-white transition-all group font-bold text-xs tracking-widest"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-x-1"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
				LEAVE STUDIO
			</button>

			<PremiumBookViewer 
				pages={bookPages}
				title={generatedTitle}
				author={generatedAuthor}
				onDownload={downloadPdf}
			/>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
