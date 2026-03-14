import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';
import { PUBLIC_FRONTEND_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request, locals: { supabase, session } }) => {
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { priceId } = await request.json();

        if (!priceId) {
            return json({ error: 'Price ID is required' }, { status: 400 });
        }

        // Get the subscription to check for an existing stripe customer ID
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', session.user.id)
            .single();

        let customerId = subscription?.stripe_customer_id;

        // Create a new customer if one doesn't exist
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: session.user.email,
                metadata: {
                    user_id: session.user.id
                }
            });
            customerId = customer.id;
            
            // Immediately store the customer ID so we don't lose it if checkout fails
            const adminSupabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
            await adminSupabase.from('subscriptions').upsert({
                user_id: session.user.id,
                stripe_customer_id: customerId,
                status: 'incomplete' // Will be updated by webhook
            }, { onConflict: 'user_id' });
        }

        // Create the subscription. Note we are expanding the latest invoice's confirmation_secret
        const stripeSubscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
                price: priceId,
            }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent', 'latest_invoice.confirmation_secret'],
            metadata: {
                user_id: session.user.id
            }
        });

        // IMMEDIATELY log the subscription to DB to prevent 'null' data states before payment confirm
        const adminSupabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        let periodEnd = new Date().toISOString();
        const sSub = stripeSubscription as any;
        if (sSub.current_period_end) {
            periodEnd = new Date(sSub.current_period_end * 1000).toISOString();
        }

        await adminSupabase.from('subscriptions').upsert({
            user_id: session.user.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: stripeSubscription.id,
            plan_id: priceId,
            status: 'incomplete', // The checkout will verify and transition this to active
            current_period_end: periodEnd
        }, { onConflict: 'user_id' });

        const invoice = stripeSubscription.latest_invoice as any;
        
        // Stripe API 2024-12-18 and later use confirmation_secret
        let clientSecret = invoice?.confirmation_secret?.client_secret;
        if (!clientSecret) {
            // Fallback for older API versions
            clientSecret = invoice?.payment_intent?.client_secret;
        }

        if (!clientSecret) {
             return json({ error: 'Failed to create payment intent' }, { status: 400 });
        }

        return json({
            subscriptionId: stripeSubscription.id,
            clientSecret: clientSecret,
            customerId: customerId
        });
    } catch (err: any) {
        console.error('Stripe Custom Subscription Error:', err);
        return json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
};
