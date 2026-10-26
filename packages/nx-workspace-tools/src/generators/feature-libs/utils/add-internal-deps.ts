import { Tree, updateJson } from '@nx/devkit';

import { LibraryContext } from './context';

export function addInternalDepsToPackageJson(
  tree: Tree,
  {
    projectRoot,
    projectName,
    packageName,
    libTypes,
    workspacePrefix,
  }: LibraryContext,
) {
  const packageJsonPath = `${projectRoot}/package.json`;

  updateJson(tree, packageJsonPath, (pkgJson) => {
    pkgJson.dependencies = {};
    delete pkgJson.devDependencies;

    const selectedLibraryTypes = new Set(libTypes);

    if (
      selectedLibraryTypes.has('feature') &&
      packageName !== `${workspacePrefix}/${projectName}`
    ) {
      pkgJson.dependencies[`${workspacePrefix}/${projectName}`] = 'workspace:*';
    }

    if (
      selectedLibraryTypes.has('data-access') &&
      packageName !== `${workspacePrefix}/${projectName}-data-access`
    ) {
      pkgJson.dependencies[`${workspacePrefix}/${projectName}-data-access`] =
        'workspace:*';
    }

    if (
      selectedLibraryTypes.has('ui') &&
      packageName !== `${workspacePrefix}/${projectName}-ui`
    ) {
      pkgJson.dependencies[`${workspacePrefix}/${projectName}-ui`] =
        'workspace:*';
    }

    if (
      selectedLibraryTypes.has('types') &&
      packageName !== `${workspacePrefix}/${projectName}-types`
    ) {
      pkgJson.dependencies[`${workspacePrefix}/${projectName}-types`] =
        'workspace:*';
    }

    if (
      selectedLibraryTypes.has('util') &&
      packageName !== `${workspacePrefix}/${projectName}-util`
    ) {
      pkgJson.dependencies[`${workspacePrefix}/${projectName}-util`] =
        'workspace:*';
    }

    return pkgJson;
  });
}
