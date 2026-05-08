import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
    ssr: {
		noExternal: ['gsap']
	},
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('gsap')) {
                        return 'gsap';
                    }
                    if (id.includes('supabase')) {
                        return 'supabase';
                    }
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                }
            }
        }
    }
});