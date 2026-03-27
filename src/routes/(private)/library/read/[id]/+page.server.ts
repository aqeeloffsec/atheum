import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase, session, user } }) => {
    if (!session || !user) {
        throw redirect(303, '/login');
    }

    const { id } = params;

    const { data: book, error: fetchError } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError || !book) {
        console.error('Error fetching book:', fetchError);
        throw error(404, 'Book not found');
    }

    // Ensure the book belongs to the user
    if (book.user_id !== user.id) {
        throw error(403, 'Unauthorized');
    }

    return {
        book
    };
};
