<script lang="ts">
import { enhance } from "$app/forms";

import { getUserState } from "$lib/state/user-state.svelte";

let loadingLogout = $state(false);

let userContext = getUserState();
let {user} = $derived(userContext);

$inspect(user);

</script>

<header class="h-20 flex items-center justify-between px-6 border-b border-[#e6e0d4] bg-white/50 backdrop-blur-md sticky top-0 z-30">
            <div class="flex items-center gap-4 flex-1">
                <button class="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" aria-label="Toggle Menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu w-6 h-6" aria-hidden="true">
                        <path d="M4 12h16"></path>
                        <path d="M4 18h16"></path>
                        <path d="M4 6h16"></path>
                    </svg>
                </button>
                <div class="relative max-w-md w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true">
                        <path d="m21 21-4.34-4.34"></path>
                        <circle cx="11" cy="11" r="8"></circle>
                    </svg>
                    <input placeholder="Search by title or author..." class="w-full pl-10 pr-4 py-2.5 bg-[#f5f3f0] border-none rounded-xl focus:ring-2 focus:ring-[#1a232e]/10 transition-all outline-none text-sm" type="text" value="" />
                </div>
            </div>
            <div class="flex items-center gap-3">
                <button onclick={() => { userContext.isAddBookModalOpen = true; }} class="flex items-center gap-2 bg-[#1a232e] text-white px-4 py-2.5 rounded-xl hover:bg-[#2d3b4b] transition-all font-medium text-sm shadow-sm cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-4 h-4" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                    </svg>
                    <span class="hidden sm:inline">Add Book</span>
                </button>
                {#if user}
                    {console.log(user)}
                    <p>{user.id}</p>
                    <p>{user.user_metadata.name}</p>
                    <p>{user.email}</p>
                    <form method="POST" action="/logout" use:enhance={() => {
                        loadingLogout = true;
                        return async ({ update }) => {
                            await update();
                            loadingLogout = false;
                        };
                    }}>
                        <button type="submit" disabled={loadingLogout} class="flex items-center gap-2 bg-[#1a232e] text-white px-4 py-2.5 rounded-xl hover:bg-[#2d3b4b] transition-all font-medium text-sm shadow-sm">
                            {#if !loadingLogout}
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" 
                                    height="24" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor"
                                    stroke-width="2" 
                                    stroke-linecap="round" 
                                    stroke-linejoin="round" 
                                    class="lucide lucide-log-out w-4 h-4" 
                                    aria-hidden="true"
                                >
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" x2="9" y1="12" y2="12" />
                                </svg>
                                <span class="hidden sm:inline">Logout</span>
                            {:else}
                                Logging out...
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" 
                                    height="24" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    stroke-width="2" 
                                    stroke-linecap="round" 
                                    stroke-linejoin="round" 
                                    class="animate-spin w-4 h-4" 
                                    aria-hidden="true"
                                >
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                            {/if}
                        </button>
                    </form>
                {/if}
            </div>
        </header>