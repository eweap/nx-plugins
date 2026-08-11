import { Tree, updateJson } from '@nx/devkit';

import { LibraryContext } from '../utils/context';
import { createFilePatch, patchFile } from '../utils/patch-file';

export function patchVueInclude({ tree, path }: { tree: Tree; path: string }) {
  updateJson(tree, path, (tsConfig) => {
    const include = Array.isArray(tsConfig.include) ? tsConfig.include : [];

    if (!include.includes('src/**/*.vue')) {
      tsConfig.include = [...include, 'src/**/*.vue'];
    }

    return tsConfig;
  });
}

export function patchTsConfigSpec(tree: Tree, context: LibraryContext) {
  const patches = [createFilePatch(patchVueInclude)];

  patchFile(tree, `${context.projectRoot}/tsconfig.spec.json`, patches);
}
