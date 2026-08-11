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

export function patchCacheDirViteConfig(
  input: { content: string },
  context: {
    projectPath: string;
  },
) {
  return input.content.replace(
    /^\s*cacheDir:\s*['"][^'"]+['"],$/m,
    `  cacheDir: '../../../node_modules/.vite/${context.projectPath}',`,
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
    /^\s*plugins:\s*\[(.*)\],$/m,
    (fullMatch, pluginList: string) => {
      if (
        !pluginList.includes('vue()') ||
        pluginList.includes('tailwindcss()')
      ) {
        return fullMatch;
      }

      return fullMatch.replace('vue()', 'vue(), tailwindcss()');
    },
  );

  return updatedViteConfigContent;
}

export function patchViteConfig(
  tree: Tree,
  context: LibraryContext,
  options: { hasComponents: boolean },
) {
  const patches = [
    createFilePatch(patchTestSetupViteConfig),
    createFilePatch(patchCacheDirViteConfig, {
      projectPath: context.projectRoot,
    }),
    createFilePatch(patchNameViteConfig, {
      projectName: context.projectName,
    }),
  ];

  if (options.hasComponents) {
    patches.push(createFilePatch(patchTailwindVitePluginViteConfig));
  }

  patchFile(tree, `${context.projectRoot}/vite.config.mts`, patches);
}
