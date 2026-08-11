import { libraryGenerator as jsLibraryGenerator } from '@nx/js';
import { libraryGenerator as vueLibraryGenerator } from '@nx/vue';

import { BASE_CONTEXT } from './contexts';

export const JS_LIBRARY_GENERATOR_CONFIG = {
  directory: 'libs/my-ressources',
  linter: 'eslint',
  name: BASE_CONTEXT.projectName,
  unitTestRunner: 'vitest',
  importPath: BASE_CONTEXT.packageName,
  tags: 'type:feature',
  addPlugin: true,
  useProjectJson: false,
} satisfies Parameters<typeof jsLibraryGenerator>[1];

export const VUE_LIBRARY_GENERATOR_CONFIG = {
  directory: 'libs/my-ressources',
  bundler: 'none',
  linter: 'eslint',
  name: BASE_CONTEXT.projectName,
  unitTestRunner: 'vitest',
  importPath: BASE_CONTEXT.packageName,
  tags: 'type:feature',
  addPlugin: true,
  useProjectJson: false,
} satisfies Parameters<typeof vueLibraryGenerator>[1];
