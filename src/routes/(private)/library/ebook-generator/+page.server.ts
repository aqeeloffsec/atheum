import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import {
    PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY,
    PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY,
    PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY,
    PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY
} from '$env/static/public';
import { PLAN_CONFIGS, getAvailableFormats, type PlanTier } from '$lib/config/plan-config';

// Determine the plan tier from subscription data
function getPlanTier(subscription: any): PlanTier {
    if (!subscription || subscription.status !== 'active') {
        // Check for trailing status too
        if (subscription?.status === 'trailing') {
            // Fall through to check plan_id
        } else {
            return 'free';
        }
    }

    const planId = subscription?.plan_id;
    if (planId === PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY || planId === PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY) {
        return 'librarian';
    }
    if (planId === PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY || planId === PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY) {
        return 'scholar';
    }
    return 'free';
}

export const load: PageServerLoad = async ({ locals: { session, subscription, user, supabase } }) => {
    if (!session || !user) {
        throw redirect(302, '/auth/sign-in');
    }

    const planTier = getPlanTier(subscription);
    const planConfig = PLAN_CONFIGS[planTier];
    const availableFormats = getAvailableFormats(planTier);

    // Query monthly generation count from ebook_generations table
    let monthlyUsed = 0;
    try {
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const { count, error } = await supabase
            .from('ebook_generations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', firstOfMonth);

        if (!error && count !== null) {
            monthlyUsed = count;
        }
    } catch (err) {
        console.error('Error querying ebook_generations:', err);
    }

    const canGenerate = monthlyUsed < planConfig.monthlyLimit;

    return {
        subscription,
        canGenerate,
        planTier,
        planLabel: planConfig.label,
        pageRange: planConfig.pageRange,
        monthlyLimit: planConfig.monthlyLimit,
        monthlyUsed,
        qualityTier: planConfig.qualityTier,
        availableFormats: availableFormats.map(f => ({
            id: f.id,
            label: f.label,
            description: f.description,
            category: f.category,
        })),
        userId: user.id
    };
};