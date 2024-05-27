import {
  parseAbi,
  encodeFunctionData,
  encodeAbiParameters,
  parseAbiParameters,
  keccak256,
  toBytes,
  ParseAbiParameters,
} from 'viem'
import { ActionConfig, ActionCall } from './Types'
import { InputSlotsMapping } from '../types/InputSlotsMapping'
import { AbiParametersToPrimitiveTypes } from 'abitype'
import { IAction } from '../interfaces/IAction'

/**
 * @class Base class for all actions. It provides the basic functionality to encode the call to the action and provide
 *              the versioned name of the action.
 */
export abstract class BaseAction<
  Config extends ActionConfig,
  ParsedAbiParameters extends ParseAbiParameters<Config['parametersAbi']> = ParseAbiParameters<
    Config['parametersAbi']
  >,
  AbiParametersTypes extends
    AbiParametersToPrimitiveTypes<ParsedAbiParameters> = AbiParametersToPrimitiveTypes<ParsedAbiParameters>,
> implements IAction
{
  private readonly DefaultParamsMapping: InputSlotsMapping = [0, 0, 0, 0]

  /**
   * @description Returns the versioned name of the action
   * @returns The versioned name of the action
   */
  public getVersionedName(): string {
    if (this.config.version === 0) {
      // Special case for compatiblility with v1 actions
      return this.config.name
    } else {
      return `${this.config.name}_${this.config.version}`
    }
  }

  /**
   * @description Encodes the call to the action. Provided so the implementer has an opportunity to pre-process
   *              the parameters before encoding the call.
   * @param params The parameters to encode
   * @param paramsMapping The mapping of the parameters to the execution storage
   * @returns The encoded call to the action
   */
  public abstract encodeCall(params: unknown, paramsMapping?: InputSlotsMapping): ActionCall

  /**
   * @description Encodes the call to the action
   * @param params The parameters to encode
   * @param paramsMapping The mapping of the parameters to the execution storage
   * @returns The encoded call to the action
   */
  protected _encodeCall(params: {
    arguments: AbiParametersTypes
    mapping?: InputSlotsMapping
  }): ActionCall {
    const contractNameWithVersion = this.getVersionedName()
    const targetHash = keccak256(toBytes(contractNameWithVersion))

    const abi = parseAbi([
      'function execute(bytes calldata data, uint8[] paramsMap) external payable returns (bytes calldata)',
    ])

    const abiParameters = parseAbiParameters(this.config.parametersAbi as unknown as string)
    const encodedArgs = encodeAbiParameters(abiParameters, params.arguments)

    const calldata = encodeFunctionData({
      abi,
      functionName: 'execute',
      args: [encodedArgs, params.mapping ?? this.DefaultParamsMapping],
    })

    return {
      name: this.config.name,
      targetHash,
      callData: calldata,
    } as ActionCall
  }

  public abstract get config(): Config
}
