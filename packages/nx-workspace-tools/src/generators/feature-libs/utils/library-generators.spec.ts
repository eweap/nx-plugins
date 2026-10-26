import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Mock } from 'vitest';

import { patchEslintConfig } from '../patches/eslint-config-mjs.patch';
import { patchTsConfigSpec } from '../patches/tsconfig-spec-json.patch';
import { patchViteConfig } from '../patches/vite-config-mts.patch';
import { FeatureLibsGeneratorSchema } from '../schema';
import { addInternalDepsToPackageJson } from './add-internal-deps';
import { LibraryContext, LibraryType } from './context';
import { installStorybook } from './install-storybook';
import {
  generateDataAccessLib,
  generateFeatureLib,
  generateNxLibrary,
  generateTypesLib,
  generateUiLib,
  generateUtilLib,
} from './library-generators';

vi.mock(import('./add-internal-deps.js'), async (importOriginal) => ({
  ...(await importOriginal()),
  addInternalDepsToPackageJson: vi.fn(),
}));

vi.mock(import('./install-storybook.js'), async (importOriginal) => ({
  ...(await importOriginal()),
  installStorybook: vi.fn(),
}));

vi.mock(
  import('../patches/eslint-config-mjs.patch.js'),
  async (importOriginal) => ({
    ...(await importOriginal()),
    patchEslintConfig: vi.fn(),
  }),
);

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
  const FEATURE_LIBS_GENERATOR_CONFIG = {
    libsPath: 'libs/my-resources',
    libTypes: [],
    resourceNamePlural: 'my-resources',
    resourceNameSingular: 'my-resource',
    useProjectJson: false,
    workspacePrefix: '@test',
  } satisfies FeatureLibsGeneratorSchema;

  describe('generateNxLibrary()', () => {
    it('should throw for an unknown library type', async () => {
      const context: LibraryContext = {
        libTypes: [],
        packageName: '@test/my-resources',
        projectName: 'my-resources',
        projectRoot: 'libs/my-resources',
        workspacePrefix: '@test',
        useProjectJson: false,
      };

      await expect(
        generateNxLibrary(
          createTreeWithEmptyWorkspace(),
          context,
          'unknown' as LibraryType,
        ),
      ).rejects.toThrow('Unsupported library type: unknown');
    });
  });

  describe('generateFeatureLib()', () => {
    const CONTEXT: LibraryContext = {
      libTypes: FEATURE_LIBS_GENERATOR_CONFIG.libTypes,
      packageName: `${FEATURE_LIBS_GENERATOR_CONFIG.workspacePrefix}/${FEATURE_LIBS_GENERATOR_CONFIG.resourceNamePlural}`,
      projectName: `${FEATURE_LIBS_GENERATOR_CONFIG.resourceNamePlural}`,
      projectRoot: `${FEATURE_LIBS_GENERATOR_CONFIG.libsPath}/feature`,
      workspacePrefix: FEATURE_LIBS_GENERATOR_CONFIG.workspacePrefix,
      useProjectJson: false,
    };

    beforeEach(async () => {
      tree = createTreeWithEmptyWorkspace();

      vi.resetAllMocks();

      await generateFeatureLib(tree, FEATURE_LIBS_GENERATOR_CONFIG);
    });

    it('should install storybook', () => {
      expect(installStorybook).toHaveBeenCalledWith(tree, CONTEXT.projectName);
    });

    it('should apply vite config patches', () => {
      expect(patchViteConfig as Mock).toHaveBeenCalledWith(tree, CONTEXT, {
        hasComponents: true,
      });
    });

    it('should apply tsconfig.spec.json patches', () => {
      expect(patchTsConfigSpec as Mock).toHaveBeenCalledWith(tree, CONTEXT);
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
      libTypes: FEATURE_LIBS_GENERATOR_CONFIG.libTypes,
      packageName: `${FEATURE_LIBS_GENERATOR_CONFIG.workspacePrefix}/${FEATURE_LIBS_GENERATOR_CONFIG.resourceNamePlural}-data-access`,
      projectName: `${FEATURE_LIBS_GENERATOR_CONFIG.resourceNamePlural}-data-access`,
      projectRoot: `${FEATURE_LIBS_GENERATOR_CONFIG.libsPath}/data-access`,
      workspacePrefix: FEATURE_LIBS_GENERATOR_CONFIG.workspacePrefix,
      useProjectJson: false,
    };

    beforeEach(async () => {
      tree = createTreeWithEmptyWorkspace();

      vi.resetAllMocks();

      await generateDataAccessLib(tree, FEATURE_LIBS_GENERATOR_CONFIG);
    });

    it('should patch the eslint config', () => {
      expect(patchEslintConfig as Mock).toHaveBeenCalledWith(tree, CONTEXT);
    });

    it('should apply vite config patches', () => {
      expect(patchViteConfig as Mock).toHaveBeenCalledWith(tree, CONTEXT, {
        hasComponents: false,
      });
    });
  });

  describe('generateTypesLib()', () => {
    const CONTEXT: LibraryContext = {
      libTypes: FEATURE_LIBS_GENERATOR_CONFIG.libTypes,
      packageName: `${FEATURE_LIBS_GENERATOR_CONFIG.workspacePrefix}/${FEATURE_LIBS_GENERATOR_CONFIG.resourceNamePlural}-types`,
      projectName: `${FEATURE_LIBS_GENERATOR_CONFIG.resourceNamePlural}-types`,
      projectRoot: `${FEATURE_LIBS_GENERATOR_CONFIG.libsPath}/types`,
      workspacePrefix: FEATURE_LIBS_GENERATOR_CONFIG.workspacePrefix,
      useProjectJson: false,
    };

    beforeEach(async () => {
      tree = createTreeWithEmptyWorkspace();

      vi.resetAllMocks();

      await generateTypesLib(tree, FEATURE_LIBS_GENERATOR_CONFIG);
    });

    it('should patch the eslint config', () => {
      expect(patchEslintConfig as Mock).toHaveBeenCalledWith(tree, CONTEXT);
    });
  });

  describe('generateUiLib()', () => {
    const CONTEXT: LibraryContext = {
      libTypes: FEATURE_LIBS_GENERATOR_CONFIG.libTypes,
      packageName: `${FEATURE_LIBS_GENERATOR_CONFIG.workspacePrefix}/${FEATURE_LIBS_GENERATOR_CONFIG.resourceNamePlural}-ui`,
      projectName: `${FEATURE_LIBS_GENERATOR_CONFIG.resourceNamePlural}-ui`,
      projectRoot: `${FEATURE_LIBS_GENERATOR_CONFIG.libsPath}/ui`,
      workspacePrefix: FEATURE_LIBS_GENERATOR_CONFIG.workspacePrefix,
      useProjectJson: false,
    };

    beforeEach(async () => {
      tree = createTreeWithEmptyWorkspace();

      vi.resetAllMocks();

      await generateUiLib(tree, FEATURE_LIBS_GENERATOR_CONFIG);
    });

    it('should install storybook', () => {
      expect(installStorybook).toHaveBeenCalledWith(tree, CONTEXT.projectName);
    });

    it('should apply vite config patches', () => {
      expect(patchViteConfig as Mock).toHaveBeenCalledWith(tree, CONTEXT, {
        hasComponents: true,
      });
    });

    it('should apply tsconfig.spec.json patches', () => {
      expect(patchTsConfigSpec as Mock).toHaveBeenCalledWith(tree, CONTEXT);
    });
  });

  describe('generateUtilLib()', () => {
    const CONTEXT: LibraryContext = {
      libTypes: FEATURE_LIBS_GENERATOR_CONFIG.libTypes,
      packageName: `${FEATURE_LIBS_GENERATOR_CONFIG.workspacePrefix}/${FEATURE_LIBS_GENERATOR_CONFIG.resourceNamePlural}-util`,
      projectName: `${FEATURE_LIBS_GENERATOR_CONFIG.resourceNamePlural}-util`,
      projectRoot: `${FEATURE_LIBS_GENERATOR_CONFIG.libsPath}/util`,
      workspacePrefix: FEATURE_LIBS_GENERATOR_CONFIG.workspacePrefix,
      useProjectJson: false,
    };

    beforeEach(async () => {
      tree = createTreeWithEmptyWorkspace();

      vi.resetAllMocks();

      await generateUtilLib(tree, FEATURE_LIBS_GENERATOR_CONFIG);
    });

    it('should patch the eslint config', () => {
      expect(patchEslintConfig as Mock).toHaveBeenCalledWith(tree, CONTEXT);
    });

    it('should apply vite config patches', () => {
      expect(patchViteConfig as Mock).toHaveBeenCalledWith(tree, CONTEXT, {
        hasComponents: false,
      });
    });
  });
});
