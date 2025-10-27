import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import {
  IErc20Contract,
  IErc4626Contract,
  IFleetCommanderContract,
  RebalanceDataSolidity,
} from '@summerfi/contracts-provider-common'
import {
  Address,
  IAddress,
  IChainInfo,
  IPercentage,
  ITokenAmount,
  SDKError,
  SDKErrorType,
  TokenAmount,
  TransactionInfo,
  type AddressValue,
  type IFleetConfig,
  type IRebalanceData,
} from '@summerfi/sdk-common'
import { ContractWrapper } from '../ContractWrapper'

import { FleetCommanderWhitelistAbi } from '@summerfi/armada-protocol-abis'
import { Erc4626Contract } from '../Erc4626Contract/Erc4626Contract'
import type { ITokensManager } from '@summerfi/tokens-common'
import { encodeFunctionData } from 'viem'

/**
 * @name FleetCommanderContract
 * @description Implementation for the FleetCommander contract wrapper
 * @implements IFleetCommanderContract
 */
export class FleetCommanderContract<
    const TClient extends IBlockchainClient,
    TAddress extends IAddress,
  >
  extends ContractWrapper<typeof FleetCommanderWhitelistAbi, TClient, TAddress>
  implements IFleetCommanderContract
{
  readonly _erc4626Contract: IErc4626Contract

  /** STATIC CONSTRUCTOR */
  static async create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    tokensManager: ITokensManager
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

  /** @see IFleetCommanderContract.rebalance */
  async rebalance(params: { rebalanceData: IRebalanceData[] }): Promise<TransactionInfo> {
    const rebalanceDataSolidity = this._convertRebalanceDataToSolidity({
      rebalanceData: params.rebalanceData,
    })

    const calldata = encodeFunctionData({
      abi: this.getAbi(),
      functionName: 'rebalance',
      args: [rebalanceDataSolidity],
    })

    return {
      transaction: {
        target: this.address,
        calldata: calldata,
        value: String(0),
      },
      description: 'Rebalance the assets of the fleet',
    }
  }

  /** @see IFleetCommanderContract.adjustBuffer */
  async adjustBuffer(params: { rebalanceData: IRebalanceData[] }): Promise<TransactionInfo> {
    const rebalanceDataSolidity = this._convertRebalanceDataToSolidity({
      rebalanceData: params.rebalanceData,
    })
    return this._createTransaction({
      functionName: 'adjustBuffer',
      args: [rebalanceDataSolidity],
      description: 'Adjust the buffer of the fleet',
    })
  }

  /** @see IFleetCommanderContract.setFleetDepositCap */
  async setFleetDepositCap(params: { cap: ITokenAmount }): Promise<TransactionInfo> {
    const asset = await this._erc4626Contract.asset()

    if (!params.cap.token.equals(asset)) {
      throw SDKError.createFrom({
        type: SDKErrorType.ArmadaError,
        reason: 'Invalid token for deposit cap',
        message: `The token ${params.cap.token} is invalid for the deposit cap, the fleet underlying token is ${asset}`,
      })
    }

    return this._createTransaction({
      functionName: 'setFleetDepositCap',
      args: [params.cap.toSolidityValue()],
      description: `Set the fleet deposit cap to ${params.cap}`,
    })
  }

  /** @see IFleetCommanderContract.setMaxRebalanceOperations */
  setMaxRebalanceOperations(params: { maxOperations: number }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'setMaxRebalanceOperations',
      args: [params.maxOperations],
      description: `Set the maximum number of rebalance operations to ${params.maxOperations}`,
    })
  }

  /** @see IFleetCommanderContract.setTipRate */
  setTipRate(params: { rate: IPercentage }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'setTipRate',
      args: [params.rate.toSolidityValue({ decimals: 18 })],
      description: `Set the tip rate to ${params.rate}`,
    })
  }

  /** @see IFleetCommanderContract.addArk */
  addArk(params: { ark: IAddress }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'addArk',
      args: [params.ark.toSolidityValue()],
      description: `Add the ark ${params.ark}`,
    })
  }

  /** @see IFleetCommanderContract.addArks */
  addArks(params: { arks: IAddress[] }): Promise<TransactionInfo> {
    const arksSolidity = params.arks.map((ark) => ark.toSolidityValue())
    return this._createTransaction({
      functionName: 'addArks',
      args: [arksSolidity],
      description: `Add the arks ${params.arks}`,
    })
  }

  /** @see IFleetCommanderContract.removeArk */
  removeArk(params: { ark: IAddress }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'removeArk',
      args: [params.ark.toSolidityValue()],
      description: `Remove the ark ${params.ark}`,
    })
  }

  /** @see IFleetCommanderContract.setArkDepositCap */
  async setArkDepositCap(params: { ark: IAddress; cap: ITokenAmount }): Promise<TransactionInfo> {
    const asset = await this._erc4626Contract.asset()

    if (!params.cap.token.equals(asset)) {
      throw SDKError.createFrom({
        type: SDKErrorType.ArmadaError,
        reason: 'Invalid token for deposit cap',
        message: `The token ${params.cap.token} is invalid for the deposit cap, the fleet underlying token is ${asset}`,
      })
    }

    return this._createTransaction({
      functionName: 'setArkDepositCap',
      args: [params.ark.toSolidityValue(), params.cap.toSolidityValue()],
      description: `Set the deposit cap of the ark ${params.ark} to ${params.cap}`,
    })
  }

  /** @see IFleetCommanderContract.setArkMaxDepositPercentageOfTVL */
  setArkMaxDepositPercentageOfTVL(params: {
    ark: IAddress
    maxDepositPercentageOfTVL: IPercentage
  }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'setArkMaxDepositPercentageOfTVL',
      args: [
        params.ark.toSolidityValue(),
        params.maxDepositPercentageOfTVL.toSolidityValue({ decimals: 18 }),
      ],
      description: `Set the max deposit percentage of TVL of the ark ${params.ark} to ${params.maxDepositPercentageOfTVL}`,
    })
  }

  /** @see IFleetCommanderContract.setArkMaxDeposit */
  async setArkMaxRebalanceOutflow(params: {
    ark: IAddress
    maxRebalanceOutflow: ITokenAmount
  }): Promise<TransactionInfo> {
    const asset = await this._erc4626Contract.asset()

    if (!params.maxRebalanceOutflow.token.equals(asset)) {
      throw SDKError.createFrom({
        type: SDKErrorType.ArmadaError,
        reason: 'Invalid token for max rebalance outflow',
        message: `The token ${params.maxRebalanceOutflow.token} is invalid for the max rebalance outflow, the fleet underlying token is ${asset}`,
      })
    }

    return this._createTransaction({
      functionName: 'setArkMaxRebalanceOutflow',
      args: [params.ark.toSolidityValue(), params.maxRebalanceOutflow.toSolidityValue()],
      description: `Set the max rebalance outflow of the ark ${params.ark} to ${params.maxRebalanceOutflow}`,
    })
  }

  /** @see IFleetCommanderContract.setArkMaxRebalanceInflow */
  async setArkMaxRebalanceInflow(params: {
    ark: IAddress
    maxRebalanceInflow: ITokenAmount
  }): Promise<TransactionInfo> {
    const asset = await this._erc4626Contract.asset()

    if (!params.maxRebalanceInflow.token.equals(asset)) {
      throw SDKError.createFrom({
        type: SDKErrorType.ArmadaError,
        reason: 'Invalid token for max rebalance inflow',
        message: `The token ${params.maxRebalanceInflow.token} is invalid for the max rebalance inflow, the fleet underlying token is ${asset}`,
      })
    }

    return this._createTransaction({
      functionName: 'setArkMaxRebalanceInflow',
      args: [params.ark.toSolidityValue(), params.maxRebalanceInflow.toSolidityValue()],
      description: `Set the max rebalance inflow of the ark ${params.ark} to ${params.maxRebalanceInflow}`,
    })
  }

  async setMinimumBufferBalance(params: {
    minimumBufferBalance: ITokenAmount
  }): Promise<TransactionInfo> {
    const asset = await this._erc4626Contract.asset()

    if (!params.minimumBufferBalance.token.equals(asset)) {
      throw SDKError.createFrom({
        type: SDKErrorType.ArmadaError,
        reason: 'Invalid token for minimum buffer balance',
        message: `The token ${params.minimumBufferBalance.token} is invalid for the minimum buffer balance, the fleet underlying token is ${asset}`,
      })
    }

    return this._createTransaction({
      functionName: 'setMinimumBufferBalance',
      args: [params.minimumBufferBalance.toSolidityValue()],
      description: `Set the minimum buffer balance of the fleet to ${params.minimumBufferBalance}`,
    })
  }

  /** @see IFleetCommanderContract.updateRebalanceCooldown */
  updateRebalanceCooldown(params: { cooldown: number }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'updateRebalanceCooldown',
      args: [params.cooldown],
      description: `Update the rebalance cooldown to ${params.cooldown}`,
    })
  }

  /** @see IFleetCommanderContract.forceRebalance */
  forceRebalance(params: { rebalanceData: IRebalanceData[] }): Promise<TransactionInfo> {
    const rebalanceDataSolidity = this._convertRebalanceDataToSolidity({
      rebalanceData: params.rebalanceData,
    })
    return this._createTransaction({
      functionName: 'forceRebalance',
      args: [rebalanceDataSolidity],
      description: 'Force a rebalance of the fleet',
    })
  }

  /** @see IFleetCommanderContract.emergencyShutdown */
  emergencyShutdown(): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'emergencyShutdown',
      args: [],
      description: 'Emergency shutdown of the fleet',
    })
  }

  /** @see IFleetCommanderContract.setWhitelisted */
  setWhitelisted(params: { account: IAddress; allowed: boolean }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'setWhitelisted',
      args: [params.account.toSolidityValue(), params.allowed],
      description: `Set whitelist status for ${params.account} to ${params.allowed}`,
    })
  }

  /** @see IFleetCommanderContract.setWhitelistedBatch */
  setWhitelistedBatch(params: {
    accounts: IAddress[]
    allowed: boolean[]
  }): Promise<TransactionInfo> {
    const accountsSolidity = params.accounts.map((account) => account.toSolidityValue())
    return this._createTransaction({
      functionName: 'setWhitelistedBatch',
      args: [accountsSolidity, params.allowed],
      description: `Batch set whitelist status for ${params.accounts.length} accounts`,
    })
  }

  /** READ METHODS */

  /** @see IFleetCommanderContract.isWhitelisted */
  async isWhitelisted(params: { account: IAddress }): Promise<boolean> {
    return this.contract.read.isWhitelisted([params.account.value])
  }

  /** @see IFleetCommanderContract.arks */
  async arks(): Promise<IAddress[]> {
    const arks = await this.contract.read.getActiveArks()

    return arks.map((ark) => Address.createFromEthereum({ value: ark }))
  }

  /** @see IFleetCommanderContract.config */
  async config(): Promise<IFleetConfig> {
    const [
      [
        bufferArkAddress,
        minimumBufferBalance,
        depositCap,
        maxRebalanceOperations,
        stakingRewardsManager,
      ],
      token,
    ] = await Promise.all([this.contract.read.config(), this._erc4626Contract.asset()])
    return {
      bufferArk: Address.createFromEthereum({ value: bufferArkAddress }),
      minimumBufferBalance: TokenAmount.createFromBaseUnit({
        token,
        amount: String(minimumBufferBalance),
      }),
      depositCap: TokenAmount.createFromBaseUnit({ token, amount: String(depositCap) }),
      maxRebalanceOperations: String(maxRebalanceOperations),
      stakingRewardsManager: Address.createFromEthereum({ value: stakingRewardsManager }),
    }
  }

  /** @see IFleetCommanderContract.maxDeposit */
  async maxDeposit(params: { user: IAddress }): Promise<ITokenAmount> {
    const [token, maxDeposit] = await Promise.all([
      this._erc4626Contract.asset(),
      this.contract.read.maxDeposit([params.user.value]),
    ])

    return TokenAmount.createFromBaseUnit({ token, amount: String(maxDeposit) })
  }

  /** @see IFleetCommanderContract.maxWithdraw */
  async maxWithdraw(params: { user: IAddress }): Promise<ITokenAmount> {
    const [token, maxWithdraw] = await Promise.all([
      this._erc4626Contract.asset(),
      this.contract.read.maxWithdraw([params.user.value]),
    ])

    return TokenAmount.createFromBaseUnit({ token, amount: String(maxWithdraw) })
  }

  /** @see IFleetCommanderContract.treasury */
  async treasury(): Promise<AddressValue> {
    return await this.contract.read.treasury()
  }

  /** CASTING METHODS */

  /** @see IFleetCommanderContract.asErc20 */
  asErc20(): IErc20Contract {
    return this.asErc4626().asErc20()
  }

  /** @see IFleetCommanderContract.asErc4626 */
  asErc4626(): IErc4626Contract {
    return this._erc4626Contract
  }

  /** @see IContractWrapper.getAbi */
  getAbi(): typeof FleetCommanderWhitelistAbi {
    return FleetCommanderWhitelistAbi
  }

  /** PRIVATE */
  private _convertRebalanceDataToSolidity(params: {
    rebalanceData: IRebalanceData[]
  }): RebalanceDataSolidity[] {
    return params.rebalanceData.map((data) => ({
      fromArk: data.fromArk.toSolidityValue(),
      toArk: data.toArk.toSolidityValue(),
      amount: data.amount.toSolidityValue(),
      boardData: data.boardData ?? '0x',
      disembarkData: data.disembarkData ?? '0x',
    }))
  }
}
