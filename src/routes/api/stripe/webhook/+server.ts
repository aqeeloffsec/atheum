import { json } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return json({ error: 'No signature' }, { status: 400 });
    }

    const body = await request.text();
    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return json({ error: err.message }, { status: 400 });
    }

    // Initialize admin supabase client
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const session = event.data.object as any;

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const userId = session.client_reference_id;
                const subscriptionId = session.subscription;
                const customerId = session.customer;

                // Fetch subscription details from Stripe
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const planId = subscription.items.data[0].price.id;
                const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000).toISOString();

                await supabase.from('subscriptions').upsert({
                    user_id: userId,
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    plan_id: planId,
                    status: subscription.status,
                    current_period_end: currentPeriodEnd,
                }, { onConflict: 'user_id' });
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as any;
                const status = subscription.status;
                const planId = subscription.items.data[0].price.id;
                const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
                const customerId = subscription.customer;

                // Upsert requires the `user_id` if we are inserting a brand new row, 
                // but usually the row exists. Let's gracefully fetch the user_id if it's missing 
                // in the event we perform a raw insert and hit a null constraint on user_id.
                let userId = subscription.metadata?.user_id;
                let existingStatus = null;

                const { data: existingSub } = await supabase
                    .from('subscriptions')
                    .select('user_id, status')
                    .eq('stripe_customer_id', customerId)
                    .single();
                
                if (existingSub) {
                    if (!userId) userId = existingSub.user_id;
                    existingStatus = existingSub.status;
                }

                if (!userId) {
                    console.error('Webhook Error: Could not resolve user_id for customer', customerId);
                    return json({ error: 'Unmapped Customer' }, { status: 400 });
                }

                let finalStatus = status;
                // Prevent race condition: If the frontend already verified and marked as active,
                // don't let a lagging 'created' webhook downgrade it back to incomplete.
                if (existingStatus === 'active' && status === 'incomplete') {
                    finalStatus = 'active';
                    console.log(`[WEBHOOK] Prevented downgrade from active to incomplete for subscription ${subscription.id}`);
                }

                const upsertData: any = {
                    user_id: userId,
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscription.id,
                    status: finalStatus,
                    plan_id: planId,
                    current_period_end: currentPeriodEnd,
                };

                await supabase
                    .from('subscriptions')
                    .upsert(upsertData, { onConflict: 'user_id' });
                break;
            }
        }

        return json({ received: true });
    } catch (err: any) {
        console.error('Webhook handler error:', err);
        return json({ error: 'Webhook handler failed' }, { status: 500 });
    }
};
