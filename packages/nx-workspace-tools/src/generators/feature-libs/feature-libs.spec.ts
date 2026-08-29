import { Tree, readProjectConfiguration, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import featureLibsGenerator from './feature-libs';
import { FeatureLibsGeneratorSchema } from './schema';

describe.skip('feature-libs generator', () => {
  let tree: Tree;
  const options: FeatureLibsGeneratorSchema = {
    libsPath: 'libs/my-ressources',
    ressourceNameSingular: 'ressource',
    ressourceNamePlural: 'my-ressources',
    workspacePrefix: '@org',
    libTypes: [],
    useProjectJson: false,
  };

  function readGeneratedFile(filePath: string) {
    expect(tree.exists(filePath)).toBe(true);

    const fileContent = tree.read(filePath, 'utf-8');
    expect(fileContent).not.toBeNull();

    return fileContent as string;
  }

  function expectGeneratedFileToMatchSnapshot(generatedFilePath: string) {
    const generatedContent = readGeneratedFile(generatedFilePath)
      .replace(/\r\n/g, '\n')
      .trimEnd();
    const snapshotContent = readFileSync(
      path.join(
        process.cwd(),
        'src/generators/feature-libs',
        getSnapshotPath(generatedFilePath),
      ),
      'utf-8',
    )
      .replace(/\r\n/g, '\n')
      .trimEnd();

    expect(generatedContent).toBe(snapshotContent);
  }

  function getSnapshotPath(
    generatedFilePath: string,
    snapshotFileName = path.posix.basename(generatedFilePath),
  ) {
    const generatedLibsRoot = 'libs/my-ressources';
    const snapshotDirectory = path.posix.relative(
      generatedLibsRoot,
      path.posix.dirname(generatedFilePath),
    );

    return path.posix.join(
      '.',
      '__snapshots__',
      snapshotDirectory,
      snapshotFileName,
    );
  }

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    tree.write(
      '.prettierrc',
      readFileSync(path.join(__dirname, '../../../../../.prettierrc'), 'utf-8'),
    );

    // Nx only generates library package.json files with useProjectJson enabled
    // when the workspace is detected as a pnpm ts-solution workspace.
    tree.write(
      'pnpm-workspace.yaml',
      [
        'packages:',
        '  - "applications/*"',
        '  - "libs/*"',
        '  - "libs/*/*"',
        '  - "tools/*"',
      ].join('\n'),
    );

    updateJson(tree, 'tsconfig.base.json', (tsConfigBase) => ({
      ...tsConfigBase,
      compilerOptions: {
        ...(tsConfigBase.compilerOptions ?? {}),
        composite: true,
      },
    }));

    tree.write(
      'tsconfig.json',
      JSON.stringify(
        {
          extends: './tsconfig.base.json',
          files: [],
          references: [],
        },
        null,
        2,
      ),
    );
  });

  it('should add custom rules to the generated eslint config for each lib type', async () => {
    await featureLibsGenerator(tree, {
      ...options,
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
    });

    const eslintConfigPaths = [
      'libs/my-ressources/feature/eslint.config.mjs',
      'libs/my-ressources/data-access/eslint.config.mjs',
      'libs/my-ressources/ui/eslint.config.mjs',
      'libs/my-ressources/types/eslint.config.mjs',
      'libs/my-ressources/util/eslint.config.mjs',
    ];

    for (const eslintConfigPath of eslintConfigPaths) {
      expectGeneratedFileToMatchSnapshot(eslintConfigPath);
    }
  });

  it('should update package.json exports when the generated package exists', async () => {
    await featureLibsGenerator(tree, {
      ...options,
      libTypes: ['data-access'],
    });

    const packageJsonContent = tree.read(
      'libs/my-ressources/data-access/package.json',
      'utf-8',
    );

    expect(packageJsonContent).not.toBeNull();

    const packageJson = JSON.parse(packageJsonContent as string);

    expect(packageJson.exports).toEqual({
      '.': {
        types: './src/index.ts',
        import: './src/index.ts',
        default: './src/index.ts',
      },
    });
    expect(packageJson.devDependencies).toEqual({});
  });

  it('should include vue files in feature and ui tsconfig.spec', async () => {
    await featureLibsGenerator(tree, {
      ...options,
      libTypes: ['feature', 'ui'],
    });

    const featureSpecTsConfig = JSON.parse(
      readGeneratedFile('libs/my-ressources/feature/tsconfig.spec.json'),
    );
    const uiSpecTsConfig = JSON.parse(
      readGeneratedFile('libs/my-ressources/ui/tsconfig.spec.json'),
    );

    expect(featureSpecTsConfig.include.at(-1)).toBe('src/**/*.vue');
    expect(uiSpecTsConfig.include.at(-1)).toBe('src/**/*.vue');
  });

  it('should generate all requested library projects', async () => {
    await featureLibsGenerator(tree, {
      ...options,
      libTypes: ['feature', 'data-access', 'ui', 'types', 'util'],
    });

    expect(readProjectConfiguration(tree, 'my-ressources')).toBeDefined();
    expect(
      readProjectConfiguration(tree, 'my-ressources-data-access'),
    ).toBeDefined();
    expect(readProjectConfiguration(tree, 'my-ressources-ui')).toBeDefined();
    expect(readProjectConfiguration(tree, 'my-ressources-types')).toBeDefined();
    expect(readProjectConfiguration(tree, 'my-ressources-util')).toBeDefined();
  });

  describe('data-access', () => {
    it('should generate a data-access project', async () => {
      await featureLibsGenerator(tree, {
        ...options,
        libTypes: ['data-access'],
      });

      expect(
        readProjectConfiguration(tree, 'my-ressources-data-access'),
      ).toBeDefined();
    });
  });

  describe('feature', () => {
    it('should generate the feature vite config with the tailwind plugin', async () => {
      await featureLibsGenerator(tree, {
        ...options,
        libTypes: ['feature'],
      });

      expectGeneratedFileToMatchSnapshot(
        'libs/my-ressources/feature/vite.config.mts',
      );
    });
  });

  describe('ui', () => {
    it('should generate the ui vite config with the tailwind plugin', async () => {
      await featureLibsGenerator(tree, {
        ...options,
        libTypes: ['ui'],
      });

      expectGeneratedFileToMatchSnapshot(
        'libs/my-ressources/ui/vite.config.mts',
      );
    });

    describe('storybook', () => {
      it('should generate storybook files for ui libs', async () => {
        await featureLibsGenerator(tree, {
          ...options,
          libTypes: ['ui', 'util'],
        });

        expectGeneratedFileToMatchSnapshot(
          'libs/my-ressources/ui/.storybook/main.ts',
        );
        expectGeneratedFileToMatchSnapshot(
          'libs/my-ressources/ui/.storybook/preview.ts',
        );
        expectGeneratedFileToMatchSnapshot(
          'libs/my-ressources/ui/.storybook/styles.css',
        );
        expectGeneratedFileToMatchSnapshot(
          'libs/my-ressources/ui/tsconfig.storybook.json',
        );
      });

      it('should override storybook tsconfig include entries for ui libs', async () => {
        await featureLibsGenerator(tree, {
          ...options,
          libTypes: ['ui'],
        });

        const storybookTsConfig = JSON.parse(
          readGeneratedFile('libs/my-ressources/ui/tsconfig.storybook.json'),
        );

        expect(storybookTsConfig.include).toContain('.storybook/*.js');
        expect(storybookTsConfig.include).toContain('.storybook/**/*.ts');
        expect(storybookTsConfig.include).not.toContain('.storybook/**/*.vue');
      });
    });
  });
});
