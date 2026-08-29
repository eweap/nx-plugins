import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { createFilePatch, patchFile } from './patch-file';

describe('createFilePatch', () => {
  it('should keep the patch function and arguments together', () => {
    const patchFn = vi.fn();

    const patch = createFilePatch(patchFn, 'suffix', 42);

    expect(patch.patchFn).toBe(patchFn);
    expect(patch.patchArgs).toEqual(['suffix', 42]);
  });
});

describe('patchFile', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should write the updated content returned by patches', () => {
    tree.write('libs/my-lib/file.txt', 'hello');

    patchFile(tree, 'libs/my-lib/file.txt', [
      createFilePatch(({ content }) => content.replace('hello', 'hi')),
    ]);

    expect(tree.read('libs/my-lib/file.txt', 'utf-8')).toBe('hi');
  });

  it('should pass the latest content to each patch in order', () => {
    tree.write('libs/my-lib/file.txt', 'hello');

    const firstPatch = createFilePatch(({ content }) => `${content} world`);
    const secondPatch = createFilePatch(({ content }) => `${content}!`);

    patchFile(tree, 'libs/my-lib/file.txt', [firstPatch, secondPatch]);

    expect(tree.read('libs/my-lib/file.txt', 'utf-8')).toBe('hello world!');
  });

  it('should support patches that mutate the tree directly', () => {
    tree.write('libs/my-lib/file.txt', 'hello');

    patchFile(tree, 'libs/my-lib/file.txt', [
      createFilePatch(({ tree: currentTree, path }) => {
        currentTree.write(path, 'updated');
      }),
    ]);

    expect(tree.read('libs/my-lib/file.txt', 'utf-8')).toBe('updated');
  });

  it('should do nothing when the file does not exist', () => {
    const patchFn = vi.fn();

    patchFile(tree, 'libs/my-lib/missing.txt', [createFilePatch(patchFn)]);

    expect(patchFn).not.toHaveBeenCalled();
    expect(tree.exists('libs/my-lib/missing.txt')).toBe(false);
  });
});
