import { Tree } from '@nx/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';

import { BASE_CONTEXT } from '../../../../testing/contexts';
import { JS_LIBRARY_GENERATOR_CONFIG } from '../../../../testing/generator-config';
import { createVueWorkspaceTree } from '../../../../testing/vue-workspace';
import { patchPackageJson } from './package-json.patch';

describe('patchPackageJson', () => {
  let tree: Tree;
  const packageJsonPath = `${JS_LIBRARY_GENERATOR_CONFIG.directory}/package.json`;

  it('should patch the package json file with inferred task', async () => {
    tree = await createVueWorkspaceTree({
      useProjectJson: false,
    });
    await jsLibraryGenerator(tree, JS_LIBRARY_GENERATOR_CONFIG);

    patchPackageJson(tree, {
      ...BASE_CONTEXT,
      projectRoot: JS_LIBRARY_GENERATOR_CONFIG.directory,
      useProjectJson: false,
    });

    const packageJson = tree.read(packageJsonPath, 'utf-8');

    await expect(packageJson).toMatchSnapshot();
  });

  it('should patch the package json file without inferred task', async () => {
    tree = await createVueWorkspaceTree({
      useProjectJson: true,
    });
    await jsLibraryGenerator(tree, JS_LIBRARY_GENERATOR_CONFIG);

    patchPackageJson(tree, {
      ...BASE_CONTEXT,
      projectRoot: JS_LIBRARY_GENERATOR_CONFIG.directory,
      useProjectJson: true,
    });

    const packageJson = tree.read(packageJsonPath, 'utf-8');

    await expect(packageJson).toMatchSnapshot();
  });
});
