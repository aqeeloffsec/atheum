<script lang="ts">
    import { 
        PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY, 
        PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY, 
        PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY, 
        PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY
    } from "$env/static/public";

    let { subscription } = $props<{ subscription: any }>();
    let isPortalLoading = $state(false);

    function handleUpgradeRoute() {
        window.location.href = '/dashboard/pricing';
    }

    const planName = $derived(() => {
        if (!subscription || subscription.status !== 'active') return 'Free';
        const pid = subscription.plan_id;
        if (pid === PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY || pid === PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY) return 'Scholar';
        if (pid === PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY || pid === PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY) return 'Librarian';
        return 'Special';
    });

    const limits = $derived(() => {
        const name = planName();
        if (name === 'Scholar') return '20 books';
        if (name === 'Librarian') return 'Unlimited books';
        return '4 books';
    });

    async function handlePortal() {
        isPortalLoading = true;
        try {
            const response = await fetch('/api/stripe/portal', { method: 'POST' });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Failed to open billing portal');
            }
        } catch (err) {
            console.error('Portal error:', err);
        } finally {
            isPortalLoading = false;
        }
    }
</script>

<div class="bg-[#1a232e] rounded-2xl p-6 border border-white/10 shadow-xl overflow-hidden relative">
    <!-- Decorative background element -->
    <div class="absolute -right-4 -top-4 w-24 h-24 bg-amber-400/10 rounded-full blur-3xl"></div>
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
            <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold uppercase tracking-widest text-amber-400">Current Plan</span>
                {#if subscription?.status === 'active'}
                    <span class="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                {/if}
            </div>
            <h3 class="text-2xl font-serif font-bold text-white leading-tight">
                {planName()} Plan
            </h3>
            <p class="text-gray-400 text-sm mt-1">
                Your limit: <span class="text-white font-medium">{limits()}</span>
            </p>
        </div>

        <div class="flex flex-col gap-2">
            {#if planName() === 'Free'}
                <div class="flex gap-2">
                    <button 
                        onclick={handleUpgradeRoute}
                        class="px-5 py-2.5 rounded-xl bg-amber-400 text-[#1a232e] font-bold text-sm text-center hover:bg-amber-300 transition-all shadow-lg hover:shadow-amber-400/20 cursor-pointer flex-1"
                    >
                        View Upgrade Options
                    </button>
                    <button 
                         onclick={handleUpgradeRoute}
                        class="px-5 py-2.5 rounded-xl bg-emerald-500 text-[#1a232e] font-bold text-sm text-center hover:bg-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/20 cursor-pointer flex-1"
                    >
                        See All Plans
                    </button>
                </div>
            {:else if planName() === 'Scholar'}
                <div class="flex gap-2">
                    <button 
                        onclick={handlePortal}
                        disabled={isPortalLoading}
                        class="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all disabled:opacity-50 cursor-pointer flex-1"
                    >
                        {isPortalLoading ? 'Loading...' : 'Manage'}
                    </button>
                    <button 
                        onclick={handleUpgradeRoute}
                        class="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm text-center hover:bg-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/20 cursor-pointer flex-2"
                    >
                        Explore Upgrades
                    </button>
                </div>
            {:else}
                <button 
                    onclick={handlePortal}
                    disabled={isPortalLoading}
                    class="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                    {isPortalLoading ? 'Loading...' : 'Manage Billing'}
                </button>
            {/if}
        </div>
    </div>

    {#if subscription?.current_period_end}
        <div class="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar shrink-0"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
            <span>Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}</span>
        </div>
    {/if}
</div>
