import { HexData } from '@summerfi/sdk-common'
import { ActionConfig, ActionCall } from '../actions/Types'
import { InputSlotsMapping } from '../types/InputSlotsMapping'

/**
 * @class Base class for all actions. It provides the basic functionality to encode the call to the action and provide
 *              the versioned name of the action.
 */
export interface IAction {
  /**
   * @description Returns the versioned name of the action
   * @returns The versioned name of the action
   */
  getVersionedName(): string

  /**
   * @description Returns the hash of the action
   * @returns The hash of the action
   */
  getActionHash(): HexData

  /**
   * @description Encodes the call to the action. Provided so the implementer has an opportunity to pre-process
   *              the parameters before encoding the call.
   * @param params The parameters to encode
   * @param paramsMapping The mapping of the parameters to the execution storage
   * @returns The encoded call to the action
   */
  encodeCall(params: unknown, paramsMapping?: InputSlotsMapping): ActionCall

  /**
   * @description Returns the configuration of the action
   * @returns The configuration of the action
   */
  get config(): ActionConfig
}

/**
 * Constructor type for an action
 */
export type IActionConstructor = new () => IAction
