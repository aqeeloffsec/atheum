import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient<Database>
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      getSubscription: () => Promise<any | null>
      session: Session | null
      user: User | null
      subscription: any | null
    }
    interface PageData {
      session: Session | null
      subscription: any | null
    }
    // interface PageState {}
    // interface Platform {}
  }
}
export {}