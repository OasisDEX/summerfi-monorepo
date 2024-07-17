import { IBlockchainClient } from '@summerfi/blockchain-client-provider'
import { IErc20Contract, IErc4626Contract } from '@summerfi/contracts-provider-common'
import {
  Address,
  IAddress,
  IChainInfo,
  IToken,
  ITokenAmount,
  Maybe,
  TokenAmount,
  TransactionInfo,
} from '@summerfi/sdk-common'
import { Abi, encodeFunctionData, erc4626Abi } from 'viem'
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
  private readonly _erc20Contract: IErc20Contract
  private _asset: Maybe<IToken>

  /** CONSTRUCTOR */
  constructor(params: { blockchainClient: TClient; chainInfo: IChainInfo; address: TAddress }) {
    super(params)

    this._erc20Contract = new Erc20Contract(params)
  }

  /** PUBLIC */

  /** READ METHODS */

  /** @see IErc4626Contract.asset */
  async asset(): Promise<IToken> {
    if (!this._asset) {
      await this._updateAsset()
    }
    if (!this._asset) {
      throw new Error('Could not retrieve underlying asset information')
    }

    return this._asset
  }

  /** @see IErc4626Contract.totalAssets */
  async totalAssets(): Promise<ITokenAmount> {
    const totalAssets = await this.contract.read.totalAssets()
    const token = await this.asset()

    return TokenAmount.createFromBaseUnit({
      token,
      amount: totalAssets.toString(),
    })
  }

  /** WRITE METHODS */

  /** @see IErc4626Contract.deposit */
  async deposit(params: { amount: ITokenAmount; receiver: IAddress }): Promise<TransactionInfo> {
    const calldata = encodeFunctionData({
      abi: this.getAbi() as Abi,
      functionName: 'deposit',
      args: [params.amount.toBaseUnit(), params.receiver.value],
    })

    return {
      description: `Deposit ${params.amount} on vault ${this.address}`,
      transaction: {
        calldata,
        target: this.address,
        value: '0',
      },
    }
  }

  /** @see IErc4626Contract.withdraw */
  async withdraw(params: {
    amount: ITokenAmount
    receiver: IAddress
    owner: IAddress
  }): Promise<TransactionInfo> {
    const calldata = encodeFunctionData({
      abi: this.getAbi() as Abi,
      functionName: 'withdraw',
      args: [params.amount.toBaseUnit(), params.receiver.value, params.owner.value],
    })

    return {
      description: `Withdraw ${params.amount} from vault ${this.address} to address ${params.receiver} on behalf of ${params.owner}`,
      transaction: {
        calldata,
        target: this.address,
        value: '0',
      },
    }
  }

  /** CONVERSION METHODS */

  /** @see IErc4626Contract.asErc20 */
  asErc20(): IErc20Contract {
    return this._erc20Contract
  }

  /** @see IContractWrapper.getAbi */
  getAbi(): typeof erc4626Abi {
    return erc4626Abi
  }

  /** PRIVATE */
  private async _updateAsset(): Promise<void> {
    const assetAddress = await this.contract.read.asset()

    const assetErc20Contract = new Erc20Contract({
      blockchainClient: this.blockchainClient,
      chainInfo: this.chainInfo,
      address: Address.createFromEthereum({
        value: assetAddress,
      }),
    })

    this._asset = await assetErc20Contract.getToken()
  }
}
