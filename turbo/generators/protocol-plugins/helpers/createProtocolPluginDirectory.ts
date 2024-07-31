import { PlopTypes } from '@turbo/gen'
import fs from 'node:fs'
import path from 'path'

export const createProtocolPluginDirectory: PlopTypes.CustomActionFunction = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answers: any,
  config?: PlopTypes.ActionConfig,
  plop?: PlopTypes.NodePlopAPI,
) => {
  if (!plop) {
    throw new Error('plop instance is required')
  }

  if (!answers.nameKebabCase) {
    return 'no name provided, skipping plugin directory creation'
  }

  const directory = path.join(
    // resolves to the root of the current workspace
    plop.getDestBasePath(),
    'sdk/protocol-plugins/src/plugins',
    answers.nameKebabCase,
  )

  fs.mkdirSync(directory)
  // Make inner directories
  fs.mkdirSync(`${directory}/abis`)
  fs.mkdirSync(`${directory}/implementation`)
  fs.mkdirSync(`${directory}/interfaces`)
  fs.mkdirSync(`${directory}/types`)

  return `created empty ${directory} directory for protocol plugin`
}
