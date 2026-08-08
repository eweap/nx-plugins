import {
  type Tree,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  joinPathFragments,
} from '@nx/devkit';

import type { LibGeneratorSchema } from './schema';

export async function featureLibsGenerator(
  tree: Tree,
  options: LibGeneratorSchema,
) {
  const projectRoot = joinPathFragments('libs', options.name);

  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: joinPathFragments(projectRoot, 'src'),
    targets: {},
  });

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    projectRoot,
    options,
  );

  await formatFiles(tree);
}

export default featureLibsGenerator;
