import {
  AbiContractType,
  ContractAbi,
  ContractAbiRecord,
  IAbiProvider,
} from '@summerfi/abi-provider-common'

import { FleetCommanderAbi } from '@summerfi/armada-protocol-abis'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { erc20Abi, erc4626Abi } from 'viem'

/**
 * @name AbiProvider
 * @implements IAbiProvider
 */
export class AbiProvider implements IAbiProvider {
  private _configProvider: IConfigurationProvider
  private _abis: ContractAbiRecord

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    this._configProvider = params.configProvider

    this._abis = this._getAbisConfiguration()
  }

  /** FUNCTIONS */
  async getAbi(params: { type: AbiContractType }): Promise<ContractAbi> {
    return this._abis[params.type]
  }

  /** PRIVATE */

  /**
   * @name _getAbisConfiguration
   * @description List of all the supported ABIs
   */
  private _getAbisConfiguration(): ContractAbiRecord {
    return {
      [AbiContractType.ERC20]: erc20Abi,
      [AbiContractType.ERC4626]: erc4626Abi,
      [AbiContractType.ArmadaFleetCommander]: FleetCommanderAbi,
    }
  }
}
