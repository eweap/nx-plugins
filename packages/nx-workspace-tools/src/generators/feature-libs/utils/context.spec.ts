import type { FeatureLibsGeneratorSchema } from '../schema';
import { createLibraryContext } from './context';

describe('createLibraryContext', () => {
  const options: FeatureLibsGeneratorSchema = {
    libsPath: 'libs/my-resources',
    resourceNameSingular: 'resource',
    resourceNamePlural: 'my-resources',
    workspacePrefix: '@org',
    libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
    useProjectJson: true,
  };

  it('should build the expected context for each library type', () => {
    expect(createLibraryContext(options, 'feature')).toEqual({
      workspacePrefix: '@org',
      projectRoot: 'libs/my-resources/feature',
      projectName: 'my-resources',
      packageName: '@org/my-resources',
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
      useProjectJson: true,
    });

    expect(createLibraryContext(options, 'data-access')).toEqual({
      workspacePrefix: '@org',
      projectRoot: 'libs/my-resources/data-access',
      projectName: 'my-resources-data-access',
      packageName: '@org/my-resources-data-access',
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
      useProjectJson: true,
    });

    expect(createLibraryContext(options, 'ui')).toEqual({
      workspacePrefix: '@org',
      projectRoot: 'libs/my-resources/ui',
      projectName: 'my-resources-ui',
      packageName: '@org/my-resources-ui',
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
      useProjectJson: true,
    });

    expect(createLibraryContext(options, 'types')).toEqual({
      workspacePrefix: '@org',
      projectRoot: 'libs/my-resources/types',
      projectName: 'my-resources-types',
      packageName: '@org/my-resources-types',
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
      useProjectJson: true,
    });

    expect(createLibraryContext(options, 'util')).toEqual({
      workspacePrefix: '@org',
      projectRoot: 'libs/my-resources/util',
      projectName: 'my-resources-util',
      packageName: '@org/my-resources-util',
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
      useProjectJson: true,
    });
  });
});
