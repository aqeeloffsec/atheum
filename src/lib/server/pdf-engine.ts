/**
 * Server-Side PDF Generation Engine
 * 
 * Converts Mastra AI-generated Markdown into a premium, paginated PDF
 * with a full-bleed cover page and dynamic Table of Contents.
 * Uses pdfmake for streaming PDF generation, optimized for up to 2,500 pages.
 */

import { createRequire } from 'module';
import { dirname, join } from 'path';
import type { TDocumentDefinitions, Content, ContentTocItem } from 'pdfmake/interfaces';

// pdfmake is CJS — use createRequire to load it correctly under Vite SSR
const require = createRequire(import.meta.url);
const PdfPrinter = require('pdfmake/js/Printer').default;

// --- Font Setup ---
// Resolve font paths relative to pdfmake's package directory
const pdfmakeDir = dirname(require.resolve('pdfmake/package.json'));
const fonts = {
	Roboto: {
		normal: join(pdfmakeDir, 'fonts', 'Roboto', 'Roboto-Regular.ttf'),
		bold: join(pdfmakeDir, 'fonts', 'Roboto', 'Roboto-Medium.ttf'),
		italics: join(pdfmakeDir, 'fonts', 'Roboto', 'Roboto-Italic.ttf'),
		bolditalics: join(pdfmakeDir, 'fonts', 'Roboto', 'Roboto-MediumItalic.ttf')
	}
};

const printer = new PdfPrinter(fonts);

// --- Markdown Parser ---

interface ParsedSection {
	type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'list-item' | 'code';
	text: string;
}

/**
 * Simple but robust Markdown-to-sections parser.
 * Splits raw markdown into typed sections for pdfmake content generation.
 */
