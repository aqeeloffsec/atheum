import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { getContext, setContext } from "svelte";

interface UserStateProps {
    session: Session | null;
    supabase: SupabaseClient | null;
    user: User | null;
    subscription?: any | null;
}

export class UserState {
    // Svelte 5 internal refs
    _session = $state<Session | null>(null);
    _supabase = $state<SupabaseClient | null>(null);
    _user = $state<User | null>(null);
    _subscription = $state<any>(null);

    get session() { return this._session; }
    get supabase() { return this._supabase; }
    get user() { return this._user; }
    get subscription() { return this._subscription; }

    isAddBookModalOpen = $state(false);
    selectedBook = $state<any>(null);
    isQuickViewOpen = $state(false);
    
    isSidebarCollapsed = $state(false);
    isMobileMenuOpen = $state(false);
    
    // Filter states
    activeFilter = $state('All Books');
    activeGenre = $state('All Genres');

    // Books array for global state
    books = $state<any[]>([]);

    constructor(data: UserStateProps) {
       // Since the incoming data might be plain OR reactive getters, we initialize
       this.updateState(data);
       
       $effect.root(() => {
           $effect(() => {
               this._session = data.session;
               this._supabase = data.supabase;
               this._user = data.user;
               if (data.subscription !== undefined) {
                   this._subscription = data.subscription;
               }
           });
       });
    }

    updateState(data: UserStateProps) {
        this._session = data.session;
        this._supabase = data.supabase;
        this._user = data.user;
        if (data.subscription !== undefined) {
            this._subscription = data.subscription;
        }
    }

    async toggleFavorite(bookId: string, currentStatus: boolean) {
        if (!this.supabase || !this.session) return false;

        const newStatus = !currentStatus;
        
        // Optimistic update
        if (this.selectedBook && this.selectedBook.id === bookId) {
            this.selectedBook.is_favorite = newStatus;
        }
        const bookIndex = this.books.findIndex(b => b.id === bookId);
        if (bookIndex !== -1) {
            this.books[bookIndex].is_favorite = newStatus;
        }

        const { error } = await this.supabase
            .from('books')
            .update({ is_favorite: newStatus })
            .eq('id', bookId)
            .eq('user_id', this.user?.id);

        if (error) {
            console.error('Error updating favorite exactly:', error);
            // Revert state on error
            if (this.selectedBook && this.selectedBook.id === bookId) {
                this.selectedBook.is_favorite = currentStatus;
            }
            if (bookIndex !== -1) {
                this.books[bookIndex].is_favorite = currentStatus;
            }
            return false;
        }
        
        return newStatus;
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
