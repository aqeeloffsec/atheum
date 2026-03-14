import { json } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { PUBLIC_FRONTEND_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    const { session } = await locals.safeGetSession();
    const subscription = await locals.getSubscription();
    
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!subscription || !subscription.stripe_subscription_id) {
        return json({ error: 'No active subscription found to upgrade' }, { status: 400 });
    }

    const { priceId } = await request.json();

    if (!priceId) {
        return json({ error: 'Price ID is required' }, { status: 400 });
    }

    try {
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);

        if (!stripeSubscription) {
             return json({ error: 'Subscription not found in Stripe' }, { status: 404 });
        }

        const updatedSubscription = await stripe.subscriptions.update(stripeSubscription.id, {
            items: [{
                id: stripeSubscription.items.data[0].id,
                price: priceId,
            }],
            proration_behavior: 'create_prorations',
            expand: ['latest_invoice.payment_intent'],
        });

        // Optimistically update DB immediately
        const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        await supabase
            .from('subscriptions')
            .update({
                status: updatedSubscription.status,
                plan_id: priceId,
                current_period_end: new Date((updatedSubscription as any).current_period_end * 1000).toISOString(),
            })
            .eq('stripe_subscription_id', updatedSubscription.id);

        // We could theoretically redirect to a checkout or invoice URL for immediate payment if needed,
        // but typically Stripe attempts the payment immediately on update.
        return json({ success: true, subscription: updatedSubscription.id });
    } catch (err: any) {
        console.error('Stripe Upgrade Error:', err);
        return json({ error: err.message }, { status: 500 });
    }
};
