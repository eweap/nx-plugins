import type { PromiseExecutor } from '@nx/devkit';
import {
  type SpawnSyncOptionsWithStringEncoding,
  spawnSync,
} from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

import type { WorkspaceInternalDepsExecutorSchema } from './schema';

const workspaceDependencyPrefix = 'workspace:';
const dependencySections = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
] as const;
const ignoredDirs = new Set([
  '.git',
  '.nx',
  '.turbo',
  'coverage',
  'dist',
  'e2e-output',
  'node_modules',
  'out-tsc',
  'tmp',
]);
const ignoredFiles = [
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'bun.lockb',
];

type DependencySection = (typeof dependencySections)[number];

type PackageJson = {
  [key in DependencySection]?: Record<string, string>;
} & Record<string, unknown>;

type DependencyEntry = {
  name: string;
  section: DependencySection;
};

type DependencyGroup = {
  packageJsonPath: string;
  entries: DependencyEntry[];
};

type PackageJsonDependencyGroup = DependencyGroup & {
  absolutePath: string;
  packageJson: PackageJson;
};

function isWorkspaceDependencyVersion(version: string): boolean {
  return version.startsWith(workspaceDependencyPrefix);
}

function runCommand(
  command: string,
  args: string[],
  cwd: string,
  options: Partial<SpawnSyncOptionsWithStringEncoding> = {},
): string {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    throw new Error(
      stderr ||
        `${command} ${args.join(' ')} failed with code ${result.status}`,
    );
  }

  return result.stdout?.trim() ?? '';
}

function isIgnoredUsageEntry(entryName: string): boolean {
  return (
    ignoredDirs.has(entryName) ||
    ignoredFiles.includes(entryName) ||
    entryName.endsWith('.map') ||
    entryName.endsWith('.snap')
  );
}

function findPackageJsonFiles(workspaceRoot: string): string[] {
  return walkForPackageJson(workspaceRoot).map((filePath) =>
    relative(workspaceRoot, filePath),
  );
}

function walkForPackageJson(dir: string): string[] {
  const results: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) {
      continue;
    }

    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...walkForPackageJson(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name === 'package.json') {
      results.push(fullPath);
    }
  }

  return results;
}

function parsePackageJson(packageJsonPath: string): PackageJson {
  return JSON.parse(readFileSync(packageJsonPath, 'utf8')) as PackageJson;
}

export function getWorkspaceDependencies(
  packageJson: PackageJson,
): DependencyEntry[] {
  const entries: DependencyEntry[] = [];

  for (const section of dependencySections) {
    const dependencies = packageJson[section] ?? {};

    for (const [name, version] of Object.entries(dependencies)) {
      if (isWorkspaceDependencyVersion(version)) {
        entries.push({ name, section });
      }
    }
  }

  return entries;
}

function listWorkspaceDependencies(
  workspaceRoot: string,
  packageJsonPath: string,
): PackageJsonDependencyGroup | null {
  const absolutePath = resolve(workspaceRoot, packageJsonPath);
  const packageJson = parsePackageJson(absolutePath);
  const entries = getWorkspaceDependencies(packageJson);

  if (entries.length === 0) {
    return null;
  }

  return { absolutePath, entries, packageJson, packageJsonPath };
}

function findUsages(
  workspaceRoot: string,
  packageJsonPath: string,
  dependencyName: string,
): string[] {
  const projectDir = resolve(workspaceRoot, dirname(packageJsonPath));
  return walkForDependencyUsages(workspaceRoot, projectDir, dependencyName);
}

function walkForDependencyUsages(
  workspaceRoot: string,
  dir: string,
  dependencyName: string,
): string[] {
  const results: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (isIgnoredUsageEntry(entry.name)) {
      continue;
    }

    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(
        ...walkForDependencyUsages(workspaceRoot, fullPath, dependencyName),
      );
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    try {
      const fileContents = readFileSync(fullPath, 'utf8');

      if (fileContents.includes(dependencyName)) {
        results.push(relative(workspaceRoot, fullPath));
      }
    } catch {
      continue;
    }
  }

  return results;
}

function logDependencyGroups(title: string, groups: DependencyGroup[]): void {
  console.log('');
  console.log(title);

  if (groups.length === 0) {
    console.log('  none');
    return;
  }

  for (const group of groups) {
    console.log(`  ${group.packageJsonPath}`);

    for (const entry of group.entries) {
      console.log(`    - ${entry.section} -> ${entry.name}`);
    }
  }
}

function syncWorkspaceAfterFix(workspaceRoot: string): void {
  console.log('');
  console.log('Running pnpm install...');
  runCommand('pnpm', ['install'], workspaceRoot, { stdio: 'inherit' });

  console.log('');
  console.log('Running pnpm nx sync...');
  runCommand('pnpm', ['nx', 'sync'], workspaceRoot, { stdio: 'inherit' });
}

export function analyzeWorkspaceDependencies(workspaceRoot: string): {
  allGroups: DependencyGroup[];
  unusedGroups: PackageJsonDependencyGroup[];
} {
  const allGroups: DependencyGroup[] = [];
  const unusedGroups: PackageJsonDependencyGroup[] = [];

  for (const packageJsonPath of findPackageJsonFiles(workspaceRoot).sort()) {
    const dependencyGroup = listWorkspaceDependencies(
      workspaceRoot,
      packageJsonPath,
    );

    if (!dependencyGroup) {
      continue;
    }

    allGroups.push({
      packageJsonPath,
      entries: dependencyGroup.entries,
    });

    const unusedEntries = dependencyGroup.entries.filter(
      (entry) =>
        findUsages(workspaceRoot, packageJsonPath, entry.name).length === 0,
    );

    if (unusedEntries.length > 0) {
      unusedGroups.push({
        absolutePath: dependencyGroup.absolutePath,
        entries: unusedEntries,
        packageJson: dependencyGroup.packageJson,
        packageJsonPath,
      });
    }
  }

  return { allGroups, unusedGroups };
}

export function removeUnusedWorkspaceDependencies(
  groups: PackageJsonDependencyGroup[],
): number {
  let removedDependenciesCount = 0;

  for (const group of groups) {
    for (const entry of group.entries) {
      const dependencies = group.packageJson[entry.section];

      if (!dependencies) {
        continue;
      }

      delete dependencies[entry.name];
      removedDependenciesCount += 1;

      if (Object.keys(dependencies).length === 0) {
        delete group.packageJson[entry.section];
      }
    }

    writeFileSync(
      group.absolutePath,
      `${JSON.stringify(group.packageJson, null, 2)}\n`,
    );
  }

  return removedDependenciesCount;
}

const runExecutor: PromiseExecutor<
  WorkspaceInternalDepsExecutorSchema
> = async (options, context) => {
  const workspaceRoot = context.root;
  const { allGroups, unusedGroups } =
    analyzeWorkspaceDependencies(workspaceRoot);

  logDependencyGroups('All workspace internal dependencies', allGroups);
  logDependencyGroups('Unused workspace internal dependencies', unusedGroups);

  if (!options.write) {
    console.log('');
    console.log(
      'Dry run only. Pass write: true to remove unused dependencies.',
    );
    return { success: true };
  }

  if (unusedGroups.length === 0) {
    console.log('');
    console.log('Nothing to remove.');
    return { success: true };
  }

  const removedDependenciesCount =
    removeUnusedWorkspaceDependencies(unusedGroups);
  console.log('');
  console.log(`Removed ${removedDependenciesCount} unused dependencies.`);

  syncWorkspaceAfterFix(workspaceRoot);

  return { success: true };
};

export default runExecutor;
