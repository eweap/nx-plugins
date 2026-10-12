import { Tree } from '@nx/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';
import { libraryGenerator as vueLibraryGenerator } from '@nx/vue';

import { withMaterializedTree } from '../../../testing/materialize-tree';
import { createVueWorkspaceTree } from '../../../testing/vue-workspace';
import featureLibsGenerator from './feature-libs';
import { FeatureLibsGeneratorSchema } from './schema';
import { LibraryType, createLibraryContext } from './utils/context';

// v0.7.1 targets Vitest 4's Matchers declaration; mirror Vitest 5's signature locally.
declare module 'vitest' {
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown,
  > {
    toMatchDirSnapshot(this: Matchers<R, T>, hint?: string): R;
  }
}

const libraryTypes: LibraryType[] = [
  'feature',
  'data-access',
  'types',
  'ui',
  'util',
];

const options = {
  libsPath: 'libs/my-resources',
  libTypes: libraryTypes,
  resourceNamePlural: 'my-resources',
  resourceNameSingular: 'my-resource',
  useProjectJson: false,
  workspacePrefix: '@test',
} satisfies FeatureLibsGeneratorSchema;

async function generateRawNxOutput(tree: Tree) {
  for (const libraryType of libraryTypes) {
    const context = createLibraryContext(options, libraryType);
    const generatorOptions = {
      directory: context.projectRoot,
      linter: 'eslint',
      name: context.projectName,
      unitTestRunner: 'vitest',
      importPath: context.packageName,
      tags: `type:${libraryType}`,
      addPlugin: true,
      useProjectJson: context.useProjectJson,
    } as const;

    if (libraryType === 'feature' || libraryType === 'ui') {
      await vueLibraryGenerator(tree, generatorOptions);
    } else {
      await jsLibraryGenerator(tree, generatorOptions);
    }
  }
}

describe('feature libs generator directory snapshots', () => {
  let rawTree: Tree;
  let finalTree: Tree;

  beforeAll(async () => {
    rawTree = await createVueWorkspaceTree();
    finalTree = await createVueWorkspaceTree();
  });

  it('captures raw output from the Nx library generators', async () => {
    await generateRawNxOutput(rawTree);

    await withMaterializedTree(rawTree, (directory) =>
      expect(directory).toMatchDirSnapshot('nx-generators-raw'),
    );
  });

  it('captures final output from the feature libs generator', async () => {
    await featureLibsGenerator(finalTree, options);

    await withMaterializedTree(finalTree, (directory) =>
      expect(directory).toMatchDirSnapshot('feature-libs-final'),
    );
  });
});
