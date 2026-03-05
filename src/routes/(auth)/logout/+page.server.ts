import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ locals: { supabase } }) => {
        await new Promise((fulfil) => setTimeout(fulfil, 500));

        await supabase.auth.signOut();

        throw redirect(302, '/login');
    }
};