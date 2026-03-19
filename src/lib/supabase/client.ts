
import { createClient } from "@supabase/supabase-js";

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from "$env/static/public"

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);

/*
let _supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
    if (!_supabaseClient) {
        _supabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
    }
    return _supabaseClient;
}
*/