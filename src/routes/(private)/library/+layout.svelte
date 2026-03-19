<script lang="ts">
    import { getUserState } from "$lib/state/user-state.svelte";

	import Header from '$lib/components/library/Header.svelte';
	import SideBar from '$lib/components/library/SideBar.svelte';
    import AddBookModal from '$lib/components/library/AddBookModal.svelte';
    import QuickViewBook from "$lib/components/library/QuickViewBook.svelte";
    
    let { children, data } = $props();
    let userContext = getUserState();

    let localPlan = $state<string | null>(null);
    let activePlan = $derived(localPlan || data.subscription?.plan_id || 'free');

    function openQuickView(book: any) {
        userContext.selectedBook = book;
        userContext.isQuickViewOpen = true;
    }
</script>

<main class="flex h-screen w-full overflow-hidden bg-[#fdfaf6] text-[#333333] selection:bg-[#e6e0d4]">
    <SideBar currentPlan={activePlan} />
    <div class="flex-1 flex flex-col min-w-0 bg-[#fdfaf6]">
        <Header />
        <div class="flex-1 overflow-y-auto p-6 md:p-8">
            {@render children()}
        </div>
    </div>
    <AddBookModal />
    <QuickViewBook />
</main>