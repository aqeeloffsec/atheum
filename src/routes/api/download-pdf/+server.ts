import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generatePdfBuffer, extractTitle } from '$lib/server/pdf-engine';

/**
 * Robust PDF streaming endpoint.
 * Accepts markdown and returns a streamed PDF file.
 * This avoids the memory overhead of base64 encoding in Form Actions.
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		// Use formData for compatibility with large payloads
		const formData = await request.formData();
		const markdown = formData.get('markdown') as string;
		const author = (formData.get('author') as string) || 'AI Author';

		if (!markdown) {
			throw error(400, 'Markdown content is required');
		}

		console.log(`[API Download] Generating PDF for "${extractTitle(markdown).substring(0, 50)}..."`);
		
		const title = extractTitle(markdown);
		const pdfBuffer = await generatePdfBuffer(markdown, author);

		console.log(`[API Download] PDF generated successfully (${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB). Streaming to client...`);

		const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

		return new Response(new Uint8Array(pdfBuffer), {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="${sanitizedTitle}_ebook.pdf"`,
				'Content-Length': pdfBuffer.length.toString(),
				// Prevent browser from caching the PDF
				'Cache-Control': 'no-cache, no-store, must-revalidate'
			}
		});
	} catch (err: any) {
		console.error('[API Download] Error generating PDF:', err);
		throw error(500, err.message || 'Internal Server Error');
	}
};
