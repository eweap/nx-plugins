import { workspaceRoot } from '@nx/devkit';
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

  tree.delete('.oxfmtrc.json');

  // Delete this file to force vueWorkspaceGenerator to create the tsconfig files
  tree.delete('tsconfig.base.json');

  await vueWorkspaceGenerator(tree, {
    name: 'workspace',
    preset: Preset.VueMonorepo,
    e2eTestRunner: 'none',
    packageManager: 'pnpm',
    workspaces: true,
    useProjectJson: false,
    formatter: 'prettier',
    skipInstall: true,
    ...workspaceOptions,
  });

  tree.write(
    'pnpm-workspace.yaml',
    ['packages:', '  - "apps/*"', '  - "libs/*"'].join('\n'),
  );

  return tree;
}
