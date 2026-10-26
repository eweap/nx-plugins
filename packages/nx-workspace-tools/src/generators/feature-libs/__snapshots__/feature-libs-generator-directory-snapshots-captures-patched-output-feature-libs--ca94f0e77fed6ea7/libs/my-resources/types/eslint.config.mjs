import baseConfig, { customRules } from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    ignores: ['**/out-tsc'],
  },
  ...customRules,
];
