import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

export default typescriptEslint.config(
  {
    ignores: ['out/**/*'],
  },
  ...typescriptEslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      '@typescript-eslint': typescriptEslint.plugin,
    },
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: typescriptEslint.parser,
      parserOptions: {
        ecmaVersion: 2021, // TODO: remove if languageOptions.ecmaVersion is enough
        tsconfigRootDir: import.meta.dirname,
        projectService: {
          allowDefaultProject: ['.*', '*.*', 'test/*.*'],
          defaultProject: 'tsconfig.eslint.json', // TODO: remove if we can eleminate this file
        },
      },
      sourceType: 'module', // TODO: is sourceType needed?
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'allow',
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-inferrable-types': [
        'error',
        {
          ignoreParameters: true,
          ignoreProperties: true,
        },
      ],
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/return-await': 'error',
      'eol-last': ['error', 'always'],
    },
  },
)
