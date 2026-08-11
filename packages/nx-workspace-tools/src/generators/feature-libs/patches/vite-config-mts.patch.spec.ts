import { Tree } from '@nx/devkit';
import { libraryGenerator as vueLibraryGenerator } from '@nx/vue';

import { BASE_CONTEXT } from '../../../../testing/contexts';
import { VUE_LIBRARY_GENERATOR_CONFIG } from '../../../../testing/generator-config';
import { createVueWorkspaceTree } from '../../../../testing/vue-workspace';
import { patchViteConfig } from './vite-config-mts.patch';

describe('patchViteConfig', () => {
  let tree: Tree;
  const vueConfigPath = `${VUE_LIBRARY_GENERATOR_CONFIG.directory}/vite.config.mts`;

  beforeEach(async () => {
    tree = await createVueWorkspaceTree();
    await vueLibraryGenerator(tree, VUE_LIBRARY_GENERATOR_CONFIG);
  });

  it('should patch the vite config file for lib with components', async () => {
    patchViteConfig(
      tree,
      {
        ...BASE_CONTEXT,
        projectRoot: VUE_LIBRARY_GENERATOR_CONFIG.directory,
      },
      { hasComponents: true },
    );

    const viteConfig = tree.read(vueConfigPath, 'utf-8');

    await expect(viteConfig).toMatchSnapshot();
  });

  it('should patch the vite config file for lib without components', async () => {
    patchViteConfig(
      tree,
      {
        ...BASE_CONTEXT,
        projectRoot: VUE_LIBRARY_GENERATOR_CONFIG.directory,
      },
      { hasComponents: false },
    );

    const viteConfig = tree.read(vueConfigPath, 'utf-8');

    await expect(viteConfig).toMatchSnapshot();
  });
});
