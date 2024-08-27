import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import {
  IErc20Contract,
  IErc4626Contract,
  IFleetCommanderContract,
} from '@summerfi/contracts-provider-common'
import {
  Address,
  IAddress,
  IChainInfo,
  ITokenAmount,
  TokenAmount,
  TransactionInfo,
} from '@summerfi/sdk-common'
import { ContractWrapper } from '../ContractWrapper'

import { FleetCommanderAbi } from '@summerfi/armada-protocol-abis'
import { Erc4626Contract } from '../Erc4626Contract/Erc4626Contract'

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

  /** FACTORY METHOD */

  /**
   * Creates a new instance of the Erc4626Contract
   *
   * @see constructor
   */
  static async create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }): Promise<IFleetCommanderContract> {
    const erc4626Contract = await Erc4626Contract.create(params)

    const instance = new FleetCommanderContract({
      blockchainClient: params.blockchainClient,
      chainInfo: params.chainInfo,
      address: params.address,
      erc4626Contract,
    })

    return instance
  }

  /** CONSTRUCTOR */
  constructor(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
    erc4626Contract: IErc4626Contract
  }) {
    super(params)

    this._erc4626Contract = params.erc4626Contract
  }

  /** READ METHODS */

  /** @see IFleetCommanderContract.arks */
  async arks(): Promise<IAddress[]> {
    const arksAddresses: IAddress[] = []
    let arkIndex = 0n
    let isZeroAddress = false

    // TODO: manual loop for getting all arks, should be refactored
    // TODO: when the new getArks method is implemented
    do {
      const arkAddressValue = await this.contract.read.arks([arkIndex++])
      const arkAddress = Address.createFromEthereum({ value: arkAddressValue })

      isZeroAddress = arkAddress.equals(Address.ZeroAddressEthereum)

      if (!isZeroAddress) {
        arksAddresses.push(arkAddress)
      }
    } while (!isZeroAddress)

    return arksAddresses
  }

  /** @see IFleetCommanderContract.depositCap */
  async depositCap(): Promise<ITokenAmount> {
    const token = await this._erc4626Contract.asset()
    const depositCap = await this.contract.read.depositCap()

    return TokenAmount.createFromBaseUnit({ token, amount: String(depositCap) })
  }

  /** @see IFleetCommanderContract.maxDeposit */
  async maxDeposit(params: { user: IAddress }): Promise<ITokenAmount> {
    const token = await this._erc4626Contract.asset()
    const maxDeposit = await this.contract.read.maxDeposit([params.user.value])

    return TokenAmount.createFromBaseUnit({ token, amount: String(maxDeposit) })
  }

  /** @see IFleetCommanderContract.maxWithdraw */
  async maxWithdraw(params: { user: IAddress }): Promise<ITokenAmount> {
    const token = await this._erc4626Contract.asset()
    const maxWithdraw = await this.contract.read.maxWithdraw([params.user.value])

    return TokenAmount.createFromBaseUnit({ token, amount: String(maxWithdraw) })
  }

  /** WRITE METHODS */

  /** @see IFleetCommanderContract.deposit */
  async deposit(params: { assets: ITokenAmount; receiver: IAddress }): Promise<TransactionInfo> {
    return this.asErc4626().deposit(params)
  }

  /** @see IFleetCommanderContract.withdraw */
  async withdraw(params: {
    assets: ITokenAmount
    receiver: IAddress
    owner: IAddress
  }): Promise<TransactionInfo> {
    return this.asErc4626().withdraw(params)
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
