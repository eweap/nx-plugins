import { updateJson, workspaceRoot } from '@nx/devkit';
import * as path from 'node:path';
import { createTreeWithEmptyWorkspace } from 'nx/src/devkit-testing-exports.js';

const workspacePackageRoot = path.join(
  workspaceRoot,
  'node_modules/@nx/workspace',
);

const { presetGenerator: vueWorkspaceGenerator } = require(
  path.join(workspacePackageRoot, 'dist/src/generators/preset/preset.js'),
);
const { Preset } = require(
  path.join(workspacePackageRoot, 'dist/src/generators/utils/presets.js'),
);

export async function createVueWorkspaceTree(
  workspaceOptions?: Partial<Parameters<typeof vueWorkspaceGenerator>[1]>,
) {
  const tree = createTreeWithEmptyWorkspace();

  // Delete this file to force vueWorkspaceGenerator to create the tsconfig files
  tree.delete('tsconfig.base.json');

  await vueWorkspaceGenerator(tree, {
    name: 'workspace',
    preset: Preset.VueMonorepo,
    e2eTestRunner: 'none',
    packageManager: 'pnpm',
    workspaces: true,
    useProjectJson: false,
    skipInstall: true,
    ...workspaceOptions,
  });

  tree.write(
    'pnpm-workspace.yaml',
    ['packages:', '  - "apps/*"', '  - "libs/*"'].join('\n'),
  );

  updateJson(tree, 'tsconfig.base.json', (tsConfigBaseJson) => {
    tsConfigBaseJson.compilerOptions = {
      composite: true,
      declaration: true,
      declarationMap: true,
      emitDeclarationOnly: true,
      importHelpers: true,
      isolatedModules: true,
      lib: ['es2022'],
      module: 'nodenext',
      moduleResolution: 'nodenext',
      noEmitOnError: true,
      noFallthroughCasesInSwitch: true,
      noImplicitOverride: true,
      noImplicitReturns: true,
      noUnusedLocals: true,
      skipLibCheck: true,
      strict: true,
      target: 'es2022',
      customConditions: ['@nx-workspace-tools/source'],
    };

    return tsConfigBaseJson;
  });

  updateJson(tree, 'tsconfig.json', (tsConfigJson) => {
    tsConfigJson = {
      extends: './tsconfig.base.json',
      compileOnSave: false,
      files: [],
      references: [],
    };

    return tsConfigJson;
  });

  return tree;
}
