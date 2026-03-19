import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, session, subscription } }) => {
    return {
        session,
        subscription
    };
};
