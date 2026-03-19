import { json, redirect } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { PUBLIC_FRONTEND_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    const { session } = await locals.safeGetSession();
    
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId } = await request.json();

    if (!priceId) {
        return json({ error: 'Price ID is required' }, { status: 400 });
    }

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            return_url: `${PUBLIC_FRONTEND_URL}/library?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            customer_email: session.user.email,
            client_reference_id: session.user.id,
            subscription_data: {
                metadata: {
                    user_id: session.user.id,
                },
            },
        });

        if (!checkoutSession.client_secret) {
            return json({ error: 'Failed to create checkout session' }, { status: 500 });
        }

        return json({ clientSecret: checkoutSession.client_secret });
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err);
        return json({ error: err.message }, { status: 500 });
    }
};
