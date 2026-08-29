export type TocItem = {
  id: string;
  label: string;
};

type Feature = {
  title: string;
  body: string;
  points: string[];
};

type Example = {
  title: string;
  summary: string;
  language: 'bash' | 'json';
  code: string;
};

type ApiOption = {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
  required?: boolean;
};

type ApiSnippet = {
  title: string;
  language: 'bash' | 'json';
  code: string;
};

type ApiEntry = {
  name: string;
  kind: string;
  purpose: string;
  options: ApiOption[];
  notes: string[];
  snippets: ApiSnippet[];
};

export const repositoryUrl = 'https://github.com/eweap/nx-plugins';

export const packageSourceUrl =
  'https://github.com/eweap/nx-plugins/tree/main/packages/nx-workspace-tools';

export const currentYear = new Date().getFullYear();

export const tocItems: TocItem[] = [
  { id: 'features', label: 'Features' },
  { id: 'installation', label: 'Installation' },
  { id: 'getting-started', label: 'Getting started' },
  { id: 'usage-examples', label: 'Usage examples' },
  { id: 'api-reference', label: 'API reference' },
  { id: 'notes', label: 'Notes' },
];

export const featureItems: Feature[] = [
  {
    title: 'Generate a complete feature slice',
    body: 'Create a standard Nx resource slice in one command.',
    points: [
      'Supports feature, data-access, ui, types, and util libraries.',
      'Uses Nx Vue for feature and ui, Nx JS for the rest.',
      'Keeps package names aligned with the workspace prefix.',
    ],
  },
  {
    title: 'Keep Vue libraries production-ready',
    body: 'Generated Vue libraries include the wiring teams usually add manually.',
    points: [
      'Installs Storybook for feature and ui libraries.',
      'Applies Vite and test config patches.',
      'Keeps generated output close to a consistent workspace baseline.',
    ],
  },
  {
    title: 'Audit workspace dependencies',
    body: 'Find and optionally remove unused workspace:* dependencies.',
    points: [
      'Checks dependency, devDependency, peerDependency, and optionalDependency sections.',
      'Can run in report mode or write mode.',
      'Runs pnpm install and pnpm nx sync when write=true.',
    ],
  },
];

export const gettingStartedCode = `pnpm add -D @eweap/nx-workspace-tools

pnpm nx g @eweap/nx-workspace-tools:feature-libs \
  packages/orders \
  @acme \
  order \
  orders`;

export const usageExamples: Example[] = [
  {
    title: 'Generate the standard library set for a domain',
    summary: 'Generate the default five-library domain slice.',
    language: 'bash',
    code: `pnpm nx g @eweap/nx-workspace-tools:feature-libs \
  packages/catalog \
  @acme \
  product \
  products`,
  },
  {
    title: 'Configure and run the dependency audit',
    summary:
      'Mount the executor on a project target, then run it with or without fixes.',
    language: 'json',
    code: `{
  "targets": {
    "internal-deps": {
      "executor": "@eweap/nx-workspace-tools:internal-deps",
      "options": {
        "write": true
      }
    }
  }
}`,
  },
];

export const apiEntries: ApiEntry[] = [
  {
    name: 'feature-libs',
    kind: 'Generator',
    purpose:
      'Generate a coordinated feature slice: feature, data-access, ui, types, and util.',
    options: [
      {
        name: 'libsPath',
        type: 'string',
        description: 'Directory where the generated libraries will be created.',
        required: true,
      },
      {
        name: 'workspacePrefix',
        type: 'string',
        description:
          'Import-path scope used for generated packages. When omitted, the generator can infer it from the root package name.',
      },
      {
        name: 'ressourceNameSingular',
        type: 'string',
        description: 'Singular resource name used in generated files.',
        required: true,
      },
      {
        name: 'ressourceNamePlural',
        type: 'string',
        description:
          'Plural resource name used for project names and package names.',
        required: true,
      },
      {
        name: 'libTypes',
        type: 'array',
        description:
          'Subset of library types to generate. Allowed values: feature, data-access, ui, types, util.',
        defaultValue: '["feature", "data-access", "ui", "types", "util"]',
      },
      {
        name: 'useProjectJson',
        type: 'boolean',
        description: 'Create a project.json file for each generated library.',
        defaultValue: 'false',
      },
    ],
    notes: [
      'Creates package names such as @acme/orders, @acme/orders-data-access, and @acme/orders-ui.',
      'Feature and ui libraries use @nx/vue and receive Storybook plus config patches.',
      'Data-access, types, and util libraries are generated with @nx/js.',
    ],
    snippets: [
      {
        title: 'Example usage',
        language: 'bash',
        code: `pnpm nx g @eweap/nx-workspace-tools:feature-libs \
  packages/orders \
  @acme \
  order \
  orders \
  --libTypes=feature,data-access,ui,types,util`,
      },
    ],
  },
  {
    name: 'internal-deps',
    kind: 'Executor',
    purpose:
      'Audit a project package.json for unused workspace:* dependencies and optionally remove them.',
    options: [
      {
        name: 'write',
        type: 'boolean',
        description:
          'When true, removes unused internal dependencies, runs pnpm install, and then runs pnpm nx sync.',
        defaultValue: 'false',
      },
    ],
    notes: [
      'Designed to run as a project target using the Nx execution context.',
      'Ignores common build and dependency directories such as dist, coverage, node_modules, and tmp.',
      'With write=false, it reports only.',
    ],
    snippets: [
      {
        title: 'Target configuration',
        language: 'json',
        code: `{
  "targets": {
    "internal-deps": {
      "executor": "@eweap/nx-workspace-tools:internal-deps",
      "options": {
        "write": false
      }
    }
  }
}`,
      },
      {
        title: 'Run the audit',
        language: 'bash',
        code: 'pnpm nx run orders-data-access:internal-deps --write',
      },
    ],
  },
];
