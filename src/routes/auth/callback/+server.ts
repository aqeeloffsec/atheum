import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code') as string;
	//const next = url.searchParams.get('next') ?? '/';

    if (code) {
        await supabase.auth.exchangeCodeForSession(code)
        /*
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            redirect(303, `/${next.slice(1)}`);
        }
        */
    }
    
    const { data: { user }, error } = await supabase.auth.getUser();
    const sessionData = await supabase.auth.getSession();
    //const { data: { user }, error } = sessionData;

    if (user && !error) { console.log(user, 'with getUser') }
    if (sessionData.data.session) {
        //console.log(user);
        console.log(sessionData.data.session.user);
        const userId = sessionData.data.session.user.id;
        const userName = sessionData.data.session.user.user_metadata.name;

        //const { data: existingUser, error: selectError } = await supabase.from("profile").select("username").eq("user_id", userId).single;
        const { data: existingUser, error: selectError } = await supabase.from("profile").select("username").eq("user_id", userId).single();

        if (selectError && selectError.code !== 'PGRST116') {
            return new Response("Failed to check for existing user", { status: 500 })
        }

        if (!existingUser) {
            const { error: insertError } = await supabase.from("profile").insert({
                user_id: userId,
                username: userName,
                //username: user.user_metadata.username,
                //avatar_url: user.user_metadata.avatar_url
            });

            if (insertError) {
                return new Response("Failed to insert username", { status: 500 })
            }
        
            //return new Response("User already exists", { status: 400 })
        }

        throw redirect(303, '/dashboard');
    }

    return new Response("User session data not found", { status: 400 })


  // return the user to an error page with instructions
  //redirect(303, '/auth/auth-code-error');
};