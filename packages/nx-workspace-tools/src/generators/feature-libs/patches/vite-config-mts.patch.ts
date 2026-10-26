import { Tree } from '@nx/devkit';

import { LibraryContext } from '../utils/context';
import { createFilePatch, patchFile } from '../utils/patch-file';

export function patchTestSetupViteConfig(input: { content: string }) {
  const output = input.content.replace(
    /(\s+environment:\s+["']jsdom["'],\n)/,
    '$1    setupFiles: ["test-setup.ts"],\n',
  );

  return output;
}

export function patchTestSetupVitestConfig(input: { content: string }) {
  return input.content.replace(
    /(\s+environment:\s+["']node["'],\n)(?!\s*setupFiles:)/,
    "$1    setupFiles: ['test-setup.ts'],\n",
  );
}

export function patchNameViteConfig(
  input: { content: string },
  context: { projectName: string },
) {
  return input.content.replace(
    /^\s*name:\s*['"][^'"]+['"],$/m,
    `    name: '${context.projectName}',`,
  );
}

export function patchTailwindVitePluginViteConfig(input: { content: string }) {
  let updatedViteConfigContent = input.content;
  // Leave Nx's config unchanged when it does not declare a plugin list.
  const pluginsLine = /^([ \t]*)plugins:[ \t]*\[([^\]]*)\],[ \t]*$/m;
  const pluginsMatch = updatedViteConfigContent.match(pluginsLine);

  if (!pluginsMatch) {
    return input.content;
  }

  if (
    !updatedViteConfigContent.includes("import vue from '@vitejs/plugin-vue';")
  ) {
    updatedViteConfigContent = updatedViteConfigContent.replace(
      /^(?:(?:\/\/\/.*|import .*)\n)+/,
      (imports) => `${imports}import vue from '@vitejs/plugin-vue';\n`,
    );
  }

  if (
    !updatedViteConfigContent.includes(
      "import tailwindcss from '@tailwindcss/vite';",
    )
  ) {
    updatedViteConfigContent = updatedViteConfigContent.replace(
      /^(?:(?:\/\/\/.*|import .*)\n)+/,
      (imports) => `${imports}import tailwindcss from '@tailwindcss/vite';\n`,
    );
  }

  // Keep Vue first and add Tailwind only when missing.
  const plugins = pluginsMatch[2]
    .split(',')
    .map((plugin) => plugin.trim())
    .filter(Boolean);

  if (!plugins.includes('vue()')) {
    plugins.unshift('vue()');
  }
  if (!plugins.includes('tailwindcss()')) {
    plugins.push('tailwindcss()');
  }

  updatedViteConfigContent = updatedViteConfigContent.replace(
    pluginsLine,
    `${pluginsMatch[1]}plugins: [${plugins.join(', ')}],`,
  );

  return updatedViteConfigContent;
}

export function patchViteConfig(
  tree: Tree,
  context: LibraryContext,
  options: { hasComponents: boolean },
) {
  const configFileName = tree.exists(`${context.projectRoot}/vite.config.mts`)
    ? 'vite.config.mts'
    : 'vitest.config.mts';
  const isVitestConfig = configFileName === 'vitest.config.mts';
  const patches = [
    createFilePatch(
      isVitestConfig ? patchTestSetupVitestConfig : patchTestSetupViteConfig,
    ),
    createFilePatch(patchNameViteConfig, {
      projectName: context.projectName,
    }),
  ];

  if (options.hasComponents) {
    patches.push(createFilePatch(patchTailwindVitePluginViteConfig));
  }

  patchFile(tree, `${context.projectRoot}/${configFileName}`, patches);
}
