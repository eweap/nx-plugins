import type { CreateNodesContext } from '@nx/devkit';
import { describe, expect, it } from 'vitest';

import { createNodesV2 } from './index';

const [, createNodesHandler] = createNodesV2;

function createContext(): CreateNodesContext {
  return {
    workspaceRoot: '/virtual',
    nxJsonConfiguration: {},
  };
}

describe('nx-workspace-tools inference plugin', () => {
  it('infers internal-deps target for package.json project', async () => {
    const result = await createNodesHandler(
      ['packages/app/package.json'],
      {},
      createContext(),
    );

    expect(result).toEqual([
      [
        'packages/app/package.json',
        {
          projects: {
            'packages/app': {
              targets: {
                'internal-deps': {
                  executor: '@eweap/nx-workspace-tools:internal-deps',
                  options: {
                    write: false,
                  },
                },
              },
            },
          },
        },
      ],
    ]);
  });

  it('infers internal-deps target for project.json project', async () => {
    const result = await createNodesHandler(
      ['packages/app/project.json'],
      {},
      createContext(),
    );

    expect(result).toEqual([
      [
        'packages/app/project.json',
        {
          projects: {
            'packages/app': {
              targets: {
                'internal-deps': {
                  executor: '@eweap/nx-workspace-tools:internal-deps',
                  options: {
                    write: false,
                  },
                },
              },
            },
          },
        },
      ],
    ]);
  });

  it('ignores workspace root package.json', async () => {
    const result = await createNodesHandler(
      ['package.json'],
      {},
      createContext(),
    );

    expect(result).toEqual([['package.json', {}]]);
  });
});
