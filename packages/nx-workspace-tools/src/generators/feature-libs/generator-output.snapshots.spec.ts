import { Tree } from '@nx/devkit';
import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

import { withMaterializedTree } from '../../../testing/materialize-tree';
import { createVueWorkspaceTree } from '../../../testing/vue-workspace';
import featureLibsGenerator from './feature-libs';
import { FeatureLibsGeneratorSchema } from './schema';
import { LibraryType, createLibraryContext } from './utils/context';
import { installStorybook } from './utils/install-storybook';
import { generateNxLibrary } from './utils/library-generators';

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
    await generateNxLibrary(tree, context, libraryType);

    if (libraryType === 'feature' || libraryType === 'ui') {
      await installStorybook(tree, context.projectName);
    }
  }
}

async function removeTransientNxMetadataFromSnapshots() {
  const snapshotsDirectory = join(__dirname, '__snapshots__');
  const snapshots = await readdir(snapshotsDirectory, {
    withFileTypes: true,
  });

  await Promise.all(
    snapshots
      .filter((snapshot) => snapshot.isDirectory())
      .map((snapshot) =>
        rm(join(snapshotsDirectory, snapshot.name, '.nx'), {
          recursive: true,
          force: true,
        }),
      ),
  );
}

describe('feature libs generator directory snapshots', () => {
  let rawTree: Tree;
  let finalTree: Tree;

  beforeAll(async () => {
    rawTree = await createVueWorkspaceTree();
    finalTree = await createVueWorkspaceTree();
  });

  it('captures raw output', async () => {
    await generateRawNxOutput(rawTree);
    await removeTransientNxMetadataFromSnapshots();

    await withMaterializedTree(rawTree, (directory) =>
      expect(directory).toMatchDirSnapshot('nx-generators-raw'),
    );
  }, 120_000);

  it('captures patched output', async () => {
    await featureLibsGenerator(finalTree, options);
    await removeTransientNxMetadataFromSnapshots();

    await withMaterializedTree(finalTree, (directory) =>
      expect(directory).toMatchDirSnapshot('feature-libs-final'),
    );
  }, 120_000);
});
