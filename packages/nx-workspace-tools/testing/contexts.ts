import { LibraryContext } from '../src/generators/feature-libs/utils/context';

export const BASE_CONTEXT = {
  libTypes: [],
  packageName: `@test/my-ressources`,
  projectName: `my-ressources`,
  workspacePrefix: '@test',
  useProjectJson: false,
} satisfies Omit<LibraryContext, 'projectRoot'>;

export const CONTEXT_FEATURE = {
  ...BASE_CONTEXT,
  projectRoot: `libs/my-ressources/feature`,
} satisfies LibraryContext;

export const CONTEXT_DATA_ACCESS = {
  ...BASE_CONTEXT,
  projectRoot: `libs/my-ressources/data-access`,
} satisfies LibraryContext;

export const CONTEXT_TYPES = {
  ...BASE_CONTEXT,
  projectRoot: `libs/my-ressources/types`,
} satisfies LibraryContext;

export const CONTEXT_UI = {
  ...BASE_CONTEXT,
  projectRoot: `libs/my-ressources/ui`,
} satisfies LibraryContext;

export const CONTEXT_UTIL = {
  ...BASE_CONTEXT,
  projectRoot: `libs/my-ressources/util`,
} satisfies LibraryContext;
