import { IBlockchainClient } from '@summerfi/blockchain-client-provider'
import { IErc20Contract, IErc4626Contract } from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo, ITokenAmount, TokenAmount } from '@summerfi/sdk-common'
import { erc4626Abi } from 'viem'
import { ContractWrapper } from '../ContractWrapper'
import { Erc20Contract } from '../Erc20Contract/Erc20Contract'

/**
 * @name Erc4626Contract
 * @description Implementation for the ERC4626 contract wrapper
 * @implements IErc4626Contract
 */
export class Erc4626Contract<const TClient extends IBlockchainClient, TAddress extends IAddress>
  extends ContractWrapper<typeof erc4626Abi, TClient, TAddress>
  implements IErc4626Contract
{
  readonly _erc20Contract: IErc20Contract

  /** CONSTRUCTOR */
  constructor(params: { blockchainClient: TClient; chainInfo: IChainInfo; address: TAddress }) {
    super(params)

    this._erc20Contract = new Erc20Contract(params)
  }

  /** PUBLIC */

  /** @see IErc4626Contract.totalAssets */
  async totalAssets(): Promise<ITokenAmount> {
    const totalAssets = await this.contract.read.totalAssets()

    return TokenAmount.createFrom({
      token: await this.asErc20().getToken(),
      amount: totalAssets.toString(),
    })
  }

  /** @see IErc4626Contract.asErc20 */
  asErc20(): IErc20Contract {
    return this._erc20Contract
  }

  /** @see IContractWrapper.getAbi */
  getAbi(): typeof erc4626Abi {
    return erc4626Abi
  }
}
