<script lang="ts">
	import { tick } from 'svelte';
	import type { PageFlip, PageFlipEvent } from 'page-flip';
	import PremiumPage from './PremiumPage.svelte';
	import { fade } from 'svelte/transition';
	import type { BookPage } from '$lib/utils/pagination';

	interface Props {
		pages: BookPage[];
		title: string;
		author: string;
		onDownload: () => void;
	}

	let { pages, title, author, onDownload }: Props = $props();

	let bookContainer = $state<HTMLElement | null>(null);
	let flipBook = $state<PageFlip | null>(null);
	let currentPage = $state(1);
	let isDarkMode = $state(false);
	let zoomLevel = $state(1);
	let PageFlipClass: any;

	// Sound effect (optional, using a public URL for a paper flip sound)
	const pageTurnSound = typeof Audio !== 'undefined' ? new Audio('https://www.soundjay.com/misc/paper-flip-1.mp3') : null;

	function playPageTurnSound() {
		if (pageTurnSound) {
			pageTurnSound.currentTime = 0;
			pageTurnSound.play().catch(() => {}); // Ignore interaction errors
		}
	}

	async function initFlipBook() {
		if (!bookContainer || !PageFlipClass || pages.length === 0) return;

		// Cleanup existing instance
		if (flipBook) {
			flipBook.destroy();
			flipBook = null;
		}

		await tick();

		const instance = new PageFlipClass(bookContainer, {
			width: 794, // A4 ratio (approx 210mm) at 96 DPI
			height: 1123, // A4 ratio (approx 297mm) at 96 DPI
			size: "stretch",
			minWidth: 315,
			maxWidth: 1000,
			minHeight: 445,
			maxHeight: 1414,
			maxShadowOpacity: 0.5,
			showCover: true,
			mobileScrollSupport: false,
			usePortrait: false, // Default to spread (landscape)
			startPage: 0
		});

		const pageElements = bookContainer.querySelectorAll(".page-wrapper-outer");
		if (pageElements.length > 0) {
			instance.loadFromHTML(Array.from(pageElements) as HTMLElement[]);
		}

		instance.on('flip', (e: PageFlipEvent) => {
			currentPage = (e.data as number) + 1;
			playPageTurnSound();
		});

		flipBook = instance;
	}

	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			import('page-flip').then(module => {
				PageFlipClass = module.PageFlip;
				initFlipBook();
			});
		}
		
		return () => {
			if (flipBook) flipBook.destroy();
		};
	});

	// Re-init if pages change
	$effect(() => {
		if (pages && PageFlipClass) {
			initFlipBook();
		}
	});

</script>

<div class="viewer-container {isDarkMode ? 'dark-mode' : 'light-mode'}">
	<!-- Top Control Bar -->
	<header class="control-bar">
		<div class="left-controls">
			<h2 class="book-info">
				<span class="title-tag">READING:</span> {title}
			</h2>
		</div>

		<div class="center-controls">
			<div class="zoom-box">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
				<input type="range" min="0.5" max="1.5" step="0.1" bind:value={zoomLevel} class="zoom-slider" />
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
			</div>
		</div>

		<div class="right-controls">
			<button class="mode-toggle" onclick={toggleDarkMode} title="Toggle Dark/Light Library Mode">
				{#if isDarkMode}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
				{/if}
			</button>

			<button class="download-btn premium-glow" onclick={onDownload}>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
				Download Official PDF
			</button>
		</div>
	</header>

	<!-- Main Book Stage -->
	<main class="book-stage" style="transform: scale({zoomLevel});">
		<div class="book-shadow-glow"></div>
		
		<div bind:this={bookContainer} class="flip-book">
			{#each pages as page}
				<div class="page-wrapper-outer" data-density={page.isCover ? "hard" : "soft"}>
					<PremiumPage 
						pageNum={page.pageNum}
						totalPages={pages.length}
						isCover={page.isCover}
						coverImageUrl={page.coverImageUrl}
						title={title}
						author={author}
						sections={page.sections}
						footnotes={page.footnotes}
					/>
				</div>
			{/each}
		</div>
	</main>

	<!-- Navigation Bar -->
	<footer class="navigation-bar">
		<button class="nav-arrow" onclick={() => flipBook?.flipPrev()} disabled={currentPage <= 1}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
			PREVIOUS
		</button>

		<div class="page-indicator">
			<span class="current">{currentPage}</span>
			<span class="separator">/</span>
			<span class="total">{pages.length}</span>
		</div>

		<button class="nav-arrow" onclick={() => flipBook?.flipNext()} disabled={currentPage >= pages.length}>
			NEXT
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
		</button>
	</footer>
</div>

<style>
	.viewer-container {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #f8f9fa;
		transition: background 0.5s ease;
		overflow: hidden;
		position: relative;
	}

	.viewer-container.dark-mode {
		background: #121212;
		--deep-charcoal: #0a0e14;
	}

	.control-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(0,0,0,0.05);
		z-index: 100;
	}

	.dark-mode .control-bar {
		background: rgba(30, 30, 30, 0.8);
		border-bottom: 1px solid rgba(255,255,255,0.05);
		color: #eee;
	}

	.book-info {
		font-family: 'Montserrat', sans-serif;
		font-weight: 700;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.title-tag {
		color: #d4a853;
		font-size: 0.7rem;
		letter-spacing: 1px;
	}

	.center-controls {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.zoom-box {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: rgba(0,0,0,0.05);
		padding: 0.5rem 1rem;
		border-radius: 20px;
	}

	.zoom-slider {
		width: 150px;
		accent-color: #d4a853;
	}

	.right-controls {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.mode-toggle {
		background: none;
		border: none;
		cursor: pointer;
		color: inherit;
		opacity: 0.6;
		transition: opacity 0.3s;
	}

	.mode-toggle:hover {
		opacity: 1;
	}

	.download-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: #1a232e;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 12px;
		font-family: 'Montserrat', sans-serif;
		font-weight: 700;
		font-size: 0.85rem;
		border: none;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.premium-glow {
		box-shadow: 0 4px 15px rgba(212, 168, 83, 0.3);
	}

	.download-btn:hover {
		background: #d4a853;
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(212, 168, 83, 0.5);
	}

	.book-stage {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 10;
	}

	.book-shadow-glow {
		position: absolute;
		width: 800px;
		height: 400px;
		background: radial-gradient(circle, rgba(212,168,83,0.1) 0%, rgba(212,168,83,0) 70%);
		filter: blur(50px);
		pointer-events: none;
	}

	.navigation-bar {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 4rem;
		padding: 2rem;
		z-index: 100;
	}

	.nav-arrow {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: none;
		border: none;
		font-family: 'Montserrat', sans-serif;
		font-weight: 800;
		font-size: 0.8rem;
		letter-spacing: 2px;
		cursor: pointer;
		opacity: 0.5;
		transition: all 0.3s;
		color: inherit;
	}

	.nav-arrow:hover:not(:disabled) {
		opacity: 1;
		color: #d4a853;
		transform: scale(1.05);
	}

	.nav-arrow:disabled {
		cursor: not-allowed;
		opacity: 0.1;
	}

	.page-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: 'Libre Baskerville', serif;
		font-style: italic;
		font-size: 1.1rem;
		color: #999;
	}

	.current {
		color: #d4a853;
		font-weight: 700;
		font-size: 1.5rem;
	}

	.separator {
		opacity: 0.3;
	}
</style>
