import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

export default defineConfig({
  base: '/testsupabase/', // Set your base path for GitHub Pages
  define: {
    'process.env': process.env, // Allow process.env access in your project
  },
});