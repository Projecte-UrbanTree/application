// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  {
    plugins: {
      "unused-imports": eslintPluginUnusedImports,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  }
);
