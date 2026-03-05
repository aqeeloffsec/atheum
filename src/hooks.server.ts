import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public'

const supabase: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
        cookies: {
            getAll: () => {
                return event.cookies.getAll()
            },
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, { ...options, path: '/' })
                });
            },
        },
    });

    event.locals.safeGetSession = async () => {
        const { data: { session } } = await event.locals.supabase.auth.getSession();
        if (!session) {
            return { session: null, user: null };
        }

        const { data: { user }, error } = await event.locals.supabase.auth.getUser();
        if (error) {
            return { session: null, user: null };
        }

        return { session, user };
    };

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range' || name === 'x-supabase-api-version'
        },
    });
}

const authGuard: Handle = async ({ event, resolve }) => {
    const { session, user } = await event.locals.safeGetSession();
    event.locals.session = session;
    event.locals.user = user;

    const { pathname } = event.url;

    const isPrivateRoute = pathname.startsWith('/dashboard');

    //const authPaths = ['/login', '/sign-up', '/forgot-password'];
    
   // const isAuthRoute = authPaths.some(path => pathname.startsWith(path));

    //const isPrivateRoute = event.route.id?.includes('/(private)/');
    //const isPrivateRoute = event.url.pathname.startsWith('/dashboard');

    //const isAuthRoute = event.route.id?.includes('/(auth)/');
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/sign-up') ||  pathname.startsWith('/forgot-password');

    if (!event.locals.session && isPrivateRoute) {
        throw redirect(302, '/login');
    };

    //event.url.pathname.startsWith('/sign-in')
    if (event.locals.session && isAuthRoute) {
        throw redirect(302, '/dashboard');
    };

    return resolve(event); 
}

export const handle: Handle = sequence(supabase, authGuard);