import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generatePdfBuffer, extractTitle } from '$lib/server/pdf-engine';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const { session, user, supabase } = locals;

        if (!session || !user) {
            throw error(401, 'Unauthorized');
        }

        // Use formData for compatibility with large payloads
        const formData = await request.formData();
        const topic = formData.get('topic') as string;
        const content = formData.get('content') as string;
        const title = formData.get('title') as string || `The Complete Guide to ${topic}`;

        if (!content) {
            throw error(400, 'Ebook content is required');
        }

        // Generate PDF from the markdown content
        const pdfBuffer = await generatePdfBuffer(content, 'AI Author');

        // Extract title from content for filename
        const extractedTitle = extractTitle(content) || topic || 'ebook';
        const sanitizedTitle = extractedTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        // Generate unique file path
        const fileName = `${user.id}/${Date.now()}-${sanitizedTitle}_ebook.pdf`;

        // Upload PDF to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('book-pdfs')
            .upload(fileName, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (uploadError) {
            console.error('Storage upload error:', uploadError);
            throw error(500, 'Failed to upload PDF to storage');
        }

        // Insert book metadata into database
        const { data: bookData, error: dbError } = await supabase
            .from('books')
            .insert({
                user_id: user.id,
                title: title,
                author: 'AI Author',
                genre: 'AI Generated',
                status: 'completed',
                cover_image_url: '', // Could be enhanced to generate/store cover image
                synopsis: `An AI-generated ebook about ${topic}`,
                file_url: uploadData.path
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database insert error:', dbError);
            throw error(500, 'Failed to save ebook metadata');
        }

        return new Response(JSON.stringify({
            success: true,
            book: bookData
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err: any) {
        console.error('Error saving ebook:', err);
        throw error(err.status || 500, err.message || 'Failed to save ebook');
    }
};