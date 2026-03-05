import { PUBLIC_FRONTEND_URL } from '$env/static/public';
import type { Actions } from './$types';

import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
    default: async ({ locals: { supabase } }) => {
        await new Promise((fulfil) => setTimeout(fulfil, 1000));

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${PUBLIC_FRONTEND_URL}/auth/callback`
            }
        });

        if (error) {
            return fail(400, {
                message: "Something went wrong with Google Sign Up"
            })
        }

        throw redirect(303, data.url);
    }
} satisfies Actions; 