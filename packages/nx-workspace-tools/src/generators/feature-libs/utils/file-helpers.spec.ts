import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { addTailwindPluginToFeatureViteConfig } from './file-helpers';

describe('addTailwindPluginToFeatureViteConfig', () => {
  it('updates an existing vite config without replacing unrelated content', () => {
    const tree = createTreeWithEmptyWorkspace();
    const viteConfigPath = 'libs/my-ressources/feature/vite.config.mts';

    const originalContent = [
      "import vue from '@vitejs/plugin-vue';",
      "import { defineConfig } from 'vite';",
      '',
      'export default defineConfig(() => ({',
      '  root: __dirname,',
      "  cacheDir: '../../../node_modules/.vite/libs/my-ressources/feature',",
      '  plugins: [vue()],',
      '  resolve: {',
      "    alias: { '@': './src' },",
      '  },',
      '  test: {',
      "    name: 'feature-lib',",
      '    watch: false,',
      '    globals: true,',
      "    environment: 'jsdom',",
      "    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],",
      "    reporters: ['default'],",
      '    coverage: {',
      "      reportsDirectory: './test-output/vitest/coverage',",
      "      provider: 'v8' as const,",
      '    },',
      '  },',
      '}));',
      '',
    ].join('\n');

    tree.write(viteConfigPath, originalContent);

    addTailwindPluginToFeatureViteConfig(tree, viteConfigPath, 'my-ressources');

    const updatedContent = tree.read(viteConfigPath, 'utf-8');

    expect(updatedContent).toContain(
      "import tailwindcss from '@tailwindcss/vite';",
    );
    expect(updatedContent).toContain(
      "  cacheDir: '../../../node_modules/.vite/libs/my-ressources/feature',",
    );
    expect(updatedContent).toContain('  plugins: [vue(), tailwindcss()],');
    expect(updatedContent).toContain("    name: 'my-ressources',");
    expect(updatedContent).toContain("    alias: { '@': './src' },");
    expect(updatedContent).not.toContain("name: 'feature-lib'");
  });

  it('keeps an already updated vite config unchanged', () => {
    const tree = createTreeWithEmptyWorkspace();
    const viteConfigPath = 'libs/my-ressources/feature/vite.config.mts';

    const updatedContent = [
      "import vue from '@vitejs/plugin-vue';",
      "import tailwindcss from '@tailwindcss/vite';",
      "import { defineConfig } from 'vite';",
      '',
      'export default defineConfig(() => ({',
      '  root: __dirname,',
      "  cacheDir: '../../../node_modules/.vite/libs/my-ressources/feature',",
      '  plugins: [vue(), tailwindcss()],',
      '  test: {',
      "    name: 'my-ressources',",
      '    watch: false,',
      '    globals: true,',
      "    environment: 'jsdom',",
      "    setupFiles: ['test-setup.ts'],",
      "    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],",
      "    reporters: ['default'],",
      '    coverage: {',
      "      reportsDirectory: './test-output/vitest/coverage',",
      "      provider: 'v8' as const,",
      '    },',
      '  },',
      '}));',
      '',
    ].join('\n');

    tree.write(viteConfigPath, updatedContent);

    addTailwindPluginToFeatureViteConfig(tree, viteConfigPath, 'my-ressources');

    expect(tree.read(viteConfigPath, 'utf-8')).toBe(updatedContent);
  });
});
