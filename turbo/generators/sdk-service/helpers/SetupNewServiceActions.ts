import { PlopTypes } from '@turbo/gen'
import { generateNewServiceDirectories } from './GenerateNewServiceDirectories'

/**
 * Registers custom actions for the service generator
 * @param plop
 */
export function setupNewServiceActions(plop: PlopTypes.NodePlopAPI) {
  plop.setActionType('generateBaseDirectories', generateNewServiceDirectories)
}
