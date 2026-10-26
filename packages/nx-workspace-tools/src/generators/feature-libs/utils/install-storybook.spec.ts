import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { storybookConfigurationGenerator } from '@nx/vue';

import { installStorybook } from './install-storybook';

vi.mock(import('@nx/vue'), async (importOriginal) => ({
  ...(await importOriginal()),
  storybookConfigurationGenerator: vi.fn(),
}));

describe('installStorybook', () => {
  let tree: Tree;
  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    vi.resetAllMocks();
  });

  it('should install storybook configuration for project', async () => {
    await installStorybook(tree, 'my-project');

    expect(storybookConfigurationGenerator).toHaveBeenCalledWith(tree, {
      generateStories: false,
      project: 'my-project',
    });
  });
});
