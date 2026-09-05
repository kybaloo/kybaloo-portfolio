import coreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {ignores: ['.next/**', 'node_modules/**', 'playwright-report/**', 'test-results/**']},
  ...coreWebVitals,
  ...nextTypescript,
  {
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    },
  },
];
