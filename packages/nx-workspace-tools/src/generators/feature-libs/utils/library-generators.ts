import { Tree, generateFiles } from '@nx/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';
import { libraryGenerator as vueLibraryGenerator } from '@nx/vue';
import { camelCase } from 'lodash-es';
import * as path from 'path';

import { FeatureLibsGeneratorSchema } from '../schema';
import { LibraryContext, createLibraryContext } from './context';
import {
  addTailwindPluginToFeatureViteConfig,
  addTailwindPluginToViteConfig,
  addVueIncludeToTsConfigSpec,
  applyGenericLibChanges,
  normalizeStorybookMainFile,
  normalizeStorybookPreviewFile,
  normalizeStorybookTsConfigInclude,
} from './file-helpers';
import { toUpperSnakeCase } from './string-helpers';

async function generateVueLibrary(
  tree: Tree,
  context: LibraryContext,
  options: {
    tags: string;
    useProjectJson?: boolean;
  },
) {
  await vueLibraryGenerator(tree, {
    directory: context.projectRoot,
    linter: 'eslint',
    name: context.projectName,
    unitTestRunner: 'vitest',
    importPath: context.packageName,
    tags: options.tags,
    addPlugin: true,
    useProjectJson: options.useProjectJson ?? false,
  });
}

async function generateJsLibrary(
  tree: Tree,
  context: LibraryContext,
  options: {
    tags: string;
    useProjectJson?: boolean;
  },
) {
  await jsLibraryGenerator(tree, {
    directory: context.projectRoot,
    linter: 'eslint',
    name: context.projectName,
    unitTestRunner: 'vitest',
    importPath: context.packageName,
    tags: options.tags,
    addPlugin: true,
    useProjectJson: options.useProjectJson ?? false,
  });
}

function generateLibraryFiles(
  tree: Tree,
  templateFolder: string,
  projectRoot: string,
  substitutions: Record<string, unknown>,
) {
  generateFiles(
    tree,
    path.join(__dirname, '..', 'files', templateFolder),
    projectRoot,
    substitutions,
  );
}

function setInferredLintAndTestTargets(
  tree: Tree,
  projectRoot: string,
  projectName: string,
) {
  const projectJsonPath = `${projectRoot}/project.json`;
  if (!tree.exists(projectJsonPath)) {
    return;
  }

  const raw = tree.read(projectJsonPath);
  if (!raw) {
    return;
  }

  const projectJson = JSON.parse(raw.toString());
  projectJson.targets ||= {};
  projectJson.targets.test = {
    executor: '@nx/vitest/plugin',
    options: { buildTarget: `${projectName}:build` },
    outputs: ['{options.outputPath}'],
  };
  projectJson.targets.lint = {
    executor: '@nx/eslint/plugin',
    options: { lintFilePatterns: [projectRoot] },
  };

  tree.write(projectJsonPath, JSON.stringify(projectJson, null, 2));
}

export async function generateFeatureLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'feature');

  await generateVueLibrary(tree, context, {
    tags: 'type:feature',
    useProjectJson: options.useProjectJson,
  });

  generateLibraryFiles(tree, 'feature', context.projectRoot, {
    ...options,
    camelCase,
    workspacePrefix: context.workspacePrefix,
    hasFeatureLib: options.libTypes.includes('feature'),
    hasDataAccessLib: options.libTypes.includes('data-access'),
    hasUILib: options.libTypes.includes('ui'),
    hasTypesLib: options.libTypes.includes('types'),
    hasUtilLib: options.libTypes.includes('util'),
  });

  applyGenericLibChanges(tree, context.projectRoot, context.packageName);
  addTailwindPluginToFeatureViteConfig(
    tree,
    `${context.projectRoot}/vite.config.mts`,
    context.projectName,
  );
  addVueIncludeToTsConfigSpec(tree, context.projectRoot);
  setInferredLintAndTestTargets(tree, context.projectRoot, context.projectName);
}

export async function generateDataAccessLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'data-access');

  await generateJsLibrary(tree, context, {
    tags: 'type:data-access',
    useProjectJson: options.useProjectJson,
  });

  generateLibraryFiles(tree, 'data-access', context.projectRoot, {
    ...options,
    uppercase: toUpperSnakeCase,
  });

  applyGenericLibChanges(tree, context.projectRoot, context.packageName);
  tree.delete(`${context.projectRoot}/src/vue-shims.d.ts`);
  setInferredLintAndTestTargets(tree, context.projectRoot, context.projectName);
}

export async function generateTypesLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'types');

  await generateJsLibrary(tree, context, {
    tags: 'type:types',
    useProjectJson: options.useProjectJson,
  });

  generateLibraryFiles(tree, 'types', context.projectRoot, {
    ...options,
  });

  applyGenericLibChanges(tree, context.projectRoot, context.packageName);
  tree.delete(`${context.projectRoot}/src/vue-shims.d.ts`);
  setInferredLintAndTestTargets(tree, context.projectRoot, context.projectName);
}

export async function generateUILib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'ui');

  await generateVueLibrary(tree, context, {
    tags: 'type:ui',
    useProjectJson: options.useProjectJson,
  });

  generateLibraryFiles(tree, 'ui', context.projectRoot, {
    ...options,
    camelCase,
    hasUtilLib: options.libTypes.includes('util'),
  });
  normalizeStorybookMainFile(tree, context.projectRoot);
  normalizeStorybookPreviewFile(tree, context.projectRoot);
  normalizeStorybookTsConfigInclude(tree, context.projectRoot);

  applyGenericLibChanges(tree, context.projectRoot, context.packageName);
  addTailwindPluginToViteConfig(tree, `${context.projectRoot}/vite.config.mts`);
  addVueIncludeToTsConfigSpec(tree, context.projectRoot);
  setInferredLintAndTestTargets(tree, context.projectRoot, context.projectName);

  const projectJsonPath = `${context.projectRoot}/project.json`;
  const raw = tree.read(projectJsonPath);
  if (raw) {
    const projectJson = JSON.parse(raw.toString());
    projectJson.targets ||= {};
    projectJson.targets.storybook = {
      executor: '@nx/storybook/plugin',
      options: { buildTarget: `${context.projectName}:build` },
      outputs: ['{options.outputPath}'],
    };
    tree.write(projectJsonPath, JSON.stringify(projectJson, null, 2));
  }
}

export async function generateUtilLib(
  tree: Tree,
  options: FeatureLibsGeneratorSchema,
) {
  const context = createLibraryContext(options, 'util');

  await generateJsLibrary(tree, context, {
    tags: 'type:util',
    useProjectJson: options.useProjectJson,
  });

  generateLibraryFiles(tree, 'util', context.projectRoot, {
    ...options,
    camelCase,
    uppercase: toUpperSnakeCase,
  });

  applyGenericLibChanges(tree, context.projectRoot, context.packageName);
  tree.delete(`${context.projectRoot}/src/vue-shims.d.ts`);
  setInferredLintAndTestTargets(tree, context.projectRoot, context.projectName);
}
