import type { Actions } from './$types';

import { fail, redirect } from '@sveltejs/kit';

interface ReturnObject {
    success: boolean;
    email: string;
    password: string;
    errors: {
        email: string[];
        password: string[];
    }
}

export const actions = {
    default: async ({ request, cookies, locals: { supabase } }) => {
        await new Promise((fulfil) => setTimeout(fulfil, 1000));

        const formData = await request.formData();

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const returnObject: ReturnObject = {
            success: true,
            email,
            password,
            errors: {
                email: [],
                password: [],
            }
        } 

        // Email Validation
        if (!email || email.length === 0) {
            returnObject.errors.email.push("Email is required");
        } else if (!email.includes('@')) {
            returnObject.errors.email.push("Email must be valid");
        }

        // Password Validation
        if (!password || password.length === 0) {
            returnObject.errors.password.push("Password is required");
        } else if (password.length < 6) {
            returnObject.errors.password.push("Password must be at least 6 characters");
        }

        // Final Status Check
        if (returnObject.errors.email.length > 0 || returnObject.errors.password.length > 0) {
            returnObject.success = false;
            return returnObject;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error || !data.user) {
            console.log(error);
            returnObject.success = false;
            returnObject.errors.email.push(error?.message || 'An error occurred during sign up');
            return fail(400, returnObject as any);
        }

        cookies.set('auth_toast', 'Successfully authenticated', { path: '/', httpOnly: false, maxAge: 10 });
        redirect(303, '/library');
    }
} satisfies Actions;