import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ebookAgent } from '$lib/mastra/agent';
import { generatePdfBuffer, extractTitle } from '$lib/server/pdf-engine';

export const actions: Actions = {
	/**
	 * generateAndSave: SSR Form Action
	 * 1. Calls Mastra AI to generate the markdown ebook
	 * 2. Converts it into a server-side PDF with cover + TOC
	 * 3. Uploads the PDF to Supabase Storage
	 * 4. Inserts book metadata into the database
	 * 5. Returns the file URL for immediate download
	 */
	generateAndSave: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			return fail(401, { message: 'Unauthorized. Please log in.' });
		}

		const formData = await request.formData();
		const topic = formData.get('topic') as string;
		const audience = formData.get('audience') as string;
		const style = formData.get('style') as string;
		const pagesStr = formData.get('pages') as string;
		const pages = parseInt(pagesStr) || 5;

		if (!topic) {
			return fail(400, { message: 'Topic is required.' });
		}

		if (!env.GOOGLE_GENERATIVE_AI_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY === '') {
			return fail(500, { message: 'Google Generative AI API key is not configured on the server.' });
		}

		try {
			// === STEP 1: Generate Markdown via Mastra AI ===
			console.log(`[PDF Engine] Generating ebook for topic: "${topic}" (${pages} pages)...`);

			const prompt = `
				Topic: ${topic}
				Target Audience: ${audience || 'General public'}
				Tone/Style: ${style || 'Professional and informative'}
				Length target: Approximately ${pages} printed pages long (yield roughly 350-400 words per page, meaning you should aim for ~${pages * 375} words total).
				
				Please generate the complete, highly detailed ebook in Markdown format now. Take your time to expand on concepts to meet the length requirement. Start with a single # heading as the book title.
			`;

			const aiResponse = await ebookAgent.generate(prompt);
			let markdown = aiResponse.text;

			if (!markdown || markdown.trim().length === 0) {
				return fail(500, { message: 'AI generated empty content. Please try again.' });
			}

			// === STEP 1.5: Extract Cover Image Prompt and Fetch Image ===
			let coverImageUrl = '';
			const promptMatch = markdown.match(/COVER_IMAGE_PROMPT:\s*(.+)$/m);
			if (promptMatch) {
				const imagePrompt = promptMatch[1].trim();
				// Remove the prompt line from the final markdown to keep it clean
				markdown = markdown.replace(/COVER_IMAGE_PROMPT:\s*.+$/m, '').trim();
				
				// For now, we use Unsplash with keywords from the prompt
				// We'll use a reliable keyword extraction or just use the prompt as a search term
				const keywords = imagePrompt.split(' ').slice(0, 5).join(',').toLowerCase().replace(/[^a-z,]/g, '');
				coverImageUrl = `https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800&h=1200&keywords=${encodeURIComponent(keywords)}`;
				
				// Alternatively, use a search service if available. 
				// Since we want "Generated", if we truly wanted to generate, we'd call an API.
				// For this implementation, we'll try to use a more dynamic Unsplash source if possible.
				coverImageUrl = `https://loremflickr.com/800/1200/${keywords.replace(/,/g, '-')}`;
			}

			console.log(`[PDF Engine] AI generated ${markdown.length} characters of markdown.`);

			// === STEP 2: Generate PDF Buffer Server-Side ===
			console.log('[PDF Engine] Generating PDF with cover and TOC...');
			const title = extractTitle(markdown);
			const authorName = session.user.email?.split('@')[0] || 'AI Author';
			const pdfBuffer = await generatePdfBuffer(markdown, authorName, coverImageUrl);

			console.log(`[PDF Engine] PDF generated: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB`);

			// === STEP 3: Upload PDF to Supabase Storage ===
			const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
			const fileName = `${session.user.id}/${Date.now()}-${sanitizedTitle}.pdf`;

			const { data: uploadData, error: uploadError } = await supabase.storage
				.from('book-pdfs')
				.upload(fileName, pdfBuffer, {
					contentType: 'application/pdf',
					upsert: false
				});

			if (uploadError) {
				console.error('[PDF Engine] Storage upload error:', uploadError);
				return fail(500, { message: 'Failed to upload generated PDF to storage.' });
			}

			console.log(`[PDF Engine] PDF uploaded to: ${uploadData.path}`);

			// === STEP 4: Insert Book Metadata into Database ===
			const { error: dbError } = await supabase.from('books').insert({
				user_id: session.user.id,
				title: title,
				author: authorName,
				genre: 'AI-Generated',
				status: 'All Books',
				synopsis: `AI-generated ebook about "${topic}" targeting ${audience || 'general audience'}.`,
				file_url: uploadData.path,
				cover_image_url: coverImageUrl
			});

			if (dbError) {
				console.error('[PDF Engine] Database insert error:', dbError);
				// Cleanup: delete the uploaded file since DB failed
				await supabase.storage.from('book-pdfs').remove([uploadData.path]);
				return fail(500, { message: 'Failed to save book metadata.' });
			}

			console.log(`[PDF Engine] Book "${title}" saved to library successfully!`);

			// === STEP 5: Return Success with Download URL ===
			const { data: urlData } = supabase.storage
				.from('book-pdfs')
				.getPublicUrl(uploadData.path);

			return {
				success: true,
				title,
				content: markdown,
				fileUrl: urlData.publicUrl,
				filePath: uploadData.path,
				message: `"${title}" has been generated and saved to your library!`
			};
		} catch (error: any) {
			console.error('[PDF Engine] Critical error:', error);
			return fail(500, {
				message: error.message || 'An unexpected error occurred during ebook generation.'
			});
		}
	}
};
