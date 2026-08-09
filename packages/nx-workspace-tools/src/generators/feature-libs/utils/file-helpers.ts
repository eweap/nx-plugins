import { Tree, updateJson } from '@nx/devkit';
import * as path from 'node:path';

function ensurePackageJson(
  tree: Tree,
  packageJsonPath: string,
  packageName: string,
) {
  if (tree.exists(packageJsonPath)) {
    return;
  }

  tree.write(
    packageJsonPath,
    JSON.stringify(
      {
        name: packageName,
        version: '0.0.1',
        exports: {},
        devDependencies: {},
      },
      null,
      2,
    ),
  );
}

export function addCustomRulesToEslintConfig(
  tree: Tree,
  eslintConfigPath: string,
) {
  const eslintConfigContent = tree.read(eslintConfigPath, 'utf-8');

  if (!eslintConfigContent) {
    return;
  }

  const updatedEslintConfigContent = [
    "import vue from 'eslint-plugin-vue';",
    '',
    "import baseConfig, { customRules } from '../../../eslint.config.mjs';",
    '',
    'export default [',
    '  ...baseConfig,',
    "  ...vue.configs['flat/recommended'],",
    '  {',
    "    files: ['**/*.vue'],",
    '    languageOptions: {',
    '      parserOptions: {',
    "        parser: await import('@typescript-eslint/parser'),",
    '      },',
    '    },',
    '  },',
    '  {',
    "    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],",
    '    rules: {',
    "      'vue/multi-word-component-names': 'off',",
    '    },',
    '  },',
    '  ...customRules,',
    '];',
    '',
  ].join('\n');

  if (updatedEslintConfigContent !== eslintConfigContent) {
    tree.write(eslintConfigPath, updatedEslintConfigContent);
  }
}

export function addExportsToPackageJson(
  tree: Tree,
  packageJsonPath: string,
  packageName: string,
) {
  ensurePackageJson(tree, packageJsonPath, packageName);

  updateJson(tree, packageJsonPath, (pkgJson) => {
    pkgJson.exports = {
      '.': {
        types: './src/index.ts',
        import: './src/index.ts',
        default: './src/index.ts',
      },
    };
    pkgJson.devDependencies = {};

    return pkgJson;
  });
}

