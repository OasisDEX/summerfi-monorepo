import { IBlockchainClient } from '@summerfi/blockchain-client-provider'
import {
  IAddress,
  IChainInfo,
  IToken,
  ITokenAmount,
  Maybe,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common'
import { erc20Abi } from 'viem'
import { IErc20Contract } from '../../interfaces/contracts/IErc20Contract'
import { ContractWrapper } from './ContractWrapper'

/**
 * @name Erc20Contract
 * @description Implementation for the ERC20 contract wrapper
 * @implements IErc20Contract
 */
export class Erc20Contract<const TClient extends IBlockchainClient, TAddress extends IAddress>
  extends ContractWrapper<typeof erc20Abi, TClient, TAddress>
  implements IErc20Contract
{
  private _token: Maybe<IToken>

  /** CONSTRUCTOR */
  constructor(params: { blockchainClient: TClient; chainInfo: IChainInfo; address: TAddress }) {
    super(params)
  }

  /** PUBLIC */

  /** @see IErc20Contract.getToken */
  async getToken(): Promise<IToken> {
    if (!this._token) {
      this._token = await this._retrieveTokenInfo()
    }
    return this._token
  }

  /** @see IErc20Contract.balanceOf */
  async balanceOf(params: { address: IAddress }): Promise<ITokenAmount> {
    const balance = await this.contract.read.balanceOf([params.address.value])
    const token = await this.getToken()

    return TokenAmount.createFrom({
      token,
      amount: balance.toString(),
    })
  }

  /** @see IContractWrapper.getAbi */
  getAbi(): typeof erc20Abi {
    return erc20Abi
  }

  /** PRIVATE */
  private async _retrieveTokenInfo(): Promise<IToken> {
    const decimals = await this.contract.read.decimals()
    const symbol = await this.contract.read.symbol()
    const name = await this.contract.read.name()

    return Token.createFrom({
      address: this.address,
      chainInfo: this.chainInfo,
      decimals,
      symbol,
      name,
    })
  }
}
