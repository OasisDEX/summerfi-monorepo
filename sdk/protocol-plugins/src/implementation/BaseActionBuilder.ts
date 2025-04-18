import { IAddressBookManager } from '@summerfi/address-book-common'
import {
  ActionBuilderParams,
  ActionBuilderUsedAction,
  FilterStep,
  IActionBuilder,
} from '@summerfi/protocol-plugins-common'
import { IAddress, IChainInfo, ProtocolName, SimulationSteps, steps } from '@summerfi/sdk-common'
import { getContractAddress } from '../plugins/utils/GetContractAddress'

/**
 * Base class for all action builders
 *
 * It provides convenience functions like `_delegateToProtocol` and establishes
 * a common interface for all action builders
 *
 * The side effects of this class will be reflected in the IStepBuilderContext passed to it as a parameter
 */
export abstract class BaseActionBuilder<StepType extends steps.Steps>
  implements IActionBuilder<StepType>
{
  /** @see IActionBuilder.actions */
  abstract readonly actions: ActionBuilderUsedAction[]

  /** @see IActionBuilder.build */
  public abstract build(
    params: ActionBuilderParams<FilterStep<SimulationSteps, StepType>>,
  ): Promise<void>

  /** PROTECTED */

  /**
   * Delegates the building of the action to the specific builder in the corresponding protocol plugin
   * @param protocolName The name of the protocol to delegate the action to
   * @param actionBuilderParams The parameters for the action builder
   */
  protected async _delegateToProtocol(params: {
    protocolName: ProtocolName
    actionBuilderParams: ActionBuilderParams<FilterStep<SimulationSteps, StepType>>
  }): Promise<void> {
    const { protocolName } = params
    const { protocolsRegistry } = params.actionBuilderParams

    const plugin = protocolsRegistry.getPlugin({ protocolName })
    if (!plugin) {
      throw new Error(`No protocol plugin found for protocol ${protocolName}`)
    }

    const builder = plugin.getActionBuilder(params.actionBuilderParams.step.type)
    if (!builder) {
      throw new Error(`No action builder found for protocol ${protocolName}`)
    }

    return builder.build(params.actionBuilderParams)
  }

  /**
   * Resolves the address of a contract by its name using the address book manager
   * @param addressBookManager The address book manager to use
   * @param chainInfo The chain where the contract is
   * @param contractName The name of the contract
   * @returns The address of the contract
   */
  protected async _getContractAddress(params: {
    addressBookManager: IAddressBookManager
    chainInfo: IChainInfo
    contractName: string
  }): Promise<IAddress> {
    return getContractAddress({
      addressBookManager: params.addressBookManager,
      chainInfo: params.chainInfo,
      contractName: params.contractName,
    })
  }
}
