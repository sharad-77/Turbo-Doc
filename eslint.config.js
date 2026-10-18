import js from '@eslint/js';
import turbo from 'eslint-plugin-turbo';

export default [
  { ignores: ['**/.next/**', '**/node_modules/**', '**/.turbo/**', '**/dist/**'] },
  js.configs.recommended,
  {
    plugins: { turbo },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
];
