import type { PlopTypes } from '@turbo/gen'
import { setupNamesAction } from '../common'
import { ActionsCommon } from './actionsCommon'
import { ActionsService } from './actionsService'
import { setupNewServiceActions } from './helpers/SetupNewServiceActions'

export function setupSDKServiceGenerator(plop: PlopTypes.NodePlopAPI): void {
  setupNewServiceActions(plop)

  plop.setGenerator('service', {
    description: 'Adds a new service to the SDK',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: `Name of the service in PascalCase (example: "MyService")`,
      },
    ],
    actions: [
      setupNamesAction,
      {
        type: 'generateBaseDirectories',
      },
      ...ActionsCommon,
      ...ActionsService,
    ],
  })
}
