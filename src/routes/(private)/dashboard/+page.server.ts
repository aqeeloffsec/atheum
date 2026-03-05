import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
    if (!session) {
        return { books: [] };
    }

    const { data: books, error: fetchError } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

    if (fetchError) {
        console.error('Error fetching books:', fetchError);
        return { books: [] };
    }

    return {
        books: books ?? []
    };
};

export const actions: Actions = {
    addBook: async ({ request, locals: { supabase, session } }) => {
        if (!session) {
            return fail(401, { message: 'Unauthorized' });
        }

        const formData = await request.formData();
        
        const title = formData.get('title') as string;
        const author = formData.get('author') as string;
        const genre = formData.get('genre') as string;
        const status = formData.get('status') as string;
        const cover_image_url = formData.get('cover_image_url') as string;
        const synopsis = formData.get('synopsis') as string;
        
        // Handle the PDF file
        const bookFile = formData.get('book_pdf') as File;
        let file_url = null;

        if (!title || !author) {
            return fail(400, { message: 'Title and Author are required' });
        }

        // 1. Upload PDF to Storage if it exists
        if (bookFile && bookFile.size > 0) {
            // Generate a unique file path (user_id/timestamp-filename)
            const fileName = `${session.user.id}/${Date.now()}-${bookFile.name}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('book-pdfs')
                .upload(fileName, bookFile);

            if (uploadError) {
                console.error('Storage upload error:', uploadError);
                return fail(500, { message: 'Failed to upload PDF.' });
            }
            
            file_url = uploadData.path;
        }

        // 2. Insert into Database
        const { error } = await supabase.from('books').insert({
            user_id: session.user.id,
            title,
            author,
            genre,
            status,
            cover_image_url,
            synopsis,
            file_url // Our new column
        });

        if (error) {
            console.error('Error adding book:', error);
            // Optional: If DB fails, you might want to delete the uploaded file to keep it clean
            return fail(500, { message: 'Failed to add book metadata.' });
        }

        return { success: true };
    }
};