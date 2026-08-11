import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { storybookConfigurationGenerator } from '@nx/vue';
import { Mock } from 'vitest';

import { runGenericPatch } from '../patches/generic';
import { patchTsConfigSpec } from '../patches/tsconfig-spec-json.patch';
import { patchViteConfig } from '../patches/vite-config-mts.patch';
import { FeatureLibsGeneratorSchema } from '../schema';
import { LibraryContext } from './context';
import { addInternalDepsToPackageJson } from './file-helpers';
import { setInferredLintAndTestTargets } from './infer-tasks';
import {
  generateDataAccessLib,
  generateFeatureLib,
  generateTypesLib,
  generateUiLib,
  generateUtilLib,
} from './library-generators';

vi.mock(import('@nx/vue'), async (importOriginal) => ({
  ...(await importOriginal()),
  storybookConfigurationGenerator: vi.fn(),
}));

vi.mock(import('./file-helpers.js'), async (importOriginal) => ({
  ...(await importOriginal()),
  addInternalDepsToPackageJson: vi.fn(),
  setInferredLintAndTestTargets: vi.fn(),
}));

vi.mock(import('./infer-tasks.js'), async (importOriginal) => ({
  ...(await importOriginal()),
  setInferredLintAndTestTargets: vi.fn(),
}));

vi.mock(import('../patches/generic.js'), async (importOriginal) => ({
  ...(await importOriginal()),
  runGenericPatch: vi.fn(),
}));

vi.mock(
  import('../patches/vite-config-mts.patch.js'),
  async (importOriginal) => ({
    ...(await importOriginal()),
    patchViteConfig: vi.fn(),
  }),
);

vi.mock(
  import('../patches/tsconfig-spec-json.patch.js'),
  async (importOriginal) => ({
    ...(await importOriginal()),
    patchTsConfigSpec: vi.fn(),
  }),
);

