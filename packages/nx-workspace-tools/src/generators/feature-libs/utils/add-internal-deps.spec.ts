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
      'libs/my-resources/feature/package.json',
      JSON.stringify(packageJson, null, 2),
    );
  }

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add internal dependencies for the selected library types', () => {
    writePackageJson({
      name: '@test/my-resources',
      version: '0.0.1',
    });

    addInternalDepsToPackageJson(tree, {
      ...baseContext,
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
      projectRoot: 'libs/my-resources/feature',
      projectName: 'my-resources',
      packageName: '@test/my-resources',
    });

    const packageJson = JSON.parse(
      tree.read('libs/my-resources/feature/package.json', 'utf-8') as string,
    );

    expect(packageJson.devDependencies).toEqual({
      '@test/my-resources-data-access': 'workspace:*',
      '@test/my-resources-ui': 'workspace:*',
      '@test/my-resources-types': 'workspace:*',
      '@test/my-resources-util': 'workspace:*',
    });
  });

  it('should not add the current package as an internal dependency', () => {
    writePackageJson({
      name: '@test/my-resources-data-access',
      version: '0.0.1',
      devDependencies: {
        lodash: '^4.17.21',
      },
    });

    addInternalDepsToPackageJson(tree, {
      ...baseContext,
      libTypes: ['data-access'],
      projectRoot: 'libs/my-resources/feature',
      projectName: 'my-resources',
      packageName: '@test/my-resources-data-access',
    });

    const packageJson = JSON.parse(
      tree.read('libs/my-resources/feature/package.json', 'utf-8') as string,
    );

    expect(packageJson.devDependencies).toEqual({});
  });
});
