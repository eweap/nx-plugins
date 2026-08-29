import { describe, expect, it } from 'vitest';

import { toUpperSnakeCase } from './string-helpers';

describe('toUpperSnakeCase', () => {
  it('converts words to uppercase snake case', () => {
    expect(toUpperSnakeCase('my feature lib')).toBe('MY_FEATURE_LIB');
    expect(toUpperSnakeCase('my-feature-lib')).toBe('MY_FEATURE_LIB');
  });

  it('converts camel case to uppercase snake case', () => {
    expect(toUpperSnakeCase('myFeatureLib')).toBe('MY_FEATURE_LIB');
  });

  it('keeps existing snake case and uppercases it', () => {
    expect(toUpperSnakeCase('my_feature_lib')).toBe('MY_FEATURE_LIB');
  });
});
