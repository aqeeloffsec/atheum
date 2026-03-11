<script lang="ts">
	interface Props {
		pageNum: number;
		totalPages: number;
		isCover?: boolean;
		title?: string;
		author?: string;
		coverImageUrl?: string;
		sections?: any[]; // Semantic sections (Heading, Paragraph, Quote, Code, etc.)
		footnotes?: string[];
	}

	let { 
		pageNum, 
		totalPages, 
		isCover = false, 
		title = "", 
		author = "", 
		coverImageUrl = "",
		sections = [],
		footnotes = []
	}: Props = $props();
</script>

<div class="page-container {isCover ? 'cover-page' : 'content-page'}">
	{#if isCover}
		<div class="cover-content">
			<div class="gold-border-top"></div>
			
			{#if coverImageUrl}
				<div class="cover-image-container">
					<img src={coverImageUrl} alt="Cover for {title}" class="cover-image" />
				</div>
			{/if}

			<h1 class="book-title">{title}</h1>
			<div class="gold-divider"></div>
			<p class="book-author">By {author}</p>
			<div class="cover-footer">
				<p>OFFICIAL FIRST EDITION</p>
			</div>
			<div class="gold-border-bottom"></div>
		</div>
	{:else}
		<div class="page-header">
			<span class="left-header">{title}</span>
			<span class="right-header">Chapter {Math.ceil(pageNum / 10)}</span>
		</div>

		<div class="page-body">
			{#each sections as section}
				{#if section.type === 'h1'}
					<h1 class="premium-h1">{section.text}</h1>
				{:else}
					{#if section.type === 'h2'}
						<h2 class="premium-h2">{section.text}</h2>
					{:else if section.type === 'h3'}
						<h3 class="premium-h3">{section.text}</h3>
					{:else if section.type === 'paragraph'}
						<p class="book-p">
							{section.text}
							{#if section.footnoteIdx !== undefined}
								<sup class="footnote-ref">{section.footnoteIdx + 1}</sup>
							{/if}
						</p>
					{:else if section.type === 'quote'}
						<div class="premium-quote">
							<span class="quote-marker">“</span>
							<p>{section.text}</p>
							<span class="quote-marker-bottom">”</span>
						</div>
					{:else if section.type === 'code'}
						<div class="code-feature-box">
							<div class="parchment-texture"></div>
							<div class="code-header">CODE INSIGHT</div>
							<pre><code>{section.text}</code></pre>
						</div>
					{/if}
				{/if}
			{/each}
		</div>

		{#if footnotes && footnotes.length > 0}
			<div class="footnotes-area">
				{#each footnotes as note, i}
					<div class="footnote">
						<span class="note-num">{i + 1}</span>
						<span class="note-text">{note}</span>
					</div>
				{/each}
			</div>
		{/if}

		<div class="page-footer">
			<span class="page-number">Page {pageNum} of {totalPages}</span>
		</div>
	{/if}
</div>

<style>
	:global(:root) {
		--gold: #d4a853;
		--deep-charcoal: #1a232e;
		--parchment: #fdfaf3;
		--off-white: #fefefe;
	}

	.page-container {
		width: 210mm;
		height: 297mm;
		padding: 2.5cm 2cm;
		background: var(--off-white);
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: column;
		color: var(--deep-charcoal);
		box-shadow: 0 0 10px rgba(0,0,0,0.1);
		overflow: hidden;
	}

	/* Cover Page Styles */
	.cover-page {
		background: var(--deep-charcoal);
		color: var(--gold);
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.cover-content {
		border: 2px solid var(--gold);
		width: 90%;
		height: 90%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 2rem;
		position: relative;
	}

	.cover-image-container {
		width: 100%;
		max-height: 400px;
		overflow: hidden;
		margin-bottom: 2rem;
		border: 1px solid var(--gold);
		box-shadow: 0 10px 30px rgba(0,0,0,0.5);
	}

	.cover-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.book-title {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.8rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.15rem;
		margin-bottom: 1.5rem;
		line-height: 1.1;
	}

	.gold-divider {
		height: 3px;
		background: var(--gold);
		width: 100px;
		margin: 0 auto 2rem;
	}

	.book-author {
		font-family: 'Libre Baskerville', serif;
		font-size: 1.8rem;
		font-style: italic;
	}

	/* Content Page Styles */
	.page-header {
		display: flex;
		justify-content: space-between;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		color: #888;
		border-bottom: 0.5px solid #eee;
		padding-bottom: 0.5rem;
		margin-bottom: 2rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.page-body {
		flex: 1;
		hyphens: auto;
	}

	.premium-h1 {
		font-family: 'Montserrat', sans-serif;
		font-size: 2.5rem;
		font-weight: 900;
		color: var(--deep-charcoal);
		border-bottom: 4px solid var(--gold);
		margin-bottom: 2rem;
		letter-spacing: -1px;
	}

	.premium-h2 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		margin: 1.5rem 0 1rem;
		color: #2d3b4b;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.premium-h3 {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
		margin: 1rem 0 0.5rem;
		color: var(--gold);
	}

	.book-p {
		font-family: 'Libre Baskerville', serif;
		font-size: 1.05rem;
		line-height: 1.7;
		text-align: justify;
		margin-bottom: 1.2rem;
		orphans: 3;
		widows: 3;
	}

	/* First paragraph indent except after headings */
	.book-p + .book-p {
		text-indent: 1.5rem;
		margin-top: -1.2rem;
	}

	.footnote-ref {
		font-size: 0.6rem;
		color: var(--gold);
		font-weight: bold;
		cursor: help;
	}

	.premium-quote {
		margin: 2.5rem auto;
		text-align: center;
		position: relative;
		padding: 1.5rem 3rem;
		font-family: 'Libre Baskerville', serif;
		font-style: italic;
		font-size: 1.3rem;
		line-height: 1.5;
		color: #444;
		max-width: 85%;
	}

	.quote-marker {
		position: absolute;
		top: -1rem;
		left: 0;
		font-size: 5rem;
		color: var(--gold);
		opacity: 0.3;
		font-family: Georgia, serif;
	}

	.quote-marker-bottom {
		position: absolute;
		bottom: -3.5rem;
		right: 0;
		font-size: 5rem;
		color: var(--gold);
		opacity: 0.3;
		font-family: Georgia, serif;
	}

	.code-feature-box {
		background: var(--parchment);
		border: 1px solid #e0d9c5;
		padding: 1.5rem;
		margin: 2rem 0;
		position: relative;
		border-radius: 4px;
		box-shadow: inset 0 0 15px rgba(0,0,0,0.02);
	}

	.code-header {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 800;
		margin-bottom: 0.8rem;
		color: #9c8441;
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	pre {
		margin: 0;
		white-space: pre-wrap;
		font-family: 'Fira Code', 'Courier New', monospace;
		font-size: 0.85rem;
		color: #333;
	}

	.footnotes-area {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 0.5px solid #ccc;
		font-family: 'Libre Baskerville', serif;
		font-size: 0.75rem;
		font-style: italic;
		color: #666;
	}

	.footnote {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.3rem;
	}

	.note-num {
		color: var(--gold);
		font-weight: bold;
	}

	.page-footer {
		margin-top: 1.5rem;
		text-align: center;
		font-family: 'Libre Baskerville', serif;
		font-size: 0.8rem;
		font-style: italic;
		color: #aaa;
	}
</style>
