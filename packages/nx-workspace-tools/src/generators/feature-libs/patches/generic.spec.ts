import { Tree } from '@nx/devkit';
import { type Mock, describe, expect, it, vi } from 'vitest';

import { BASE_CONTEXT } from '../../../../testing/contexts';
import { patchEslintConfig } from './eslint-config-mjs.patch';
import { runGenericPatch } from './generic';
import { patchPackageJson } from './package-json.patch';

vi.mock(import('./eslint-config-mjs.patch.js'), async (importOriginal) => ({
  ...(await importOriginal()),
  patchEslintConfig: vi.fn(),
}));

vi.mock(import('./package-json.patch.js'), async (importOriginal) => ({
  ...(await importOriginal()),
  patchPackageJson: vi.fn(),
}));

describe('runGenericPatch', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should apply generic patches in order', () => {
    const tree = {} as Tree;
    const context = {
      ...BASE_CONTEXT,
      projectRoot: 'libs/my-ressources',
    };

    runGenericPatch(tree, context);

    expect(patchEslintConfig as Mock).toHaveBeenCalledWith(tree, context);
    expect(patchPackageJson as Mock).toHaveBeenCalledWith(tree, context);
  });
});
