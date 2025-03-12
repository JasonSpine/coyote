import tailwind from "@tailwindcss/vite";
import vue from '@vitejs/plugin-vue';
import {defineConfig} from 'vite';

export default defineConfig(function ({mode}) {
  const isProduction = mode === 'production';
  return {
    base: '/neon/',
    plugins: [
      vue({isProduction}),
      tailwind(),
    ],
    build: {
      rollupOptions: {
        input: './src/main.ts',
      },
      manifest: 'manifest.json',
    },
  };
});
