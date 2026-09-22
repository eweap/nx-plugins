import * as fs from 'fs';
import * as path from 'path';

import { FeatureLibsGeneratorSchema } from '../schema';

export type LibraryType = FeatureLibsGeneratorSchema['libTypes'][number];

export interface LibraryContext {
  workspacePrefix: string;
  libTypes: FeatureLibsGeneratorSchema['libTypes'];
  projectRoot: string;
  projectName: string;
  packageName: string;
  useProjectJson: boolean;
}

// Detect the prefix from the root package.json. This allows the generator to
// automatically adapt to different monorepo names without hard‑coding.
export function getWorkspacePrefix(): string {
  // Resolve the workspace root package.json relative to this file.
  const pkgPath = path.resolve(__dirname, '../../../../../../package.json');
  try {
    const raw = fs.readFileSync(pkgPath, 'utf8');
    const { name } = JSON.parse(raw);
    // The package name is expected to be in the form "@prefix/something".
    if (typeof name === 'string' && name.startsWith('@')) {
      return name.split('/')[0];
    }
  } catch {
    /* fall back */
  }
  // No fallback: if the package.json cannot be read or parsed, let the caller
  // handle the failure. Returning an empty string would silently break the
  // generator.
  throw new Error('Unable to determine workspace prefix');
}

export function createLibraryContext(
  options: FeatureLibsGeneratorSchema,
  libraryType: LibraryType,
): LibraryContext {
  const workspacePrefix = options.workspacePrefix ?? getWorkspacePrefix();

  let context;

  switch (libraryType) {
    case 'feature':
      context = {
        projectRoot: `${options.libsPath}/feature`,
        projectName: options.resourceNamePlural,
        packageName: `${workspacePrefix}/${options.resourceNamePlural}`,
      };
      break;
    case 'data-access':
      context = {
        projectRoot: `${options.libsPath}/data-access`,
        projectName: `${options.resourceNamePlural}-data-access`,
        packageName: `${workspacePrefix}/${options.resourceNamePlural}-data-access`,
      };
      break;
    case 'ui':
      context = {
        projectRoot: `${options.libsPath}/ui`,
        projectName: `${options.resourceNamePlural}-ui`,
        packageName: `${workspacePrefix}/${options.resourceNamePlural}-ui`,
      };
      break;
    case 'types':
      context = {
        projectRoot: `${options.libsPath}/types`,
        projectName: `${options.resourceNamePlural}-types`,
        packageName: `${workspacePrefix}/${options.resourceNamePlural}-types`,
      };
      break;
    case 'util':
      context = {
        projectRoot: `${options.libsPath}/util`,
        projectName: `${options.resourceNamePlural}-util`,
        packageName: `${workspacePrefix}/${options.resourceNamePlural}-util`,
      };
      break;
    default:
      // This should never happen because libraryType is constrained by
      // FeatureLibsGeneratorSchema['libTypes'][number].  Adding a default keeps
      // TypeScript happy and provides a clear error if an unexpected value
      // slips through.
      throw new Error(`Unsupported library type: ${libraryType}`);
  }

  return {
    ...context,
    workspacePrefix,
    libTypes: options.libTypes,
    useProjectJson: options.useProjectJson ?? false,
  };
}
