import { PlopTypes } from '@turbo/gen'
import fs from 'node:fs'
import path from 'path'

export const generateNewServiceDirectories: PlopTypes.CustomActionFunction = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answers: any,
  config?: PlopTypes.ActionConfig,
  plop?: PlopTypes.NodePlopAPI,
) => {
  if (!plop) {
    throw new Error('plop instance is required')
  }

  if (!answers.nameKebabCase) {
    throw new Error('No Kebab case available when trying to create new Service directories')
  }

  const servicePackageCommon = `${answers.nameKebabCase}-common`
  const servicePackageService = `${answers.nameKebabCase}-service`

  const baseDirectory = path.join(
    // resolves to the root of the current workspace
    plop.getDestBasePath(),
    'sdk/',
  )

  fs.mkdirSync(path.join(baseDirectory, servicePackageCommon), { recursive: true })
  fs.mkdirSync(path.join(baseDirectory, servicePackageService), { recursive: true })

  return `Created base directories for service and common package`
}
