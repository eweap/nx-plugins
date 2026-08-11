import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';

import { LibraryContext } from '../utils/context';
import { patchPackageJson } from './package-json.patch';

describe('patchPackageJson', () => {
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
  } satisfies Parameters<typeof jsLibraryGenerator>[1];

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();

    vi.resetAllMocks();

    await jsLibraryGenerator(tree, GENERATOR_CONFIG);
  });

  it('should patch the package json file', async () => {
    patchPackageJson(tree, CONTEXT);

    const packageJson = tree.read(
      `${CONTEXT.projectRoot}/package.json`,
      'utf-8',
    );

    await expect(packageJson).toMatchFileSnapshot(
      '../__snapshots__/feature/package.json',
    );
  });
});
