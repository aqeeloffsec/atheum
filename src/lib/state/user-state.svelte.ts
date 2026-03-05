import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { getContext, setContext } from "svelte";

interface UserStateProps {
    session: Session | null;
    supabase: SupabaseClient | null;
    user: User | null;
}

export class UserState {
    session = $state<Session | null>(null);
    supabase = $state<SupabaseClient | null>(null);
    user = $state<User | null>(null);
    isAddBookModalOpen = $state(false);
    selectedBook = $state<any>(null);
    isQuickViewOpen = $state(false);

    constructor(data: UserStateProps) {
       this.updateState(data);
    }

    updateState(data: UserStateProps) {
        this.session = data.session;
        this.supabase = data.supabase;
        this.user = data.user;
    }

    async logout() {
        /*
        await this.supabase?.auth.signOut();
        //this.session = null;
        //this.user = null;
        goto('/login', { invalidateAll: true });
        */
        
        /*
        // 1. Trigger the server-side action
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'x-sveltekit-action': 'true'
            }
        });

        if (response.ok) {
            // 2. Clear local state manually if needed 
            // (though a full page redirect usually handles this)
            this.updateState({ session: null, supabase: this.supabase, user: null });
            
            // 3. Force a navigation to ensure all load functions re-run
            //goto('/login', { invalidateAll: true });
        }
        */
    }
}

const USER_STATE_KEY = Symbol('USER_STATE');

export function setUserState(data: UserStateProps) {
    return setContext(USER_STATE_KEY, new UserState(data));
}

export function getUserState() {
    return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}
