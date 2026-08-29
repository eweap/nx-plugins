/// <reference types='vitest' />
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

function normalizeBasePath(basePath?: string): string {
  if (!basePath || basePath === '/') {
    return '/';
  }

  const trimmedBasePath = basePath.replace(/^\/+|\/+$/g, '');
  return `/${trimmedBasePath}/`;
}

export default defineConfig(() => ({
  base: normalizeBasePath(
    process.env.NX_WEBSITE_BASE_PATH ?? process.env.VITE_BASE_PATH,
  ),
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/website',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [vue(), tailwindcss()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    name: 'website',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
