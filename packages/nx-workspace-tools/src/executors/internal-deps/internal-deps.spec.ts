import { ExecutorContext } from '@nx/devkit';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import runExecutor, {
  analyzeProjectDependencies,
  getWorkspaceDependencies,
  removeUnusedWorkspaceDependencies,
} from './internal-deps';
import { InternalDepsExecutorSchema } from './schema';

const workspaceRoot = mkdtempSync(join(tmpdir(), 'nx-workspace-tools-'));
const options: InternalDepsExecutorSchema = {};
const context: ExecutorContext = {
  root: workspaceRoot,
  cwd: workspaceRoot,
  isVerbose: false,
  projectName: 'app',
  projectGraph: {
    nodes: {
      app: {
        name: 'app',
        type: 'app',
        data: {
          root: 'packages/app',
          targets: {},
        },
      },
    },
    dependencies: {},
  },
  projectsConfigurations: {
    projects: {
      app: {
        root: 'packages/app',
      },
    },
    version: 2,
  },
  nxJsonConfiguration: {},
};

describe('internal-deps executor', () => {
  it('can run', async () => {
    const output = await runExecutor(options, context);
    expect(output.success).toBe(true);
  });

  it('collects only workspace dependencies declared with a workspace version', () => {
    const dependencies = getWorkspaceDependencies({
      dependencies: {
        '@nx-workspace-tools/ui': 'workspace:*',
        '@nx-workspace-tools/core': 'workspace:^',
        vue: '^3.5.13',
      },
      devDependencies: {
        '@nx-workspace-tools/testing': 'workspace:*',
        vitest: '~4.1.0',
      },
      optionalDependencies: {
        '@nx-workspace-tools/icons': 'workspace:*',
      },
      peerDependencies: {
        '@nx-workspace-tools/types': 'workspace:~',
      },
    });

    expect(dependencies).toEqual([
      { name: '@nx-workspace-tools/ui', section: 'dependencies' },
      { name: '@nx-workspace-tools/core', section: 'dependencies' },
      { name: '@nx-workspace-tools/testing', section: 'devDependencies' },
      { name: '@nx-workspace-tools/types', section: 'peerDependencies' },
      { name: '@nx-workspace-tools/icons', section: 'optionalDependencies' },
    ]);
  });

  it('analyzes unused internal dependencies only for target project', () => {
    const appDir = join(workspaceRoot, 'packages', 'app');
    const sharedDir = join(workspaceRoot, 'packages', 'shared');
    const uiDir = join(workspaceRoot, 'packages', 'ui');
    const otherDir = join(workspaceRoot, 'packages', 'other');

    mkdirSync(join(appDir, 'src'), { recursive: true });
    mkdirSync(join(sharedDir, 'src'), { recursive: true });
    mkdirSync(join(uiDir, 'src'), { recursive: true });
    mkdirSync(join(otherDir, 'src'), { recursive: true });

    writeFileSync(
      join(appDir, 'package.json'),
      `${JSON.stringify(
        {
          name: '@nx-workspace-tools/app',
          dependencies: {
            '@nx-workspace-tools/shared': 'workspace:*',
            '@nx-workspace-tools/ui': 'workspace:*',
            react: '^18.0.0',
          },
        },
        null,
        2,
      )}\n`,
    );

    writeFileSync(
      join(appDir, 'src', 'index.ts'),
      "import '@nx-workspace-tools/shared';\n",
    );

    writeFileSync(
      join(sharedDir, 'package.json'),
      `${JSON.stringify(
        {
          name: '@nx-workspace-tools/shared',
          dependencies: {},
        },
        null,
        2,
      )}\n`,
    );

    writeFileSync(
      join(uiDir, 'package.json'),
      `${JSON.stringify(
        {
          name: '@nx-workspace-tools/ui',
          dependencies: {},
        },
        null,
        2,
      )}\n`,
    );

    writeFileSync(
      join(otherDir, 'package.json'),
      `${JSON.stringify(
        {
          name: '@nx-workspace-tools/other',
          dependencies: {
            '@nx-workspace-tools/ui': 'workspace:*',
          },
        },
        null,
        2,
      )}\n`,
    );

    const { allGroups, unusedGroups } = analyzeProjectDependencies(
      workspaceRoot,
      'packages/app',
    );

    expect(allGroups).toEqual([
      {
        packageJsonPath: 'packages/app/package.json',
        entries: [
          { name: '@nx-workspace-tools/shared', section: 'dependencies' },
          { name: '@nx-workspace-tools/ui', section: 'dependencies' },
        ],
      },
    ]);

    expect(unusedGroups).toEqual([
      {
        absolutePath: join(workspaceRoot, 'packages/app/package.json'),
        packageJsonPath: 'packages/app/package.json',
        entries: [{ name: '@nx-workspace-tools/ui', section: 'dependencies' }],
        packageJson: {
          name: '@nx-workspace-tools/app',
          dependencies: {
            '@nx-workspace-tools/shared': 'workspace:*',
            '@nx-workspace-tools/ui': 'workspace:*',
            react: '^18.0.0',
          },
        },
      },
    ]);
  });

  it('removes unused workspace dependencies and drops empty sections', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'internal-deps-'));
    const packageJsonPath = join(tempDir, 'package.json');

    writeFileSync(
      packageJsonPath,
      `${JSON.stringify(
        {
          name: 'test-package',
          devDependencies: {
            '@nx-workspace-tools/shared': 'workspace:*',
          },
          dependencies: {
            '@nx-workspace-tools/ui': 'workspace:*',
            vue: '^3.5.13',
          },
        },
        null,
        2,
      )}\n`,
    );

    const removedDependenciesCount = removeUnusedWorkspaceDependencies([
      {
        absolutePath: packageJsonPath,
        entries: [
          { name: '@nx-workspace-tools/shared', section: 'devDependencies' },
          { name: '@nx-workspace-tools/ui', section: 'dependencies' },
        ],
        packageJson: {
          name: 'test-package',
          devDependencies: {
            '@nx-workspace-tools/shared': 'workspace:*',
          },
          dependencies: {
            '@nx-workspace-tools/ui': 'workspace:*',
            vue: '^3.5.13',
          },
        },
        packageJsonPath: 'package.json',
      },
    ]);

    expect(removedDependenciesCount).toBe(2);
    expect(JSON.parse(readFileSync(packageJsonPath, 'utf8'))).toEqual({
      name: 'test-package',
      dependencies: {
        vue: '^3.5.13',
      },
    });
  });
});
