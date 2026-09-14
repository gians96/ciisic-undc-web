import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/unified-signatures': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/no-dupe-keys': 'warn',
    'nuxt/prefer-import-meta': 'warn',
    'import/first': 'warn',
    'no-prototype-builtins': 'warn',
    'no-useless-catch': 'warn',
    '@typescript-eslint/no-unsafe-function-type': 'warn',
    'vue/require-toggle-inside-transition': 'warn',
  },
})
