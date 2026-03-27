import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ locals: { supabase, session, getSubscription, user } }) => {
    if (!session || !user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const subscription = await getSubscription();
        
        if (!subscription || !subscription.stripe_subscription_id) {
            return json({ error: 'No active subscription found' }, { status: 400 });
        }

        const subscriptionId = subscription.stripe_subscription_id;

        // Cancel the subscription in Stripe (immediately)
        await stripe.subscriptions.cancel(subscriptionId);

        // Update the database instantly to keep the UI in sync
        const adminSupabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { error: dbError } = await adminSupabase
            .from('subscriptions')
            .update({
                status: 'canceled',
                plan_id: 'free',
                stripe_subscription_id: null,
                current_period_end: new Date().toISOString()
            })
            .eq('user_id', user.id);

        if (dbError) {
            console.error('Database sync error on cancel:', dbError);
            // It will be updated by webhook eventually but we want instant feedback
        }

        return json({ success: true });
    } catch (err: any) {
        console.error('Stripe Cancel Subscription Error:', err);
        return json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
};
