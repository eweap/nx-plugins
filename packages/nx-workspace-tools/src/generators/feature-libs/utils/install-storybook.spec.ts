import { Tree, ensurePackage } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { installStorybook } from './install-storybook';

vi.mock(import('@nx/devkit'), async (importOriginal) => ({
  ...(await importOriginal()),
  ensurePackage: vi.fn(),
}));

describe('installStorybook', () => {
  let tree: Tree;
  const configurationGenerator = vi.fn();

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    vi.resetAllMocks();
    vi.mocked(ensurePackage).mockReturnValue({
      configurationGenerator,
    } as never);
  });

  it('should install storybook configuration for project', async () => {
    await installStorybook(tree, 'my-project');

    expect(ensurePackage).toHaveBeenCalledWith('@nx/storybook', '23.1.1');
    expect(configurationGenerator).toHaveBeenCalledWith(tree, {
      addPlugin: true,
      project: 'my-project',
    });
  });
});
