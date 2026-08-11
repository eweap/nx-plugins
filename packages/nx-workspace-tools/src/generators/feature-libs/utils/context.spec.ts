import type { FeatureLibsGeneratorSchema } from '../schema';
import { createLibraryContext } from './context';

describe('createLibraryContext', () => {
  const options: FeatureLibsGeneratorSchema = {
    libsPath: 'libs/my-ressources',
    ressourceNameSingular: 'ressource',
    ressourceNamePlural: 'my-ressources',
    workspacePrefix: '@org',
    libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
  };

  it('builds the expected context for each library type', () => {
    expect(createLibraryContext(options, 'feature')).toEqual({
      workspacePrefix: '@org',
      projectRoot: 'libs/my-ressources/feature',
      projectName: 'my-ressources',
      packageName: '@org/my-ressources',
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
    });

    expect(createLibraryContext(options, 'data-access')).toEqual({
      workspacePrefix: '@org',
      projectRoot: 'libs/my-ressources/data-access',
      projectName: 'my-ressources-data-access',
      packageName: '@org/my-ressources-data-access',
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
    });

    expect(createLibraryContext(options, 'ui')).toEqual({
      workspacePrefix: '@org',
      projectRoot: 'libs/my-ressources/ui',
      projectName: 'my-ressources-ui',
      packageName: '@org/my-ressources-ui',
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
    });

    expect(createLibraryContext(options, 'types')).toEqual({
      workspacePrefix: '@org',
      projectRoot: 'libs/my-ressources/types',
      projectName: 'my-ressources-types',
      packageName: '@org/my-ressources-types',
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
    });

    expect(createLibraryContext(options, 'util')).toEqual({
      workspacePrefix: '@org',
      projectRoot: 'libs/my-ressources/util',
      projectName: 'my-ressources-util',
      packageName: '@org/my-ressources-util',
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
    });
  });
});
