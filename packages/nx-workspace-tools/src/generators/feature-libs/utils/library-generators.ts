import { Tree, generateFiles } from '@nx/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';
import { libraryGenerator as vueLibraryGenerator } from '@nx/vue';
import { camelCase } from 'lodash-es';
import * as path from 'path';

import { runGenericPatch } from '../patches/generic';
import { patchTsConfigSpec } from '../patches/tsconfig-spec-json.patch';
import { patchViteConfig } from '../patches/vite-config-mts.patch';
import { FeatureLibsGeneratorSchema } from '../schema';
import { addInternalDepsToPackageJson } from './add-internal-deps';
import { createLibraryContext } from './context';
import { installStorybook } from './install-storybook';
import { toUpperSnakeCase } from './string-helpers';

function applyLibFileTemplates(
  tree: Tree,
  templateFolder: string,
  projectRoot: string,
  context: Record<string, unknown>,
) {
  generateFiles(
    tree,
    path.join(__dirname, '..', 'files', templateFolder),
    projectRoot,
    context,
  );
}

export async function generateFeatureLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'feature');

  await vueLibraryGenerator(tree, {
    directory: context.projectRoot,
    linter: 'eslint',
    name: context.projectName,
    unitTestRunner: 'vitest',
    importPath: context.packageName,
    tags: 'type:feature',
    addPlugin: true,
    useProjectJson: context.useProjectJson,
  });

  await installStorybook(tree, context.projectName);

  // Apply patches
  runGenericPatch(tree, context);
  patchViteConfig(tree, context, { hasComponents: true });
  patchTsConfigSpec(tree, context);

  // Install internal deps
  addInternalDepsToPackageJson(tree, context);

  // Apply file templates
  applyLibFileTemplates(tree, 'feature', context.projectRoot, {
    ...options,
    camelCase,
    workspacePrefix: context.workspacePrefix,
    libTypes: context.libTypes,
  });
}

export async function generateDataAccessLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'data-access');

  await jsLibraryGenerator(tree, {
    directory: context.projectRoot,
    linter: 'eslint',
    name: context.projectName,
    unitTestRunner: 'vitest',
    importPath: context.packageName,
    tags: 'type:data-access',
    addPlugin: true,
    useProjectJson: context.useProjectJson,
  });

  // Apply patches
  runGenericPatch(tree, context);
  patchViteConfig(tree, context, { hasComponents: false });

  // Apply file templates
  applyLibFileTemplates(tree, 'data-access', context.projectRoot, {
    ...options,
    uppercase: toUpperSnakeCase,
  });
}

export async function generateTypesLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'types');

  await jsLibraryGenerator(tree, {
    directory: context.projectRoot,
    linter: 'eslint',
    name: context.projectName,
    unitTestRunner: 'vitest',
    importPath: context.packageName,
    tags: 'type:types',
    addPlugin: true,
    useProjectJson: context.useProjectJson,
  });

  // Apply patches
  runGenericPatch(tree, context);

  // Apply file templates
  applyLibFileTemplates(tree, 'types', context.projectRoot, {
    ...options,
  });
}

export async function generateUiLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'ui');

  await vueLibraryGenerator(tree, {
    directory: context.projectRoot,
    linter: 'eslint',
    name: context.projectName,
    unitTestRunner: 'vitest',
    importPath: context.packageName,
    tags: 'type:ui',
    addPlugin: true,
    useProjectJson: context.useProjectJson,
  });

  await installStorybook(tree, context.projectName);

  // Apply patches
  runGenericPatch(tree, context);
  patchViteConfig(tree, context, { hasComponents: true });
  patchTsConfigSpec(tree, context);

  // Apply file templates
  applyLibFileTemplates(tree, 'ui', context.projectRoot, {
    ...options,
    camelCase,
  });
}

export async function generateUtilLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'util');

  await jsLibraryGenerator(tree, {
    directory: context.projectRoot,
    linter: 'eslint',
    name: context.projectName,
    unitTestRunner: 'vitest',
    importPath: context.packageName,
    tags: 'type:util',
    addPlugin: true,
    useProjectJson: context.useProjectJson,
  });

  // Apply patches
  runGenericPatch(tree, context);
  patchViteConfig(tree, context, { hasComponents: false });

  // Apply file templates
  applyLibFileTemplates(tree, 'util', context.projectRoot, {
    ...options,
    camelCase,
    uppercase: toUpperSnakeCase,
  });
}
