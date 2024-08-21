import { IBuildOrderDependencies } from './IBuildOrderDependencies'
import { IBuildOrderInputs } from './IBuildOrderInputs'

/**
 * Type for the parameters to build an order, shared among all order planners
 */
export interface BuildOrderParams extends IBuildOrderInputs, IBuildOrderDependencies {
  // Empty on purpose
}