describe('Library generators', () => {
  let tree: Tree;
  const GENERATOR_CONFIG = {
    libsPath: 'libs/my-ressources',
    libTypes: [],
    ressourceNamePlural: 'my-ressources',
    ressourceNameSingular: 'my-ressource',
    useProjectJson: false,
    workspacePrefix: '@test',
  } satisfies FeatureLibsGeneratorSchema;

  describe('generateFeatureLib()', () => {
    const CONTEXT: LibraryContext = {
      libTypes: GENERATOR_CONFIG.libTypes,
      packageName: `${GENERATOR_CONFIG.workspacePrefix}/${GENERATOR_CONFIG.ressourceNamePlural}`,
      projectName: `${GENERATOR_CONFIG.ressourceNamePlural}`,
      projectRoot: `${GENERATOR_CONFIG.libsPath}/feature`,
      workspacePrefix: GENERATOR_CONFIG.workspacePrefix,
    };

    beforeAll(async () => {
      tree = createTreeWithEmptyWorkspace();

      vi.resetAllMocks();

      await generateFeatureLib(tree, GENERATOR_CONFIG);
    });

    it('should install storybook', () => {
      expect(storybookConfigurationGenerator as Mock).toHaveBeenCalledWith(
        tree,
        {
          project: CONTEXT.projectName,
        },
      );
    });

    it('should apply generic patches', () => {
      expect(runGenericPatch as Mock).toHaveBeenCalledWith(tree, CONTEXT);
    });

    it('should apply vite config patches', () => {
      expect(patchViteConfig as Mock).toHaveBeenCalledWith(tree, CONTEXT, {
        hasComponents: true,
      });
    });

    it('should apply tsconfig.spec.json patches', () => {
      expect(patchTsConfigSpec as Mock).toHaveBeenCalledWith(tree, CONTEXT);
    });

    it('should set inferred lint and test targets', () => {
      expect(setInferredLintAndTestTargets as Mock).toHaveBeenCalledWith(
        tree,
        CONTEXT,
      );
    });

    it('should add internal dependencies', () => {
      expect(addInternalDepsToPackageJson as Mock).toHaveBeenCalledWith(
        tree,
        CONTEXT,
      );
    });
  });

  describe('generateDataAccessLib()', () => {
    const CONTEXT: LibraryContext = {
      libTypes: GENERATOR_CONFIG.libTypes,
      packageName: `${GENERATOR_CONFIG.workspacePrefix}/${GENERATOR_CONFIG.ressourceNamePlural}-data-access`,
      projectName: `${GENERATOR_CONFIG.ressourceNamePlural}-data-access`,
      projectRoot: `${GENERATOR_CONFIG.libsPath}/data-access`,
      workspacePrefix: GENERATOR_CONFIG.workspacePrefix,
    };

    beforeAll(async () => {
      tree = createTreeWithEmptyWorkspace();

      vi.resetAllMocks();

      await generateDataAccessLib(tree, GENERATOR_CONFIG);
    });

    it('should apply generic patches', () => {
      expect(runGenericPatch as Mock).toHaveBeenCalledWith(tree, CONTEXT);
    });

    it('should apply vite config patches', () => {
      expect(patchViteConfig as Mock).toHaveBeenCalledWith(tree, CONTEXT, {
        hasComponents: false,
      });
    });

    it('should set inferred lint and test targets', () => {
      expect(setInferredLintAndTestTargets as Mock).toHaveBeenCalledWith(
        tree,
        CONTEXT,
      );
    });
  });

  describe('generateTypesLib()', () => {
    const CONTEXT: LibraryContext = {
      libTypes: GENERATOR_CONFIG.libTypes,
      packageName: `${GENERATOR_CONFIG.workspacePrefix}/${GENERATOR_CONFIG.ressourceNamePlural}-types`,
      projectName: `${GENERATOR_CONFIG.ressourceNamePlural}-types`,
      projectRoot: `${GENERATOR_CONFIG.libsPath}/types`,
      workspacePrefix: GENERATOR_CONFIG.workspacePrefix,
    };

    beforeAll(async () => {
      tree = createTreeWithEmptyWorkspace();

      vi.resetAllMocks();

      await generateTypesLib(tree, GENERATOR_CONFIG);
    });

    it('should apply generic patches', () => {
      expect(runGenericPatch as Mock).toHaveBeenCalledWith(tree, CONTEXT);
    });

    it('should set inferred lint and test targets', () => {
      expect(setInferredLintAndTestTargets as Mock).toHaveBeenCalledWith(
        tree,
        CONTEXT,
      );
    });
  });

  describe('generateUiLib()', () => {
    const CONTEXT: LibraryContext = {
      libTypes: GENERATOR_CONFIG.libTypes,
      packageName: `${GENERATOR_CONFIG.workspacePrefix}/${GENERATOR_CONFIG.ressourceNamePlural}-ui`,
      projectName: `${GENERATOR_CONFIG.ressourceNamePlural}-ui`,
      projectRoot: `${GENERATOR_CONFIG.libsPath}/ui`,
      workspacePrefix: GENERATOR_CONFIG.workspacePrefix,
    };

    beforeAll(async () => {
      tree = createTreeWithEmptyWorkspace();

      vi.resetAllMocks();

      await generateUiLib(tree, GENERATOR_CONFIG);
    });

    it('should install storybook', () => {
      expect(storybookConfigurationGenerator as Mock).toHaveBeenCalledWith(
        tree,
        {
          project: CONTEXT.projectName,
        },
      );
    });

    it('should apply generic patches', () => {
      expect(runGenericPatch as Mock).toHaveBeenCalledWith(tree, CONTEXT);
    });

    it('should apply vite config patches', () => {
      expect(patchViteConfig as Mock).toHaveBeenCalledWith(tree, CONTEXT, {
        hasComponents: true,
      });
    });

    it('should apply tsconfig.spec.json patches', () => {
      expect(patchTsConfigSpec as Mock).toHaveBeenCalledWith(tree, CONTEXT);
    });

    it('should set inferred lint and test targets', () => {
      expect(setInferredLintAndTestTargets as Mock).toHaveBeenCalledWith(
        tree,
        CONTEXT,
      );
    });
  });

  describe('generateUtilLib()', () => {
    const CONTEXT: LibraryContext = {
      libTypes: GENERATOR_CONFIG.libTypes,
      packageName: `${GENERATOR_CONFIG.workspacePrefix}/${GENERATOR_CONFIG.ressourceNamePlural}-util`,
      projectName: `${GENERATOR_CONFIG.ressourceNamePlural}-util`,
      projectRoot: `${GENERATOR_CONFIG.libsPath}/util`,
      workspacePrefix: GENERATOR_CONFIG.workspacePrefix,
    };

    beforeAll(async () => {
      tree = createTreeWithEmptyWorkspace();

      vi.resetAllMocks();

      await generateUtilLib(tree, GENERATOR_CONFIG);
    });

    it('should apply generic patches', () => {
      expect(runGenericPatch as Mock).toHaveBeenCalledWith(tree, CONTEXT);
    });

    it('should apply vite config patches', () => {
      expect(patchViteConfig as Mock).toHaveBeenCalledWith(tree, CONTEXT, {
        hasComponents: false,
      });
    });

    it('should set inferred lint and test targets', () => {
      expect(setInferredLintAndTestTargets as Mock).toHaveBeenCalledWith(
        tree,
        CONTEXT,
      );
    });
  });
});
