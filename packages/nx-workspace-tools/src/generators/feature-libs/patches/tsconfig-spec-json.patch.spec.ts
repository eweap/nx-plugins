import { Tree } from '@nx/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';

import { BASE_CONTEXT } from '../../../../testing/contexts';
import { JS_LIBRARY_GENERATOR_CONFIG } from '../../../../testing/generator-config';
import { createVueWorkspaceTree } from '../../../../testing/vue-workspace';
import { patchTsConfigSpec } from './tsconfig-spec-json.patch';

describe('patchTsConfigSpec', () => {
  let tree: Tree;
  const tsConfigSpecPath = `${JS_LIBRARY_GENERATOR_CONFIG.directory}/tsconfig.spec.json`;

  beforeEach(async () => {
    tree = await createVueWorkspaceTree();
    await jsLibraryGenerator(tree, JS_LIBRARY_GENERATOR_CONFIG);
  });

  it('should patch the tsconfig spec file', async () => {
    patchTsConfigSpec(tree, {
      ...BASE_CONTEXT,
      projectRoot: JS_LIBRARY_GENERATOR_CONFIG.directory,
    });

    const tsConfigSpec = tree.read(tsConfigSpecPath, 'utf-8');

    await expect(tsConfigSpec).toMatchSnapshot();
  });
});
