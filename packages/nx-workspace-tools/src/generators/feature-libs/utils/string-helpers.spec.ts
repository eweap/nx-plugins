import { describe, expect, it } from 'vitest';

import { toUpperSnakeCase } from './string-helpers';

describe('toUpperSnakeCase', () => {
  it('should convert words to uppercase snake case', () => {
    expect(toUpperSnakeCase('my feature lib')).toBe('MY_FEATURE_LIB');
    expect(toUpperSnakeCase('my-feature-lib')).toBe('MY_FEATURE_LIB');
  });

  it('should convert camel case to uppercase snake case', () => {
    expect(toUpperSnakeCase('myFeatureLib')).toBe('MY_FEATURE_LIB');
  });

  it('should keep existing snake case and uppercase it', () => {
    expect(toUpperSnakeCase('my_feature_lib')).toBe('MY_FEATURE_LIB');
  });
});
