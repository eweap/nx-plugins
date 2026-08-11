import { Tree, updateJson } from '@nx/devkit';

import { LibraryContext } from '../utils/context';
import { createFilePatch, patchFile } from '../utils/patch-file';

export function patchAddExports({ tree, path }: { tree: Tree; path: string }) {
  updateJson(tree, path, (pkgJson) => {
    pkgJson.exports = {
      '.': {
        types: './src/index.ts',
        import: './src/index.ts',
        default: './src/index.ts',
      },
    };
    pkgJson.devDependencies = {};

    return pkgJson;
  });
}

export function patchPackageJson(tree: Tree, context: LibraryContext) {
  const patches = [createFilePatch(patchAddExports)];

  patchFile(tree, `${context.projectRoot}/package.json`, patches);
}
