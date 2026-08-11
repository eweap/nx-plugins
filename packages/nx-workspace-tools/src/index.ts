import type {
  CreateNodes,
  CreateNodesContext,
  TargetConfiguration,
} from '@nx/devkit';
import { createNodesFromFiles } from '@nx/devkit';
import { dirname } from 'node:path';

const internalDepsTargetName = 'internal-deps';

function getInternalDepsTarget(): TargetConfiguration {
  return {
    executor: '@eweap/nx-workspace-tools:internal-deps',
    options: {
      write: false,
    },
  };
}

function createInternalDepsTarget(projectRoot: string) {
  return {
    projects: {
      [projectRoot]: {
        targets: {
          [internalDepsTargetName]: getInternalDepsTarget(),
        },
      },
    },
  };
}

async function createNodesForConfigFile(
  configFilePath: string,
  _options: unknown,
  _context: CreateNodesContext,
) {
  const projectRoot = dirname(configFilePath);

  if (projectRoot === '.' || projectRoot.length === 0) {
    return {};
  }

  return createInternalDepsTarget(projectRoot);
}

export const createNodes: CreateNodes = [
  '**/{project,package}.json',
  async (configFilePaths, options, context) =>
    createNodesFromFiles(
      createNodesForConfigFile,
      configFilePaths,
      options,
      context,
    ),
];

export const createNodesV2 = createNodes;
