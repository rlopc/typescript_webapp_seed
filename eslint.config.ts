import eslint from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import sonarjs from 'eslint-plugin-sonarjs';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

const reactHooksRecommended = reactHooks.configs.flat['recommended-latest'];

// Hook and React Compiler rules come from the official `react-hooks` plugin.
// `@eslint-react` ships its own copies under the same names; turn those off so
// each problem is reported once, by the React team's implementation.
const eslintReactDuplicates = Object.fromEntries(
  Object.keys(reactHooksRecommended.rules).map((rule) => [
    rule.replace('react-hooks/', '@eslint-react/'),
    'off' as const,
  ]),
);

export default defineConfig(
  { ignores: ['dist', 'coverage', 'playwright-report', 'test-results'] },
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  eslintPluginUnicorn.configs.recommended,
  sonarjs.configs.recommended,
  {
    rules: {
      // `env` is the established name in this stack (`import.meta.env`,
      // `loadEnv`, `process.env`); `environment` would only obscure that.
      'unicorn/name-replacements': ['error', { replacements: { env: false } }],
      // Keep the standard JSDoc/TSDoc layout (` * ` on each line) that
      // editors, TypeDoc and most of the ecosystem expect.
      'unicorn/no-asterisk-prefix-in-documentation-comments': 'off',
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      eslintReact.configs['recommended-type-checked'],
      reactHooksRecommended,
      reactRefresh.configs.vite,
    ],
    rules: eslintReactDuplicates,
  },
  {
    // Tool configs are entry points evaluated once by their tool, never
    // imported, so reading `process.env` at the top level is their job.
    files: ['*.config.ts'],
    rules: { 'unicorn/no-top-level-side-effects': 'off' },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**', 'e2e/**'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  prettier,
);
