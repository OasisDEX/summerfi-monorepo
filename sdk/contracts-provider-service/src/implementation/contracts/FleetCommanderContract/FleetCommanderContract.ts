import { ContractAbi } from '@summerfi/abi-provider-common'
import { IBlockchainClient } from '@summerfi/blockchain-client-provider'
import {
  IArkConfiguration,
  IArkConfigurationSolidity,
  IErc20Contract,
  IErc4626Contract,
  IFleetCommanderContract,
} from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo, Percentage } from '@summerfi/sdk-common'
import { ContractWrapper } from '../ContractWrapper'
import { Erc4626Contract } from '../Erc4626Contract/Erc4626Contract'

import FleetCommanderAbiJSON from '../../../../../../earn-protocol/abis/FleetCommander.sol/FleetCommander.json'

const FleetCommanderAbi = FleetCommanderAbiJSON.abi as ContractAbi

/**
 * @name FleetCommanderContract
 * @description Implementation for the FleetCommander contract wrapper
 * @implements IFleetCommanderContract
 */
export class FleetCommanderContract<
    const TClient extends IBlockchainClient,
    TAddress extends IAddress,
  >
  extends ContractWrapper<typeof FleetCommanderAbi, TClient, TAddress>
  implements IFleetCommanderContract
{
  readonly _erc4626Contract: IErc4626Contract

  /** CONSTRUCTOR */
  constructor(params: { blockchainClient: TClient; chainInfo: IChainInfo; address: TAddress }) {
    super(params)

    this._erc4626Contract = new Erc4626Contract(params)
  }

  /** PUBLIC */

  async arks(params: { address: IAddress }): Promise<IArkConfiguration> {
    const arkConfig = (await this.contract.read.arks([
      params.address.value,
    ])) as IArkConfigurationSolidity

    return {
      maxAllocation: Percentage.createFromSolidityValue({
        value: arkConfig.maxAllocation,
      }),
    }
  }

  /** @see IFleetCommanderContract.asErc20 */
  asErc20(): IErc20Contract {
    return this.asErc4626().asErc20()
  }

  /** @see IFleetCommanderContract.asErc4626 */
  asErc4626(): IErc4626Contract {
    return this._erc4626Contract
  }

  /** @see IContractWrapper.getAbi */
  getAbi(): typeof FleetCommanderAbi {
    return FleetCommanderAbi
  }
}
