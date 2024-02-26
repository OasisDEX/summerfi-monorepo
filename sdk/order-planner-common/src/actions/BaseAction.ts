import { ActionCall } from '~orderplannercommon/actions'
import {
  parseAbi,
  encodeFunctionData,
  encodeAbiParameters,
  parseAbiParameters,
  keccak256,
  toBytes,
} from 'viem'
import { ActionConfig } from './Types'

/**
 * @class Base class for all actions. It provides the basic functionality to encode the call to the action and provide
 *              the versioned name of the action.
 */
export abstract class BaseAction {
  public abstract readonly config: ActionConfig

  /**
   * @description Returns the versioned name of the action
   * @returns The versioned name of the action
   */
  public getVersionedName(): string {
    return `${this.config.name}_v${this.config.version}`
  }

  /**
   * @description Encodes the call to the action. Provided so the implementer has an opportunity to pre-process
   *              the parameters before encoding the call.
   * @param params The parameters to encode
   * @param paramsMapping The mapping of the parameters to the execution storage
   * @returns The encoded call to the action
   */
  public abstract encodeCall(params: unknown, paramsMapping?: number[]): ActionCall

  /**
   * @description Encodes the call to the action
   * @param params The parameters to encode
   * @param paramsMapping The mapping of the parameters to the execution storage
   * @returns The encoded call to the action
   */
  protected _encodeCall(params: unknown[], paramsMapping: number[] = []): ActionCall {
    const contractNameWithVersion = this.getVersionedName()
    const targetHash = keccak256(toBytes(contractNameWithVersion))

    const abi = parseAbi([
      'function execute(bytes calldata data, uint8[] paramsMap) external payable returns (bytes calldata)',
    ])

    const encodedArgs = encodeAbiParameters(parseAbiParameters(this.config.parametersAbi), params)

    const calldata = encodeFunctionData({
      abi,
      functionName: 'execute',
      args: [encodedArgs, paramsMapping],
    })

    return {
      targetHash,
      callData: calldata,
    } as ActionCall
  }
}
