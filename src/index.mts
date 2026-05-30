import { initProject, configureProject } from './manager.js'
import { modifyESLintCfg, configurePrettier, modifyTSCfg, addScripts } from './redactor.js'

function main(): void {
  initProject()
  configureProject()
  modifyTSCfg()
  modifyESLintCfg()
  configurePrettier()
  addScripts()
}

main()

console.log('success')
