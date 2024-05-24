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
import { HexData } from '@summerfi/sdk-common'

export interface BaseActionParams {}

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

  /** @see IAction.getVersionedName */
  public getVersionedName(): string {
    if (this.config.version === 0) {
      // Special case for compatiblility with v1 actions
      return this.config.name
    } else {
      return `${this.config.name}_${this.config.version}`
    }
  }

  /** @see IAction.getActionHash */
  public getActionHash(): HexData {
    return keccak256(toBytes(this.getVersionedName()))
  }

  /** @see IAction.encodeCall */
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
    const targetHash = this.getActionHash()

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
      skipped: false,
    } as ActionCall
  }

  public abstract get config(): Config
}
