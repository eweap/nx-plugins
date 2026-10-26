import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { BASE_CONTEXT } from '../../../../testing/contexts';
import { patchEslintConfig } from './eslint-config-mjs.patch';

describe('patchEslintConfig', () => {
  let tree: Tree;
  const projectRoot = 'libs/my-resources/data-access';
  const eslintConfigPath = `${projectRoot}/eslint.config.mjs`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    tree.write(
      eslintConfigPath,
      [
        "import baseConfig from '../../../eslint.config.mjs';",
        '',
        'export default [',
        '  ...baseConfig,',
        "  { ignores: ['**/out-tsc'] },",
        '];',
      ].join('\n'),
    );
  });

  it('adds custom rules without changing the base config', () => {
    patchEslintConfig(tree, {
      ...BASE_CONTEXT,
      projectRoot,
    });

    expect(tree.read(eslintConfigPath, 'utf-8')).toBe(
      [
        "import baseConfig, { customRules } from '../../../eslint.config.mjs';",
        '',
        'export default [',
        '  ...baseConfig,',
        "  { ignores: ['**/out-tsc'] },",
        '  ...customRules,',
        '];',
      ].join('\n'),
    );
  });

  it('does not duplicate the custom rules import or spread', () => {
    patchEslintConfig(tree, {
      ...BASE_CONTEXT,
      projectRoot,
    });
    const patchedContent = tree.read(eslintConfigPath, 'utf-8');

    patchEslintConfig(tree, {
      ...BASE_CONTEXT,
      projectRoot,
    });

    expect(tree.read(eslintConfigPath, 'utf-8')).toBe(patchedContent);
  });
});
