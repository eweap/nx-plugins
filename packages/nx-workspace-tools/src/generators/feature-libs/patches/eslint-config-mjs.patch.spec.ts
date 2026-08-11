import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator as vueLibraryGenerator } from '@nx/vue';

import { LibraryContext } from '../utils/context';
import { patchEslintConfig } from './eslint-config-mjs.patch';

describe('patchEslintConfig', () => {
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

  it('should patch the eslint config file', async () => {
    patchEslintConfig(tree, CONTEXT);

    const eslintConfig = tree.read(
      `${CONTEXT.projectRoot}/eslint.config.mjs`,
      'utf-8',
    );

    await expect(eslintConfig).toMatchFileSnapshot(
      '../__snapshots__/feature/eslint.config.mjs',
    );
  });
});
