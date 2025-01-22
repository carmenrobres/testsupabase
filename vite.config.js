import { defineConfig } from 'vite';

export default defineConfig({
  base: '/<testsupabase>/', // Replace with your repository name
  build: {
    rollupOptions: {
      external: ['https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm']
    }
  }
});