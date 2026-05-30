import fs from 'node:fs'
import path from 'node:path'

export function modifyESLintCfg() {
  const eslintPath = path.join(process.cwd(), 'eslint.config.mjs')

  try {
    const configContent = `import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierConfig,
  {
    plugins: {
      import: eslintPluginImport,
      unicorn: eslintPluginUnicorn,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/explicit-function-return-type': ['error', { allowedNames: [] }],
      'no-console': 'warn',
      'curly': 'error',
      'import/order': ['warn', { alphabetize: { order: 'asc' } }],
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'prefer-const': 'warn',
      'eqeqeq': ['error', 'always'],
    },
  }
);`

    fs.writeFileSync(eslintPath, configContent)
    console.log('eslint.config.mjs created')
  } catch (err) {
    console.error('error writing eslint config:', err)
  }
}

export function configurePrettier() {
  const prettierrcPath = path.join(process.cwd(), '.prettierrc')

  const prettierConfig = {
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    printWidth: 100,
    endOfLine: 'lf'
  }

  try {
    fs.writeFileSync(prettierrcPath, JSON.stringify(prettierConfig, null, 2))
    console.log('.prettierrc updated')
  } catch (err) {
    console.error('error writing prettier config:', err)
  }
}

export function modifyTSCfg() {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')

  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'))
      
      tsconfig.compilerOptions = {
        ...tsconfig.compilerOptions,
        module: 'nodenext',
        target: 'esnext',
        strict: true,
        outDir: './dist',
        rootDir: './src',
      }
      tsconfig.include = ['src/**/*']

      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2))
      console.log('tsconfig.json updated')
    } catch (err) {
      console.error('error modifying tsconfig:', err)
    }
  }
}

export function addScripts() {
  const packagePath = path.join(process.cwd(), 'package.json')

  if (fs.existsSync(packagePath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
      
      pkg.scripts = {
        ...pkg.scripts,
        start: 'tsx src/index.mts',
        build: 'rm -rf dist && tsc',
        lint: 'eslint "src/**/*.{ts,mts}" --fix',
        format: 'prettier --write "src/**/*.{ts,mts}"',
      }

      fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2))
      console.log('package.json scripts updated')
    } catch (err) {
      console.error('error updating package.json:', err)
    }
  }
}