import { json } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { PUBLIC_FRONTEND_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
    const { session } = await locals.safeGetSession();
    
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await locals.getSubscription();

    if (!subscription || !subscription.stripe_customer_id) {
        return json({ error: 'No active subscription or customer ID found' }, { status: 400 });
    }

    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: subscription.stripe_customer_id,
            return_url: `${PUBLIC_FRONTEND_URL}/library/settings`,
        });

        return json({ url: portalSession.url });
    } catch (err: any) {
        console.error('Stripe Portal Error:', err);
        return json({ error: err.message }, { status: 500 });
    }
};
