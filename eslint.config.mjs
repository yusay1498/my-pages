import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import nextConfig from 'eslint-config-next/core-web-vitals';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  { ignores: ['node_modules/*'] },
  js.configs.recommended,
  // Next.js flat config (includes @typescript-eslint, react, react-hooks, import, jsx-a11y)
  ...nextConfig,
  // Disable JS rules that TypeScript handles for TS files
  tsPlugin.configs['flat/eslint-recommended'],
  // Tailwind CSS flat config
  ...tailwindcssPlugin.configs['flat/recommended'],
  // eslint-plugin-tailwindcss にv4のCSSベース設定を指示
  {
    settings: {
      tailwindcss: {
        // Tailwind v4: CSS ファイルの絶対パスを config に指定
        config: path.resolve(__dirname, 'src/styles/globals.css'),
      },
    },
  },
  // Prettier flat config (must come after other style rules)
  prettierPlugin,
  // Custom rules for TypeScript/TSX files
  {
    files: ['**/*.ts', '**/*.tsx'],
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      '@next/next/no-img-element': 'off',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: [
                './src/components',
                './src/hooks',
                './src/lib',
                './src/types',
                './src/utils',
              ],
              from: ['./src/features', './src/app'],
            },
          ],
        },
      ],
      'import/no-cycle': 'error',
      'linebreak-style': ['error', 'unix'],
      'react/prop-types': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-named-as-default': 'off',
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': ['off'],
      '@typescript-eslint/explicit-module-boundary-types': ['off'],
      '@typescript-eslint/no-empty-function': ['off'],
      '@typescript-eslint/no-explicit-any': ['off'],
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    },
  },
];