function parseMarkdown(markdown: string): ParsedSection[] {
	const lines = markdown.split('\n');
	const sections: ParsedSection[] = [];
	let inCodeBlock = false;
	let codeBuffer = '';

	for (const line of lines) {
		const trimmed = line.trimEnd();

		// Handle code blocks
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

		// Skip empty lines
		if (!trimmed) continue;

		// Headings
		if (trimmed.startsWith('### ')) {
			sections.push({ type: 'h3', text: trimmed.replace(/^###\s+/, '').replace(/\*\*/g, '') });
		} else if (trimmed.startsWith('## ')) {
			sections.push({ type: 'h2', text: trimmed.replace(/^##\s+/, '').replace(/\*\*/g, '') });
		} else if (trimmed.startsWith('# ')) {
			sections.push({ type: 'h1', text: trimmed.replace(/^#\s+/, '').replace(/\*\*/g, '') });
		}
		// List items
		else if (/^[\-\*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
			const text = trimmed.replace(/^[\-\*\d.]+\s+/, '');
			sections.push({ type: 'list-item', text: cleanInlineMarkdown(text) });
		}
		// Paragraphs
		else {
			sections.push({ type: 'paragraph', text: cleanInlineMarkdown(trimmed) });
		}
	}

	// Flush any remaining code block
	if (codeBuffer) {
		sections.push({ type: 'code', text: codeBuffer.trim() });
	}

	return sections;
}

/** Strip inline markdown (bold, italic, links, inline code) for plain text rendering */
function cleanInlineMarkdown(text: string): string {
	return text
		.replace(/\*\*\*(.*?)\*\*\*/g, '$1') // bold italic
		.replace(/\*\*(.*?)\*\*/g, '$1')       // bold
		.replace(/\*(.*?)\*/g, '$1')           // italic
		.replace(/`(.*?)`/g, '$1')             // inline code
		.replace(/\[(.*?)\]\(.*?\)/g, '$1');   // links
}

// --- PDF Document Builder ---

/**
 * Build the full pdfmake document definition from parsed markdown sections.
 * Includes a full-bleed cover page, dynamic TOC, and paginated chapters.
 */
function buildDocDefinition(
	title: string,
	author: string,
	sections: ParsedSection[],
	coverImageBase64?: string
): TDocumentDefinitions {
	const content: Content[] = [];

	// A4 standard width is 595.28 pt. With side margins of 50 each, content width is 495.28 pt.
	const contentWidth = 495;

	// ===== COVER PAGE =====
	const coverStack: any[] = [
		{ text: '', margin: [0, 60, 0, 0] as [number, number, number, number] }, // spacer
	];

	if (coverImageBase64) {
		coverStack.push({
			image: coverImageBase64,
			width: 350,
			alignment: 'center',
			margin: [0, 20, 0, 30] as [number, number, number, number]
		});
	} else {
		coverStack.push({ text: '', margin: [0, 80, 0, 0] as [number, number, number, number] });
	}

	coverStack.push(
		{
			canvas: [
				{
					type: 'rect',
					x: 0, y: 0,
					w: contentWidth, h: 4,
					color: '#D4A853' // gold accent line
				}
			]
		},
		{ text: title, style: 'coverTitle', margin: [0, 40, 0, 20] as [number, number, number, number] },
		{
			canvas: [
				{
					type: 'rect',
					x: 0, y: 0,
					w: contentWidth, h: 2,
					color: '#D4A853'
				}
			]
		},
		{ text: `By ${author}`, style: 'coverAuthor', margin: [0, 30, 0, 0] as [number, number, number, number] },
		{ text: 'AI-Generated Premium Ebook', style: 'coverSubtitle', margin: [0, 15, 0, 0] as [number, number, number, number] },
		{ text: `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, style: 'coverDate', margin: [0, 60, 0, 0] as [number, number, number, number] }
	);

	content.push({
		stack: coverStack,
		pageBreak: 'after' as const
	});

	// ===== TABLE OF CONTENTS =====
	content.push(
		{ text: 'Table of Contents', style: 'tocTitle', margin: [0, 40, 0, 30] as [number, number, number, number] },
		{
			toc: {
				title: { text: '', style: 'tocTitle' }
			}
		} as unknown as Content,
		{ text: '', pageBreak: 'after' as const }
	);

	// ===== BODY CONTENT =====
	let isFirstChapter = true;
	let currentChapterNumber = 0;
	let skippedDocumentTitle = false;

	for (const section of sections) {
		switch (section.type) {
			case 'h1':
				// The markdown prepends the Book Title as the first H1, which is already on the cover.
				if (!skippedDocumentTitle) {
					skippedDocumentTitle = true;
					continue; // skip rendering the book title in the body
				}

				// Each H1 = new chapter with page break (except the very first after TOC)
				if (!isFirstChapter) {
					content.push({ text: '', pageBreak: 'before' as const });
				}
				isFirstChapter = false;
				currentChapterNumber++;
				
				// Chapter Spacer
				content.push({ text: '', margin: [0, 40, 0, 0] as [number, number, number, number] });
				
				// Chapter Number Label Subtitle
				content.push({
					text: `CHAPTER ${currentChapterNumber}`,
					style: 'chapterLabel',
					margin: [0, 0, 0, 8] as [number, number, number, number]
				});

				content.push({
					text: section.text,
					style: 'chapterTitle',
					tocItem: true,
					tocMargin: [0, 6, 0, 6] as [number, number, number, number]
				} as ContentTocItem);
				
				// Gold underline for chapter
				content.push({
					canvas: [
						{
							type: 'rect',
							x: 0, y: 0,
							w: contentWidth, h: 3,
							color: '#D4A853'
						}
					],
					margin: [0, 8, 0, 30] as [number, number, number, number]
				});
				// First paragraph of chapter might need dropcap styling but pdfmake lacks native dropcaps
				// We'll just define the body text below.
				break;

			case 'h2':
				content.push({
					text: section.text,
					style: 'sectionTitle',
					tocItem: true,
					tocMargin: [20, 4, 0, 4] as [number, number, number, number]
				} as ContentTocItem);
				break;

			case 'h3':
				content.push({
					text: section.text,
					style: 'subsectionTitle',
					tocItem: true,
					tocMargin: [40, 2, 0, 2] as [number, number, number, number]
				} as ContentTocItem);
				break;

			case 'paragraph':
				content.push({
					text: section.text,
					style: 'body',
					margin: [0, 0, 0, 12] as [number, number, number, number]
				});
				break;

			case 'list-item':
				content.push({
					text: `  •   ${section.text}`,
					style: 'listItem',
					margin: [16, 0, 0, 6] as [number, number, number, number]
				});
				break;

			case 'code':
				content.push({
					text: section.text,
					style: 'codeBlock',
					margin: [0, 8, 0, 12] as [number, number, number, number],
					background: '#F8FAFC' // Lighter, modern slate
				} as Content);
				break;
		}
	}

	return {
		content,
		defaultStyle: {
			font: 'Roboto',
			fontSize: 11,
			lineHeight: 1.6
		},
		styles: {
			coverTitle: {
				fontSize: 42,
				bold: true,
				color: '#0F172A',
				alignment: 'center' as const,
				lineHeight: 1.2
			},
			coverAuthor: {
				fontSize: 18,
				color: '#475569',
				alignment: 'center' as const,
				italics: true
			},
			coverSubtitle: {
				fontSize: 14,
				color: '#64748B',
				alignment: 'center' as const,
				characterSpacing: 2
			},
			coverDate: {
				fontSize: 11,
				color: '#94A3B8',
				alignment: 'center' as const
			},
			tocTitle: {
				fontSize: 28,
				bold: true,
				color: '#0F172A'
			},
			chapterLabel: {
				fontSize: 12,
				bold: true,
				color: '#D4A853',
				characterSpacing: 3
			},
			chapterTitle: {
				fontSize: 32,
				bold: true,
				color: '#0F172A',
				lineHeight: 1.2
			},
			sectionTitle: {
				fontSize: 20,
				bold: true,
				color: '#1E293B',
				margin: [0, 24, 0, 10] as [number, number, number, number]
			},
			subsectionTitle: {
				fontSize: 16,
				bold: true,
				color: '#334155',
				margin: [0, 16, 0, 8] as [number, number, number, number]
			},
			body: {
				fontSize: 11,
				color: '#334155',
				lineHeight: 1.7,
				alignment: 'justify' as const
			},
			listItem: {
				fontSize: 11,
				color: '#334155',
				lineHeight: 1.6,
				alignment: 'left' as const
			},
			codeBlock: {
				fontSize: 9.5,
				font: 'Roboto',
				color: '#0F172A',
				lineHeight: 1.4,
				preserveLeadingSpaces: true
			}
		},
		pageSize: 'A4' as const,
		// Standardized wider margins for 2026 aesthetics
		pageMargins: [50, 70, 50, 70] as [number, number, number, number],
		footer: function (currentPage: number, pageCount: number) {
			if (currentPage <= 2) return null; // No footer on cover or TOC
			
			// Alternating footer layout for odd/even pages (facing pages)
			const isEven = currentPage % 2 === 0;
			return {
				columns: [
					{ 
						text: isEven ? `${currentPage}` : title, 
						alignment: 'left' as const, 
						fontSize: 9, 
						color: '#94A3B8', 
						margin: [50, 10, 0, 0] as [number, number, number, number]
					},
					{ 
						text: isEven ? title : `${currentPage}`, 
						alignment: 'right' as const, 
						fontSize: 9, 
						color: '#94A3B8', 
						margin: [0, 10, 50, 0] as [number, number, number, number] 
					}
				],
				margin: [0, 0, 0, 0] as [number, number, number, number]
			};
		},
		header: function (currentPage: number) {
			if (currentPage <= 2) return null; // No header on cover or TOC
			
			// Alternating header line to match
			const isEven = currentPage % 2 === 0;
			return {
				columns: [
					{ 
						text: isEven ? author : title, 
						alignment: isEven ? ('left' as const) : ('right' as const), 
						fontSize: 9, 
						color: '#64748B', 
						italics: true,
						margin: [50, 40, 50, 0] as [number, number, number, number]
					}
				]
			};
		}
	};
}

// --- Public API ---

/**
 * Extract the book title from the first H1 in the markdown.
 */
export function extractTitle(markdown: string): string {
	const match = markdown.match(/^#\s+(.+)$/m);
	return match ? match[1].replace(/\*\*/g, '').trim() : 'Untitled Ebook';
}

/**
 * Generate a PDF buffer from markdown content.
 * This is the main entry point for the PDF engine.
 * 
 * @param markdown - Raw markdown from Mastra AI
 * @param authorName - The author/creator name for the cover
 * @param coverImageUrl - Optional URL for the cover image
 * @returns Promise<Buffer> - The complete PDF as a Buffer, ready for upload
 */
export async function generatePdfBuffer(
	markdown: string,
	authorName: string = 'AI Author',
	coverImageUrl?: string
): Promise<Buffer> {
	const title = extractTitle(markdown);
	const sections = parseMarkdown(markdown);

	let coverImageBase64: string | undefined = undefined;
	if (coverImageUrl) {
		try {
			const response = await fetch(coverImageUrl);
			const arrayBuffer = await response.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const mimeType = response.headers.get('content-type') || 'image/jpeg';
			coverImageBase64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
		} catch (error) {
			console.error('[PDF Engine] Failed to fetch cover image:', error);
		}
	}

	const docDefinition = buildDocDefinition(title, authorName, sections, coverImageBase64);

	// pdfmake v0.3.5: createPdfKitDocument is async and returns a Promise<ReadableStream>
	const pdfDoc = await printer.createPdfKitDocument(docDefinition);

	return new Promise((resolve, reject) => {
		const chunks: Uint8Array[] = [];
		pdfDoc.on('data', (chunk: Uint8Array) => {
			chunks.push(chunk);
		});
		pdfDoc.on('end', () => {
			resolve(Buffer.concat(chunks));
		});
		pdfDoc.on('error', (err: Error) => {
			reject(err);
		});
		pdfDoc.end();
	});
}
