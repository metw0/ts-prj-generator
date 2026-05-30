import { initProject, configureProject } from './manager.js'
import { modifyESLintCfg, modifyPrittierCfg, modifyTSCfg, addScripts } from './redactor.js'

function main(): void {
  initProject()
  configureProject()
  modifyTSCfg()
  modifyESLintCfg()
  modifyPrittierCfg()
  addScripts()
}

main()

console.log('success')
