<script lang="ts">
import AtheumLogo from "$lib/components/shared/AtheumLogo.svelte";

</script>

<footer class="bg-[#fdfaf6] border-t border-[#e6e0d4] py-12">
    <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
            <div class="col-span-2 md:col-span-1">
                <AtheumLogo />
                <p class="text-gray-500 text-sm leading-relaxed">A beautifully designed personal book library for every kind of reader.</p>
            </div>
            <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Product</p>
                <ul class="space-y-2">
                    <li>
                        <a href="/" class="text-sm text-gray-500 hover:text-[#1a232e] transition-colors">Features</a>
                    </li>
                    <li>
                        <a href="/" class="text-sm text-gray-500 hover:text-[#1a232e] transition-colors">How It Works</a>
                    </li>
                    <li>
                        <a href="/" class="text-sm text-gray-500 hover:text-[#1a232e] transition-colors">Pricing</a>
                    </li>
                </ul>
            </div>
            <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Company</p>
                <ul class="space-y-2">
                    <li>
                        <a href="/" class="text-sm text-gray-500 hover:text-[#1a232e] transition-colors">About</a>
                    </li>
                    <li>
                        <a href="/" class="text-sm text-gray-500 hover:text-[#1a232e] transition-colors">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="/" class="text-sm text-gray-500 hover:text-[#1a232e] transition-colors">Terms of Use</a>
                    </li>
                    <li>
                        <a href="/" class="text-sm text-gray-500 hover:text-[#1a232e] transition-colors">Contact</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#e6e0d4] gap-4">
            <p class="text-xs text-gray-400">© 2026 Atheum. Crafted for readers, by <a href="https://aqeeloffsec.vercel.app/" target="_blank" class="text-[#1a232e] hover:text-[#1a232e]/80 transition-colors">Aqeel</a>.</p>
            <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked w-3.5 h-3.5 text-gray-400" aria-hidden="true">
                    <path d="M10 2v8l3-3 3 3V2"></path>
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
                </svg>
                <span class="text-xs text-gray-400">Built with love for books.</span>
            </div>
        </div>
    </div>
</footer>