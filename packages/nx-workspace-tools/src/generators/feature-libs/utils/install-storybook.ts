import { Tree } from '@nx/devkit';
import { storybookConfigurationGenerator } from '@nx/vue';

export async function installStorybook(tree: Tree, project: string) {
  await storybookConfigurationGenerator(tree, {
    generateStories: false,
    project,
  });
}
