import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { 
    PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY, 
    PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY, 
    PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY, 
    PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY 
} from '$env/static/public';

export const load: PageServerLoad = async ({ locals: { supabase, session, subscription, user }, url }) => {
    if (!session || !user) {
        return { books: [], subscription: null };
    }

    let currentSubscription = subscription;

    const checkoutSuccess = url.searchParams.get('checkout') === 'success';
    const paymentIntentId = url.searchParams.get('payment_intent');

    if (checkoutSuccess && paymentIntentId) {
        try {
            // Retrieve PaymentIntent to find the customer & latest invoice/subscription
            const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
            const paymentIntent = pi as any;
            
            // To find the subscription this payment intent belongs to, we would normally look at paymentIntent.invoice,
            // then find the subscription from that invoice. Let's do that:
            if (paymentIntent.invoice && paymentIntent.customer) {
                const inv = await stripe.invoices.retrieve(paymentIntent.invoice as string);
                const invoice = inv as any;
                if (invoice.subscription) {
                    const stripeSub = await stripe.subscriptions.retrieve(invoice.subscription as string);
                    const planId = stripeSub.items.data[0].price.id;
                    
                    // Optimistically update DB so the UI reflects the purchased plan instantly
                    const { data } = await supabase.from('subscriptions').upsert({
                        user_id: user.id,
                        stripe_customer_id: paymentIntent.customer as string,
                        stripe_subscription_id: stripeSub.id,
                        plan_id: planId,
                        status: stripeSub.status,
                        current_period_end: new Date((stripeSub as any).current_period_end * 1000).toISOString(),
                    }, { onConflict: 'stripe_customer_id' }).select().single();
                    
                    if (data) {
                        currentSubscription = data;
                    }
                }
            }
        } catch (err) {
            console.error('Failed to sync subscription on elements checkout success:', err);
        }
    }

    let queryBuilder = supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

    const { data: books, error: fetchError } = await queryBuilder;

    if (fetchError) {
        console.error('Error fetching books:', fetchError);
        return { books: [], subscription: currentSubscription };
    }

    return {
        books: books ?? [],
        subscription: currentSubscription
    };
};

export const actions: Actions = {
    addBook: async ({ request, locals: { supabase, session, subscription, user } }) => {
        if (!session || !user) {
            return fail(401, { message: 'Unauthorized' });
        }

        // 0. Enforce Subscription Limits
        const { count, error: countError } = await supabase
            .from('books')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (countError) {
            console.error('Error checking book count:', countError);
            return fail(500, { message: 'Failed to verify account limits.' });
        }

        const bookCount = count || 0;
        const planId = subscription?.plan_id;
        const subStatus = subscription?.status;

        const formData = await request.formData();
        const numPagesInput = formData.get('num_pages');
        const numPages = numPagesInput ? parseInt(numPagesInput as string) : 0;
        
        const title = formData.get('title') as string;

        let limit = 4; // Default Free Limit
        let pageLimit = 300; // Default Free Pages limit
        if (subStatus === 'active' || subStatus === 'trailing') {
            if (planId === PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY || planId === PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY) {
                limit = 20;
                pageLimit = 600;
            } else if (planId === PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY || planId === PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY) {
                limit = Infinity;
                pageLimit = Infinity;
            }
        }

        if (bookCount >= limit) {
            return fail(403, { 
                message: `Upgrade required! Your current plan is limited to ${limit} books. You currently have ${bookCount}.` 
            });
        }

        if (numPages > pageLimit) {
            return fail(403, { 
                message: `Upgrade required! Your current plan is limited to books with maximum ${pageLimit} pages. This book has ${numPages} pages.` 
            });
        }
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
            const fileName = `${user.id}/${Date.now()}-${bookFile.name}`;
            
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
            user_id: user.id,
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
    },
    deleteBook: async ({ request, locals: { supabase, session, user } }) => {
        if (!session || !user) {
            return fail(401, { message: 'Unauthorized' });
        }

        const formData = await request.formData();
        const bookId = formData.get('id') as string;
        const fileUrl = formData.get('file_url') as string | null;

        if (!bookId) {
            return fail(400, { message: 'Book ID is required to delete' });
        }

        // 1. Delete from Database first to ensure user owns the book (Row Level Security applies)
        const { error: deleteDbError } = await supabase
            .from('books')
            .delete()
            .eq('id', bookId)
            .eq('user_id', user.id);

        if (deleteDbError) {
            console.error('Error deleting book from DB:', deleteDbError);
            return fail(500, { message: 'Failed to delete book from database.' });
        }

        // 2. If there was a file attached, delete it from storage
        if (fileUrl) {
            const { error: storageError } = await supabase.storage
                .from('book-pdfs')
                .remove([fileUrl]);

            if (storageError) {
                console.error('Error deleting book PDF from storage:', storageError);
                // We don't fail here since the DB record is already gone, but we log the error
            }
        }

        return { success: true };
    }
};