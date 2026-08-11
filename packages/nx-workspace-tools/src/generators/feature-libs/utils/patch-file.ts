import { Tree } from '@nx/devkit';

type FilePatchInput = {
  tree: Tree;
  path: string;
  content: string;
};

export interface FilePatch<
  TArgs extends readonly unknown[] = readonly unknown[],
> {
  patchFn(input: FilePatchInput, ...args: TArgs): string | void;
  patchArgs: TArgs;
}

export function createFilePatch<TArgs extends readonly unknown[]>(
  patchFn: (input: FilePatchInput, ...args: TArgs) => string | void,
  ...args: TArgs
): FilePatch<TArgs> {
  return { patchFn, patchArgs: args };
}

export function patchFile<const TPatches extends readonly FilePatch[]>(
  tree: Tree,
  path: string,
  filePatches: TPatches,
) {
  const fileContent = tree.read(path, 'utf-8');

  if (!fileContent) {
    return;
  }

  let newFileContent = fileContent;

  filePatches.forEach((filePatch) => {
    const newContent = filePatch.patchFn(
      {
        tree,
        path,
        content: newFileContent,
      },
      ...filePatch.patchArgs,
    );

    // Some patches mutate the tree directly instead of returning new content.
    if (newContent) {
      newFileContent = newContent;
    }
  });

  if (newFileContent !== fileContent) {
    tree.write(path, newFileContent);
  }
}
