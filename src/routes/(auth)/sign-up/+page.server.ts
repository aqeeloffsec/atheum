import type { Actions } from './$types';

import { fail, redirect } from '@sveltejs/kit';

interface ReturnObject {
    success: boolean;
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    terms: boolean;
    errors: {
        username: string[];
        email: string[];
        password: string[];
        confirm_password: string[];
        terms: string[];
    }
}

export const actions: Actions = {
    default: async ({ request, locals: { supabase } }) => {
        await new Promise((fulfil) => setTimeout(fulfil, 1000));

        const formData = await request.formData();

        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirm_password = formData.get('confirm_password') as string;
        const terms = formData.get('terms') === 'on';

        const returnObject: ReturnObject = {
            success: true,
            username,
            email,
            password,
            confirm_password,
            terms,
            errors: {
                username: [],
                email: [],
                password: [],
                confirm_password: [],
                terms: []
            }
        }

        if (!username || username.length === 0) {
            returnObject.errors.username.push("Username is required");
        } else if (username.length < 4) {
            returnObject.errors.username.push("Username must be at least 4 characters");
        }

        
        if (!email || email.length === 0) {
            returnObject.errors.email.push("Email is required");
        } else if (!email.includes('@')) {
            returnObject.errors.email.push("Email must be valid");
        }

        
        if (!password || password.length === 0) {
            returnObject.errors.password.push("Password is required");
        } else if (password.length < 6) {
            returnObject.errors.password.push("Password must be at least 6 characters");
        }

        
        if (!confirm_password || confirm_password.length === 0) {
            returnObject.errors.confirm_password.push("Confirm password is required");
        } else if (confirm_password !== password) {
            returnObject.errors.confirm_password.push("Confirm password must match password");
        }

        
        if (!terms) {
            returnObject.errors.terms.push("You must agree to the terms and conditions");
        }

        
        if (returnObject.errors.username.length > 0 || returnObject.errors.email.length > 0 || returnObject.errors.password.length > 0 || returnObject.errors.confirm_password.length > 0 || returnObject.errors.terms.length > 0) {
            returnObject.success = false;
            return returnObject;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error || !data.user) {
            console.log(error);
            returnObject.success = false;
            returnObject.errors.email.push(error?.message || 'An error occurred during sign up');
            return fail(400, returnObject as any);
        }

        await supabase.from("profile").insert({
            user_id: data.user.id,
            username,
            //name,
            //avatar_url
        });

        redirect(303, '/dashboard');
    }
} satisfies Actions; 