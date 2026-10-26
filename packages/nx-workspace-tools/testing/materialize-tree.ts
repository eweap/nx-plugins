import { Tree } from '@nx/devkit';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

function isNxMetadataPath(path: string): boolean {
  // Tree paths may start with a slash; .nx is relative to the workspace root.
  const workspaceRelativePath = path.replace(/^[\\/]+/, '');
  return (
    workspaceRelativePath === '.nx' || workspaceRelativePath.startsWith('.nx/')
  );
}

export async function withMaterializedTree<T>(
  tree: Tree,
  inspect: (directory: string) => T | Promise<T>,
): Promise<T> {
  const directory = await mkdtemp(join(tmpdir(), 'nx-tree-snapshot-'));

  try {
    const filePaths = tree
      .listChanges()
      .filter(({ path, type }) => type !== 'DELETE' && !isNxMetadataPath(path))
      .map(({ path }) => path);

    filePaths.sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));

    for (const filePath of filePaths) {
      const relativeFilePath = filePath.replace(/^[\\/]+/, '');
      const outputPath = resolve(directory, relativeFilePath);
      const outputRelativePath = relative(directory, outputPath);

      if (
        !outputRelativePath ||
        outputRelativePath === '..' ||
        outputRelativePath.startsWith(`..${sep}`) ||
        isAbsolute(outputRelativePath)
      ) {
        throw new Error(`Tree path escapes snapshot directory: ${filePath}`);
      }

      const content = tree.read(relativeFilePath);
      if (content === null) {
        throw new Error(`Unable to read Tree file: ${filePath}`);
      }

      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, content);
    }

    return await inspect(directory);
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}
