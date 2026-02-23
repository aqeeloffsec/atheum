<script lang="ts">

</script>

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
            <div class="p-1.5 rounded-[10px] transition-colors bg-[#1a232e]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library w-4 h-4 text-[#fdfaf6]" aria-hidden="true">
                    <path d="m16 6 4 14"></path><path d="M12 6v14"></path>
                    <path d="M8 8v12"></path><path d="M4 4v16"></path>
                </svg>
            </div>
            <span class="font-serif font-bold text-[#1a232e] text-lg tracking-tight">Atheum</span>
        </div>
        <nav class="hidden md:flex items-center gap-1">
            <a href="#features" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#1a232e] hover:bg-[#1a232e]/5 rounded-xl transition-all">Features</a>
            <a href="#how-it-works" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#1a232e] hover:bg-[#1a232e]/5 rounded-xl transition-all">How It Works</a>
            <a href="#pricing" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#1a232e] hover:bg-[#1a232e]/5 rounded-xl transition-all">Pricing</a>
            <a href="#faq" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#1a232e] hover:bg-[#1a232e]/5 rounded-xl transition-all">FAQ</a>
        </nav>
        <div class="flex items-center gap-2">
            <a href="/login" class="hidden md:flex items-center gap-2 text-[#1a232e] px-4 py-2.5 rounded-[14px] font-bold text-sm hover:bg-[#1a232e]/8 transition-all border border-[#1a232e]/15">Sign In</a>
            <a href="/sign-up" class="hidden md:flex items-center gap-2 bg-[#1a232e] text-white px-5 py-2.5 rounded-[14px] font-bold text-sm hover:bg-[#2d3b4b] transition-all shadow-sm">Get Started
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-3.5 h-3.5" aria-hidden="true">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                </svg>
            </a>
            <button class="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" aria-label="Toggle menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu w-5 h-5" aria-hidden="true">
                    <path d="M4 12h16"></path>
                    <path d="M4 18h16"></path>
                    <path d="M4 6h16"></path>
                </svg>
            </button>
        </div>
    </div>
</header>