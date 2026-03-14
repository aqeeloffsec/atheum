import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request, locals: { supabase, session } }) => {
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('[VERIFY-SUBSCRIPTION] Endpoint HIT!');
        const { subscriptionId } = await request.json();
        console.log('[VERIFY-SUBSCRIPTION] Requested ID:', subscriptionId);

        if (!subscriptionId) {
            return json({ error: 'Subscription ID is required' }, { status: 400 });
        }

        // 1. Fetch the absolute latest state from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['latest_invoice.payment_intent']
        });

        // 2. Extract values
        let status = stripeSubscription.status;
        
        // Stripe's subscription status might take a moment to update to 'active' after payment intent succeeds.
        // We can safely assume it's active if the payment has cleared.
        const invoice = stripeSubscription.latest_invoice as any;
        const paymentIntent = invoice?.payment_intent;
        if (status === 'incomplete' && paymentIntent?.status === 'succeeded') {
            status = 'active';
        }

        const planId = stripeSubscription.items.data[0].price.id;
        const currentPeriodEnd = new Date((stripeSubscription as any).current_period_end * 1000).toISOString();
        const customerId = stripeSubscription.customer as string;

        // 3. Immediately upsert into Supabase to guarantee state sync before webhooks
        const adminSupabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        let userId = session.user.id;

        const upsertData: any = {
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: status,
            plan_id: planId,
            current_period_end: currentPeriodEnd,
        };

        if (userId) {
            upsertData.user_id = userId;
        }

        console.log('[VERIFY-SUBSCRIPTION] Upserting Data:', upsertData);

        const { data, error } = await adminSupabase
            .from('subscriptions')
            .upsert(upsertData, { onConflict: 'user_id' }); // Conflict on user_id because it's uniquely indexed

        if (error) {
            console.error('[VERIFY-SUBSCRIPTION] Instant Sync Supabase Error:', error);
            return json({ error: 'Failed to sync subscription state to database' }, { status: 500 });
        }

        return json({ success: true, status });
        
    } catch (err: any) {
        console.error('Stripe Verify Subscription Error:', err);
        return json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
};
