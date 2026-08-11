import { Tree } from '@nx/devkit';

import { LibraryContext } from '../utils/context';
import { patchEslintConfig } from './eslint-config-mjs.patch';
import { patchPackageJson } from './package-json.patch';

export function runGenericPatch(tree: Tree, context: LibraryContext) {
  patchEslintConfig(tree, context);
  patchPackageJson(tree, context);
}
