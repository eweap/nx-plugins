import { Tree } from '@nx/devkit';

import { LibraryContext } from './context';

export function setInferredLintAndTestTargets(
  tree: Tree,
  context: LibraryContext,
) {
  const projectJsonPath = `${context.projectRoot}/project.json`;
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
    options: { buildTarget: `${context.projectName}:build` },
    outputs: ['{options.outputPath}'],
  };
  projectJson.targets.lint = {
    executor: '@nx/eslint/plugin',
    options: { lintFilePatterns: [context.projectRoot] },
  };

  tree.write(projectJsonPath, JSON.stringify(projectJson, null, 2));
}
