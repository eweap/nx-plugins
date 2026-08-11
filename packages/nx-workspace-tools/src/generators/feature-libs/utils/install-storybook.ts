import { Tree, ensurePackage } from '@nx/devkit';

export async function installStorybook(tree: Tree, project: string) {
  const nxVueVersion = require('@nx/vue/package.json').version as string;

  const { configurationGenerator } = ensurePackage(
    '@nx/storybook',
    nxVueVersion,
  );

  await configurationGenerator(tree, {
    addPlugin: true,
    project,
  });
}
