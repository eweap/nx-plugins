import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { type Mock } from 'vitest';

import featureLibsGenerator, {
  generateDataAccessLib,
  generateFeatureLib,
  generateTypesLib,
  generateUiLib,
  generateUtilLib,
} from './feature-libs';
import { FeatureLibsGeneratorSchema } from './schema';

vi.mock(import('./utils/library-generators.js'), async (importOriginal) => ({
  ...(await importOriginal()),
  generateDataAccessLib: vi.fn(),
  generateFeatureLib: vi.fn(),
  generateTypesLib: vi.fn(),
  generateUiLib: vi.fn(),
  generateUtilLib: vi.fn(),
}));

describe('featureLibsGenerator', () => {
  let tree: Tree;

  const options = {
    libsPath: 'libs/my-ressources',
    libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
    ressourceNamePlural: 'my-ressources',
    ressourceNameSingular: 'my-ressource',
    useProjectJson: false,
    workspacePrefix: '@test',
  } satisfies FeatureLibsGeneratorSchema;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    vi.resetAllMocks();
  });

  it('should delegate to the selected library generators', async () => {
    await featureLibsGenerator(tree, options);

    expect(generateFeatureLib as Mock).toHaveBeenCalledWith(tree, options);
    expect(generateDataAccessLib as Mock).toHaveBeenCalledWith(tree, options);
    expect(generateUiLib as Mock).toHaveBeenCalledWith(tree, options);
    expect(generateTypesLib as Mock).toHaveBeenCalledWith(tree, options);
    expect(generateUtilLib as Mock).toHaveBeenCalledWith(tree, options);
  });

  it('should not call any generator when libTypes is empty', async () => {
    await featureLibsGenerator(tree, { ...options, libTypes: [] });

    expect(generateFeatureLib).not.toHaveBeenCalled();
    expect(generateDataAccessLib).not.toHaveBeenCalled();
    expect(generateUiLib).not.toHaveBeenCalled();
    expect(generateTypesLib).not.toHaveBeenCalled();
    expect(generateUtilLib).not.toHaveBeenCalled();
  });
});