export function addSetupFilesToViteConfig(tree: Tree, viteConfigPath: string) {
  const viteConfigContent = tree.read(viteConfigPath, 'utf-8');

  if (!viteConfigContent || viteConfigContent.includes('setupFiles:')) {
    return;
  }

  const updatedViteConfigContent = viteConfigContent.replace(
    /(\s+environment:\s+["']jsdom["'],\n)/,
    '$1    setupFiles: ["test-setup.ts"],\n',
  );

  if (updatedViteConfigContent !== viteConfigContent) {
    tree.write(viteConfigPath, updatedViteConfigContent);
  }
}

export function addTailwindPluginToFeatureViteConfig(
  tree: Tree,
  viteConfigPath: string,
  projectName: string,
) {
  const viteConfigContent = tree.read(viteConfigPath, 'utf-8');

  if (!viteConfigContent) {
    return;
  }

  let updatedViteConfigContent = viteConfigContent;

  if (
    !updatedViteConfigContent.includes(
      "import tailwindcss from '@tailwindcss/vite';",
    )
  ) {
    updatedViteConfigContent = updatedViteConfigContent.replace(
      /^(?:import .*\n)+/,
      (imports) => `${imports}import tailwindcss from '@tailwindcss/vite';\n`,
    );
  }

  updatedViteConfigContent = updatedViteConfigContent.replace(
    /^\s*cacheDir:\s*['"][^'"]+['"],$/m,
    `  cacheDir: '../../../node_modules/.vite/${path.posix.dirname(viteConfigPath)}',`,
  );

  updatedViteConfigContent = updatedViteConfigContent.replace(
    /^\s*plugins:\s*\[\s*vue\(\)\s*\],$/m,
    '  plugins: [vue(), tailwindcss()],',
  );

  updatedViteConfigContent = updatedViteConfigContent.replace(
    /^\s*name:\s*['"][^'"]+['"],$/m,
    `    name: '${projectName}',`,
  );

  if (updatedViteConfigContent !== viteConfigContent) {
    tree.write(viteConfigPath, updatedViteConfigContent);
  }
}

export function addTailwindPluginToViteConfig(
  tree: Tree,
  viteConfigPath: string,
) {
  const viteConfigContent = tree.read(viteConfigPath, 'utf-8');

  if (!viteConfigContent) {
    return;
  }

  const updatedViteConfigContent = [
    "import tailwindcss from '@tailwindcss/vite';",
    "import vue from '@vitejs/plugin-vue';",
    "import { defineConfig } from 'vite';",
    '',
    'export default defineConfig(() => ({',
    '  root: __dirname,',
    "  cacheDir: '../../../node_modules/.vite/libs/ui',",
    '  plugins: [vue(), tailwindcss()],',
    '  // Uncomment this if you are using workers.',
    '  // worker: {',
    '  //  plugins: [],',
    '  // },',
    '  test: {',
    "    name: 'ui',",
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

  if (updatedViteConfigContent !== viteConfigContent) {
    tree.write(viteConfigPath, updatedViteConfigContent);
  }
}

export function normalizeStorybookPreviewFile(tree: Tree, projectRoot: string) {
  const storybookPreviewPath = `${projectRoot}/.storybook/preview.ts`;
  const storybookPreviewContent = tree.read(storybookPreviewPath, 'utf-8');

  if (storybookPreviewContent === null) {
    return;
  }

  const updatedStorybookPreviewContent = [
    "import type { Preview } from '@storybook/vue3';",
    "import { vueRouter } from 'storybook-vue3-router';",
    '',
    "import './styles.css';",
    '',
    'const preview: Preview = {',
    '  parameters: {',
    "    layout: 'centered',",
    '  },',
    '  decorators: [vueRouter()],',
    '};',
    '',
    'export default preview;',
    '',
  ].join('\n');

  if (storybookPreviewContent !== updatedStorybookPreviewContent) {
    tree.write(storybookPreviewPath, updatedStorybookPreviewContent);
  }
}

export function normalizeStorybookTsConfigInclude(
  tree: Tree,
  projectRoot: string,
) {
  const tsConfigPath = `${projectRoot}/tsconfig.storybook.json`;

  if (!tree.exists(tsConfigPath)) {
    return;
  }

  const storybookTsConfigContent = [
    '{',
    '  "extends": "../../../tsconfig.base.json",',
    '  "compilerOptions": {',
    '    "outDir": "out-tsc/storybook",',
    '    "module": "esnext",',
    '    "moduleResolution": "bundler",',
    '    "jsx": "preserve",',
    '    "types": ["vite/client"]',
    '  },',
    '  "exclude": ["src/**/*.spec.ts", "src/**/*.test.ts"],',
    '  "include": [',
    '    "src/**/*.stories.ts",',
    '    "src/**/*.stories.js",',
    '    "src/**/*.stories.jsx",',
    '    "src/**/*.stories.tsx",',
    '    "src/**/*.stories.mdx",',
    '    ".storybook/*.js",',
    '    ".storybook/**/*.ts"',
    '  ],',
    '  "references": [',
    '    {',
    '      "path": "./tsconfig.lib.json"',
    '    }',
    '  ]',
    '}',
    '',
  ].join('\n');

  const currentContent = tree.read(tsConfigPath, 'utf-8');

  if (currentContent !== storybookTsConfigContent) {
    tree.write(tsConfigPath, storybookTsConfigContent + '\n');
  }
}

export function normalizeStorybookMainFile(tree: Tree, projectRoot: string) {
  const storybookMainPath = `${projectRoot}/.storybook/main.ts`;
  const storybookMainContent = tree.read(storybookMainPath, 'utf-8');

  if (!storybookMainContent) {
    return;
  }

  const updatedStorybookMainContent = [
    "import type { StorybookConfig } from '@storybook/vue3-vite';",
    "import { dirname } from 'node:path';",
    "import { fileURLToPath } from 'node:url';",
    '',
    'const config: StorybookConfig = {',
    "  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],",
    '  addons: [],',
    '  framework: {',
    "    name: getAbsolutePath('@storybook/vue3-vite'),",
    '    options: {',
    '      builder: {',
    "        viteConfigPath: 'vite.config.mts',",
    '      },',
    '    },',
    '  },',
    '};',
    '',
    'function getAbsolutePath(value: string): any {',
    '  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));',
    '}',
    '',
    'export default config;',
    '',
    '// To customize your Vite configuration you can use the viteFinal field.',
    '// Check https://storybook.js.org/docs/react/builders/vite#configuration',
    '// and https://nx.dev/recipes/storybook/custom-builder-configs',
    '',
  ].join('\n');

  if (updatedStorybookMainContent !== storybookMainContent) {
    tree.write(storybookMainPath, updatedStorybookMainContent);
  }
}

export function addVueIncludeToTsConfigSpec(tree: Tree, projectRoot: string) {
  const tsConfigPath = `${projectRoot}/tsconfig.spec.json`;

  if (!tree.exists(tsConfigPath)) {
    return;
  }

  updateJson(tree, tsConfigPath, (tsConfig) => {
    const include = Array.isArray(tsConfig.include) ? tsConfig.include : [];

    if (!include.includes('src/**/*.vue')) {
      tsConfig.include = [...include, 'src/**/*.vue'];
    }

    return tsConfig;
  });
}

export function applyGenericLibChanges(
  tree: Tree,
  projectRoot: string,
  packageName: string,
) {
  addCustomRulesToEslintConfig(tree, `${projectRoot}/eslint.config.mjs`);
  addExportsToPackageJson(tree, `${projectRoot}/package.json`, packageName);

  if (tree.exists(`${projectRoot}/vite.config.mts`)) {
    addSetupFilesToViteConfig(tree, `${projectRoot}/vite.config.mts`);
  }
}
