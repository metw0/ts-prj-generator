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
      '@typescript-eslint/explicit-function-return-type': (node) => {
        if (node.type === 'FunctionDeclaration') {
          return true;
        }
      },
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
    console.log('eslint.config.mjs has been created')
  } catch (err) {
    console.error('error while writing eslint.config.mjs: ', err)
  }
}

export function modifyPrittierCfg() {
  const prettierrcPath = path.join(process.cwd(), '.prettierrc')

  if (fs.existsSync(prettierrcPath)) {
    try {
      let prettierConfig = JSON.parse(fs.readFileSync(prettierrcPath, 'utf8'))
      prettierConfig = {
        arrowParens: 'always',
        bracketSameLine: false,
        bracketSpacing: true,
        embeddedLanguageFormatting: 'auto',
        endOfLine: 'lf',
        jsxSingleQuote: false,
        printWidth: 100,
        proseWrap: 'always',
        quoteProps: 'as-needed',
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        useTabs: false,
      }
      fs.writeFileSync(prettierrcPath, JSON.stringify(prettierConfig, null, 2))
      console.log('.prettierrc has been updated')
    } catch (err) {
      console.error('error while reading or writing .prettierrc: ', err)
    }
  } else {
    console.log('.prettierrc does not exist in the current directory')
  }
}

export function modifyTSCfg() {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')

  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfigConfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'))
      tsconfigConfig.compilerOptions = {
        module: 'nodenext',
        target: 'esnext',
        types: ['node'],
        sourceMap: true,
        declaration: true,
        declarationMap: true,
        strict: true,
        noImplicitAny: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        esModuleInterop: true,
        outDir: './dist',
        rootDir: './src',
      }
      tsconfigConfig.include = ['src/**/*']
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfigConfig, null, 2))
      console.log('tsconfig.json has been updated')
    } catch (err) {
      console.error('error while reading or writing tsconfig.json: ', err)
    }
  } else {
    console.log('tsconfig.json does not exist in the current directory')
  }
}

export function addScripts() {
  const packagePath = path.join(process.cwd(), 'package.json')

  if (fs.existsSync(packagePath)) {
    try {
      const packageConfig = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
      packageConfig.scripts = {
        start: 'tsx src/index.mts',
        build: 'rm -rf dist && mkdir dist && tsc',
        test: 'tsc --noEmit --pretty',
        lint: 'eslint "src/**/*.ts" --fix',
        format: 'prettier --write "src/**/*.ts"',
      }
      fs.writeFileSync(packagePath, JSON.stringify(packageConfig, null, 2))
      console.log('package.json has been updated')
    } catch (err) {
      console.error('error while reading or writing package.json: ', err)
    }
  } else {
    console.log('package.json does not exist in the current directory')
  }
}
