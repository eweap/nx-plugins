import { Tree, generateFiles, updateJson } from '@nx/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';
import { libraryGenerator as vueLibraryGenerator } from '@nx/vue';
import { camelCase } from 'lodash-es';
import * as path from 'path';

import { patchEslintConfig } from '../patches/eslint-config-mjs.patch';
import { patchTsConfigSpec } from '../patches/tsconfig-spec-json.patch';
import { patchViteConfig } from '../patches/vite-config-mts.patch';
import { FeatureLibsGeneratorSchema } from '../schema';
import { addInternalDepsToPackageJson } from './add-internal-deps';
import { LibraryType, createLibraryContext } from './context';
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

function setLibraryPlatformToWeb(tree: Tree, projectRoot: string) {
  for (const configName of ['tsconfig.lib.json', 'tsconfig.spec.json']) {
    const configPath = path.join(projectRoot, configName);

    if (!tree.exists(configPath)) {
      continue;
    }

    updateJson(tree, configPath, (config) => {
      config.compilerOptions ??= {};
      config.compilerOptions.module = 'esnext';
      config.compilerOptions.moduleResolution = 'bundler';

      return config;
    });
  }
}

export async function generateNxLibrary(
  tree: Tree,
  context: ReturnType<typeof createLibraryContext>,
  libraryType: LibraryType,
) {
  const generatorOptions = {
    directory: context.projectRoot,
    linter: 'eslint',
    bundler: 'none',
    name: context.projectName,
    importPath: context.packageName,
    tags: `type:${libraryType}`,
    useProjectJson: context.useProjectJson,
  } as const;

  switch (libraryType) {
    case 'feature':
    case 'ui':
      await vueLibraryGenerator(tree, {
        ...generatorOptions,
        unitTestRunner: 'vitest',
      });
      return;

    case 'data-access':
    case 'util':
      await jsLibraryGenerator(tree, {
        ...generatorOptions,
        unitTestRunner: 'vitest',
        testEnvironment: 'node',
      });
      setLibraryPlatformToWeb(tree, context.projectRoot);
      return;

    case 'types':
      await jsLibraryGenerator(tree, {
        ...generatorOptions,
        unitTestRunner: 'none',
      });
      setLibraryPlatformToWeb(tree, context.projectRoot);
      return;

    default:
      throw new Error(`Unsupported library type: ${libraryType}`);
  }
}

// feature
export async function generateFeatureLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'feature');

  await generateNxLibrary(tree, context, 'feature');

  await installStorybook(tree, context.projectName);

  // Apply patches
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

// data-access
export async function generateDataAccessLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'data-access');

  await generateNxLibrary(tree, context, 'data-access');

  // Apply patches
  patchEslintConfig(tree, context);
  patchViteConfig(tree, context, { hasComponents: false });

  // Apply file templates
  applyLibFileTemplates(tree, 'data-access', context.projectRoot, {
    ...options,
  });
}

// types
export async function generateTypesLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'types');

  await generateNxLibrary(tree, context, 'types');

  // Apply patches
  patchEslintConfig(tree, context);
  // Apply file templates
  applyLibFileTemplates(tree, 'types', context.projectRoot, {
    ...options,
  });
}

// ui
export async function generateUiLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'ui');

  await generateNxLibrary(tree, context, 'ui');

  await installStorybook(tree, context.projectName);

  // Apply patches
  patchViteConfig(tree, context, { hasComponents: true });
  patchTsConfigSpec(tree, context);

  // Apply file templates
  applyLibFileTemplates(tree, 'ui', context.projectRoot, {
    ...options,
    camelCase,
  });
}

// util
export async function generateUtilLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'util');

  await generateNxLibrary(tree, context, 'util');

  // Apply patches
  patchEslintConfig(tree, context);
  patchViteConfig(tree, context, { hasComponents: false });

  // Apply file templates
  applyLibFileTemplates(tree, 'util', context.projectRoot, {
    ...options,
    camelCase,
    uppercase: toUpperSnakeCase,
  });
}
