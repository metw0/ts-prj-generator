import { execSync } from 'node:child_process'
import * as fs from 'node:fs'

export function initProject(): void {
  try {
    console.log('initializing TypeScript project...')
    execSync('npm init -y', { stdio: 'inherit' })
    fs.writeFileSync('tsconfig.json', '{}')

    console.log('installing dependencies...')
    const dependencies = [
      'typescript',
      'tsx',
      'eslint',
      'typescript-eslint',
      '@eslint/js',
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'eslint-plugin-import',
      'eslint-plugin-unicorn',
      'prettier',
      '@types/node',
      '@types/eslint',
      '@types/prettier',
    ]

    const command = `npm install -D ${dependencies.join(' ')} --legacy-peer-deps`
    execSync(command, { stdio: 'inherit' })

    console.log('dependencies installed successfully')
  } catch (error) {
    console.error('error installing dependencies:', error)
  }
}

export function configureProject(): void {
  try {
    console.log('creating src/ and dist/...')
    fs.mkdirSync('src', { recursive: true })
    const indexContent = `export default function helloWorld() {
      console.log('Hello, world!');
    }`
    fs.writeFileSync('src/index.mts', indexContent)

    fs.mkdirSync('dist', { recursive: true })

    console.log('creating .prettierrc...')
    fs.writeFileSync('.prettierrc', '{}')

    console.log('project configured successfully')
  } catch (error) {
    console.error('error while configuring project:', error)
  }
}
