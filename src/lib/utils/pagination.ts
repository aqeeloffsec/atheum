/**
 * Pagination Engine for Premium Hardcover Ebooks.
 * Splits semantic sections into strictly sized pages based on height estimations.
 */

export interface SemanticSection {
	type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'quote' | 'code';
	text: string;
	footnoteIdx?: number;
}

export interface BookPage {
	pageNum: number;
	sections: SemanticSection[];
	footnotes: string[];
	isCover?: boolean;
	coverImageUrl?: string;
}

// Approximate height of elements in pixels (assuming 96 DPI A4 container)
const ELEMENT_HEIGHTS = {
	h1: 150,
	h2: 80,
	h3: 60,
	paragraph: (text: string) => Math.ceil(text.length / 85) * 28 + 12, // Approx 85 chars per line
	quote: (text: string) => Math.ceil(text.length / 70) * 35 + 80,
	code: (text: string) => (text.split('\n').length * 18) + 60
};

const MAX_PAGE_HEIGHT = 800; // Leaving room for header/footer in the 297mm (1122px) container

/**
 * Distributes a flat list of semantic sections into paginated structures.
 */
export function paginateContent(
	title: string,
	author: string,
	sections: SemanticSection[],
	rawFootnotes: string[] = [],
	coverImageUrl?: string
): BookPage[] {
	const pages: BookPage[] = [];

	// Page 0: Cover
	pages.push({
		pageNum: 1,
		sections: [],
		footnotes: [],
		isCover: true,
		coverImageUrl
	});

	let currentPageNum = 2;
	let currentHeight = 0;
	let currentPageSections: SemanticSection[] = [];
	let currentPageFootnotes: string[] = [];
	let currentFootnoteSet = new Set<number>();

	for (const section of sections) {
		let height = 0;
		if (typeof ELEMENT_HEIGHTS[section.type] === 'function') {
			height = (ELEMENT_HEIGHTS[section.type] as (t: string) => number)(section.text);
		} else {
			height = ELEMENT_HEIGHTS[section.type] as number;
		}

		// If section itself is too large for one page (paragraphs), we should ideally split it.
		// For now, we'll just push to new page if current height + section height > limit.
		// NEW: Also force a new page if we encounter an H1 (chapter start)
		const isH1 = section.type === 'h1';
		const forceNewPage = isH1 && currentPageSections.length > 0;

		if ((currentHeight + height > MAX_PAGE_HEIGHT || forceNewPage) && currentPageSections.length > 0) {
			pages.push({
				pageNum: currentPageNum++,
				sections: currentPageSections,
				footnotes: currentPageFootnotes
			});
			currentPageSections = [];
			currentPageFootnotes = [];
			currentFootnoteSet.clear();
			currentHeight = 0;
		}

		currentPageSections.push(section);
		currentHeight += height;

		// Handle footnotes associated with paragraphs
		if (section.footnoteIdx !== undefined && !currentFootnoteSet.has(section.footnoteIdx)) {
			if (rawFootnotes[section.footnoteIdx]) {
				currentPageFootnotes.push(rawFootnotes[section.footnoteIdx]);
				currentFootnoteSet.add(section.footnoteIdx);
				currentHeight += 30; // Height estimate for footnote entry
			}
		}
	}

	// Flush last page
	if (currentPageSections.length > 0) {
		pages.push({
			pageNum: currentPageNum,
			sections: currentPageSections,
			footnotes: currentPageFootnotes
		});
	}

	return pages;
}
