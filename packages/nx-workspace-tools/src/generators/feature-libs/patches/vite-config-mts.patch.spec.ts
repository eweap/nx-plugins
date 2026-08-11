import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator as vueLibraryGenerator } from '@nx/vue';

import { LibraryContext } from '../utils/context';
import { patchViteConfig } from './vite-config-mts.patch';

describe('patchViteConfig', () => {
  let tree: Tree;
  const CONTEXT: LibraryContext = {
    libTypes: [],
    packageName: `@test/my-ressources`,
    projectName: `my-ressources`,
    projectRoot: `libs/my-ressources/feature`,
    workspacePrefix: '@test',
  };
  const GENERATOR_CONFIG = {
    directory: CONTEXT.projectRoot,
    linter: 'eslint',
    name: CONTEXT.projectName,
    unitTestRunner: 'vitest',
    importPath: CONTEXT.packageName,
    tags: 'type:feature',
    addPlugin: true,
    useProjectJson: false,
  } satisfies Parameters<typeof vueLibraryGenerator>[1];

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();

    vi.resetAllMocks();

    await vueLibraryGenerator(tree, GENERATOR_CONFIG);
  });

  it('should patch the vite config file', async () => {
    patchViteConfig(tree, CONTEXT, { hasComponents: true });

    const viteConfig = tree.read(
      `${CONTEXT.projectRoot}/vite.config.mts`,
      'utf-8',
    );

    await expect(viteConfig).toMatchFileSnapshot(
      '../__snapshots__/feature/vite.config.mts',
    );
  });
});
