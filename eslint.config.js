import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import turbo from 'eslint-plugin-turbo';

export default [
  { ignores: ['**/.next/**', '**/node_modules/**', '**/.turbo/**'] },
  js.configs.recommended,
  {
    plugins: { turbo },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    files: ['apps/web/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
];
