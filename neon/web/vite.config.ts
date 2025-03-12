import vue from '@vitejs/plugin-vue';
import {defineConfig} from 'vite';

export default defineConfig(function ({mode}) {
  const isProduction = mode === 'production';
  return {
    plugins: [
      vue({isProduction}),
    ],
    build: {
      rollupOptions: {
        input: './src/main.ts',
      },
      manifest: 'manifest.json',
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler.js', // include template compiler
      },
    },
  };
});
