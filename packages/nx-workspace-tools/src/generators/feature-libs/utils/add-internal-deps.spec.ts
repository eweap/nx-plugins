import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { addInternalDepsToPackageJson } from './add-internal-deps';
import { LibraryContext } from './context';

describe('addInternalDepsToPackageJson', () => {
  let tree: Tree;

  const baseContext: Omit<
    LibraryContext,
    'projectRoot' | 'projectName' | 'packageName' | 'libTypes'
  > = {
    workspacePrefix: '@test',
    useProjectJson: false,
  };

  function writePackageJson(packageJson: Record<string, unknown>) {
    tree.write(
      'libs/my-ressources/feature/package.json',
      JSON.stringify(packageJson, null, 2),
    );
  }

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add internal dependencies for the selected library types', () => {
    writePackageJson({
      name: '@test/my-ressources',
      version: '0.0.1',
    });

    addInternalDepsToPackageJson(tree, {
      ...baseContext,
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
      projectRoot: 'libs/my-ressources/feature',
      projectName: 'my-ressources',
      packageName: '@test/my-ressources',
    });

    const packageJson = JSON.parse(
      tree.read('libs/my-ressources/feature/package.json', 'utf-8') as string,
    );

    expect(packageJson.devDependencies).toEqual({
      '@test/my-ressources-data-access': 'workspace:*',
      '@test/my-ressources-ui': 'workspace:*',
      '@test/my-ressources-types': 'workspace:*',
      '@test/my-ressources-util': 'workspace:*',
    });
  });

  it('should not add the current package as an internal dependency', () => {
    writePackageJson({
      name: '@test/my-ressources-data-access',
      version: '0.0.1',
      devDependencies: {
        lodash: '^4.17.21',
      },
    });

    addInternalDepsToPackageJson(tree, {
      ...baseContext,
      libTypes: ['data-access'],
      projectRoot: 'libs/my-ressources/feature',
      projectName: 'my-ressources',
      packageName: '@test/my-ressources-data-access',
    });

    const packageJson = JSON.parse(
      tree.read('libs/my-ressources/feature/package.json', 'utf-8') as string,
    );

    expect(packageJson.devDependencies).toEqual({});
  });
});
