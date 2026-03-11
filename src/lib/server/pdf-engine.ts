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
		coverStack.push({ text: '', margin: [0, 60, 0, 0] as [number, number, number, number] });
	}

	coverStack.push(
		{
			canvas: [
				{
					type: 'rect',
					x: 0, y: 0,
					w: 515, h: 4,
					color: '#D4A853' // gold accent line
				}
			]
		},
		{ text: title, style: 'coverTitle', margin: [0, 30, 0, 10] as [number, number, number, number] },
		{
			canvas: [
				{
					type: 'rect',
					x: 0, y: 0,
					w: 515, h: 2,
					color: '#D4A853'
				}
			]
		},
		{ text: `By ${author}`, style: 'coverAuthor', margin: [0, 20, 0, 0] as [number, number, number, number] },
		{ text: 'AI-Generated Premium Ebook', style: 'coverSubtitle', margin: [0, 10, 0, 0] as [number, number, number, number] },
		{ text: `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, style: 'coverDate', margin: [0, 40, 0, 0] as [number, number, number, number] }
	);

	content.push({
		stack: coverStack,
		pageBreak: 'after' as const
	});

	// ===== TABLE OF CONTENTS =====
	content.push(
		{ text: 'Table of Contents', style: 'tocTitle', margin: [0, 20, 0, 20] as [number, number, number, number] },
		{
			toc: {
				title: { text: '', style: 'tocTitle' }
			}
		} as unknown as Content,
		{ text: '', pageBreak: 'after' as const }
	);

	// ===== BODY CONTENT =====
	let isFirstChapter = true;
	for (const section of sections) {
		switch (section.type) {
			case 'h1':
				// Each H1 = new chapter with page break (except the very first after TOC)
				if (!isFirstChapter) {
					content.push({ text: '', pageBreak: 'before' as const });
				}
				isFirstChapter = false;
				content.push({
					text: section.text,
					style: 'chapterTitle',
					tocItem: true,
					tocMargin: [0, 4, 0, 4] as [number, number, number, number]
				} as ContentTocItem);
				// Gold underline for chapter
				content.push({
					canvas: [
						{
							type: 'rect',
							x: 0, y: 0,
							w: 515, h: 3,
							color: '#D4A853'
						}
					],
					margin: [0, 4, 0, 16] as [number, number, number, number]
				});
				break;

			case 'h2':
				content.push({
					text: section.text,
					style: 'sectionTitle',
					tocItem: true,
					tocMargin: [20, 2, 0, 2] as [number, number, number, number]
				} as ContentTocItem);
				break;

			case 'h3':
				content.push({
					text: section.text,
					style: 'subsectionTitle',
					tocItem: true,
					tocMargin: [40, 1, 0, 1] as [number, number, number, number]
				} as ContentTocItem);
				break;

			case 'paragraph':
				content.push({
					text: section.text,
					style: 'body',
					margin: [0, 0, 0, 8] as [number, number, number, number]
				});
				break;

			case 'list-item':
				content.push({
					text: `  •  ${section.text}`,
					style: 'listItem',
					margin: [12, 0, 0, 4] as [number, number, number, number]
				});
				break;

			case 'code':
				content.push({
					text: section.text,
					style: 'codeBlock',
					margin: [0, 4, 0, 8] as [number, number, number, number],
					background: '#F3F4F6'
				} as Content);
				break;
		}
	}

	return {
		content,
		defaultStyle: {
			font: 'Roboto',
			fontSize: 11,
			lineHeight: 1.5
		},
		styles: {
			coverTitle: {
				fontSize: 36,
				bold: true,
				color: '#1A232E',
				alignment: 'center' as const
			},
			coverAuthor: {
				fontSize: 16,
				color: '#555555',
				alignment: 'center' as const,
				italics: true
			},
			coverSubtitle: {
				fontSize: 12,
				color: '#888888',
				alignment: 'center' as const
			},
			coverDate: {
				fontSize: 10,
				color: '#AAAAAA',
				alignment: 'center' as const
			},
			tocTitle: {
				fontSize: 24,
				bold: true,
				color: '#1A232E'
			},
			chapterTitle: {
				fontSize: 26,
				bold: true,
				color: '#1A232E',
				margin: [0, 8, 0, 4] as [number, number, number, number]
			},
			sectionTitle: {
				fontSize: 18,
				bold: true,
				color: '#2D3B4B',
				margin: [0, 16, 0, 8] as [number, number, number, number]
			},
			subsectionTitle: {
				fontSize: 14,
				bold: true,
				color: '#444444',
				margin: [0, 12, 0, 6] as [number, number, number, number]
			},
			body: {
				fontSize: 11,
				color: '#333333',
				lineHeight: 1.6
			},
			listItem: {
				fontSize: 11,
				color: '#333333',
				lineHeight: 1.5
			},
			codeBlock: {
				fontSize: 9,
				font: 'Roboto',
				color: '#1A232E',
				lineHeight: 1.3,
				preserveLeadingSpaces: true
			}
		},
		pageSize: 'A4' as const,
		pageMargins: [40, 60, 40, 60] as [number, number, number, number],
		footer: function (currentPage: number, pageCount: number) {
			// Skip page number on cover (page 1)
			if (currentPage === 1) return { text: '' };
			return {
				columns: [
					{ text: title, alignment: 'left' as const, fontSize: 8, color: '#AAAAAA', margin: [40, 0, 0, 0] as [number, number, number, number] },
					{ text: `Page ${currentPage} of ${pageCount}`, alignment: 'right' as const, fontSize: 8, color: '#AAAAAA', margin: [0, 0, 40, 0] as [number, number, number, number] }
				],
				margin: [0, 20, 0, 0] as [number, number, number, number]
			};
		},
		header: function (currentPage: number) {
			if (currentPage <= 2) return { text: '' };
			return {
				canvas: [
					{
						type: 'line' as const,
						x1: 40, y1: 50,
						x2: 555, y2: 50,
						lineWidth: 0.5,
						lineColor: '#E5E7EB'
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
