import { Tree } from '@nx/devkit';
import { libraryGenerator as vueLibraryGenerator } from '@nx/vue';

import { BASE_CONTEXT } from '../../../../testing/contexts';
import {
  JS_LIBRARY_GENERATOR_CONFIG,
  VUE_LIBRARY_GENERATOR_CONFIG,
} from '../../../../testing/generator-config';
import { createVueWorkspaceTree } from '../../../../testing/vue-workspace';
import { patchEslintConfig } from './eslint-config-mjs.patch';

describe('patchEslintConfig', () => {
  let tree: Tree;
  const eslintConfigPath = `${VUE_LIBRARY_GENERATOR_CONFIG.directory}/eslint.config.mjs`;

  beforeEach(async () => {
    tree = await createVueWorkspaceTree();
    await vueLibraryGenerator(tree, VUE_LIBRARY_GENERATOR_CONFIG);
  });

  it('should patch the eslint config file', async () => {
    patchEslintConfig(tree, {
      ...BASE_CONTEXT,
      projectRoot: JS_LIBRARY_GENERATOR_CONFIG.directory,
    });

    const eslintConfig = tree.read(eslintConfigPath, 'utf-8');

    await expect(eslintConfig).toMatchSnapshot();
  });
});
