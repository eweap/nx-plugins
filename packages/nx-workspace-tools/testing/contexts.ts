import { LibraryContext } from '../src/generators/feature-libs/utils/context';

export const BASE_CONTEXT = {
  libTypes: [],
  packageName: `@test/my-resources`,
  projectName: `my-resources`,
  workspacePrefix: '@test',
  useProjectJson: false,
} satisfies Omit<LibraryContext, 'projectRoot'>;

export const CONTEXT_FEATURE = {
  ...BASE_CONTEXT,
  projectRoot: `libs/my-resources/feature`,
} satisfies LibraryContext;

export const CONTEXT_DATA_ACCESS = {
  ...BASE_CONTEXT,
  projectRoot: `libs/my-resources/data-access`,
} satisfies LibraryContext;

export const CONTEXT_TYPES = {
  ...BASE_CONTEXT,
  projectRoot: `libs/my-resources/types`,
} satisfies LibraryContext;

export const CONTEXT_UI = {
  ...BASE_CONTEXT,
  projectRoot: `libs/my-resources/ui`,
} satisfies LibraryContext;

export const CONTEXT_UTIL = {
  ...BASE_CONTEXT,
  projectRoot: `libs/my-resources/util`,
} satisfies LibraryContext;
