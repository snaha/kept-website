import svelteParser from 'svelte-eslint-parser'

import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginSvelte from 'eslint-plugin-svelte'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

export default typescriptEslint.config(
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  eslintConfigPrettier,
  ...eslintPluginSvelte.configs['flat/prettier'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: typescriptEslint.parser,
        extraFileExtensions: ['.svelte'],
      },
    },
  },
  {
    files: ['src/lib/components/ui/**/*.svelte'],
    rules: {
      'svelte/no-navigation-without-resolve': 'off',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'ImportDeclaration[source.value=/^\\..*\\.(?!(svelte|svg|json|css|png|webp|woff2)$)\\w+$/]',
          message:
            'Unnecessary file extension in relative import. Only .svelte, .json, .css and asset (.svg, .png, .webp, .woff2) extensions are allowed. (#lib/ imports need their extension.)',
        },
        {
          selector: 'ImportDeclaration[source.value=/\\/index$/]',
          message: 'Do not import from /index explicitly. Import from the directory instead.',
        },
      ],
    },
  },
  {
    ignores: [
      '**/.svelte-kit',
      '**/build',
      '**/dist',
      '**/node_modules',
      '**/package',
      '.claude/settings.local.json',
      '**/.cache',
      '**/playwright-report',
      '**/test-results',
    ],
  },
)
