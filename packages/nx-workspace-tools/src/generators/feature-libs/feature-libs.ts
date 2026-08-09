import { Tree } from '@nx/devkit';

import { FeatureLibsGeneratorSchema } from './schema';
import {
  generateDataAccessLib,
  generateFeatureLib,
  generateTypesLib,
  generateUILib,
  generateUtilLib,
} from './utils/library-generators';

export {
  generateDataAccessLib,
  generateFeatureLib,
  generateTypesLib,
  generateUILib,
  generateUtilLib,
} from './utils/library-generators';
export { createLibraryContext } from './utils/context';

export default async function featureLibsGenerator(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const selectedLibraryTypes = new Set(options.libTypes);

  if (selectedLibraryTypes.has('feature')) {
    await generateFeatureLib(tree, options);
  }

  if (selectedLibraryTypes.has('data-access')) {
    await generateDataAccessLib(tree, options);
  }

  if (selectedLibraryTypes.has('ui')) {
    await generateUILib(tree, options);
  }

  if (selectedLibraryTypes.has('types')) {
    await generateTypesLib(tree, options);
  }

  if (selectedLibraryTypes.has('util')) {
    await generateUtilLib(tree, options);
  }
}
