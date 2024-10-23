import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import {
  IArmadaManager,
  IArmadaPoolId,
  IArmadaPoolInfo,
  IArmadaPosition,
  IArmadaPositionId,
  IRebalanceData,
} from '@summerfi/armada-protocol-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { IAddress, IPercentage, ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'
import { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import { ArmadaPool } from './ArmadaPool'
import { ArmadaPoolInfo } from './ArmadaPoolInfo'
import { ArmadaPosition } from './ArmadaPosition'
import { parseGetUserPositionsQuery } from './extensions/parseGetUserPositionsQuery'
import { parseGetUserPositionQuery } from './extensions/parseGetUserPositionQuery'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManager implements IArmadaManager {
  private _configProvider: IConfigurationProvider
  private _allowanceManager: IAllowanceManager
  private _contractsProvider: IContractsProvider
  private _subgraphManager: IArmadaSubgraphManager

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    contractsProvider: IContractsProvider
    subgraphManager: IArmadaSubgraphManager
  }) {
    this._configProvider = params.configProvider
    this._allowanceManager = params.allowanceManager
    this._contractsProvider = params.contractsProvider
    this._subgraphManager = params.subgraphManager
  }

  /** POOLS */

  /** @see IArmadaManager.getVaults */
  async getVaults(params: Parameters<IArmadaManager['getVaults']>[0]) {
    return this._subgraphManager.getVaults({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManager.getVault */
  async getVault(params: Parameters<IArmadaManager['getVault']>[0]) {
    return this._subgraphManager.getVault({
      chainId: params.poolId.chainInfo.chainId,
      vaultId: params.poolId.fleetAddress.value,
    })
  }

  /** @see IArmadaManager.getPoolInfo */
  async getPoolInfo(params: { poolId: IArmadaPoolId }): Promise<IArmadaPoolInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    const fleetERC4626Contract = fleetContract.asErc4626()
    const fleetERC20Contract = fleetERC4626Contract.asErc20()

    const depositCap = await fleetContract.depositCap()
    const totalDeposits = await fleetERC4626Contract.totalAssets()
    const totalShares = await fleetERC20Contract.totalSupply()

    return ArmadaPoolInfo.createFrom({
      id: params.poolId,
      depositCap: depositCap,
      totalDeposits: totalDeposits,
      totalShares: totalShares,
    })
  }

  /** POSITIONS */
  /** @see IArmadaManager.getUserPositions */
  async getUserPositions({ user }: { user: IUser }): Promise<IArmadaPosition[]> {
    return parseGetUserPositionsQuery({
      user,
      query: await this._subgraphManager.getUserPositions({ user }),
    })
  }

  /** @see IArmadaManager.getUserPosition */
  async getUserPosition({
    user,
    fleetAddress,
  }: {
    user: IUser
    fleetAddress: IAddress
  }): Promise<IArmadaPosition> {
    return parseGetUserPositionQuery({
      user,
      query: await this._subgraphManager.getUserPosition({ user, fleetAddress }),
    })
  }

  /** @see IArmadaManager.getPosition */
  async getPosition(params: {
    poolId: IArmadaPoolId
    positionId: IArmadaPositionId
  }): Promise<IArmadaPosition> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    const fleetERC4626Contract = fleetContract.asErc4626()
    const fleetERC20Contract = fleetERC4626Contract.asErc20()

    const userShares = await fleetERC20Contract.balanceOf({
      address: params.positionId.user.wallet.address,
    })
    const userAssets = await fleetERC4626Contract.convertToAssets({ amount: userShares })

    const pool = ArmadaPool.createFrom({
      id: params.poolId,
    })

    return ArmadaPosition.createFrom({
      id: params.positionId,
      pool: pool,
      amount: userAssets,
      shares: userShares,
    })
  }

  /** USER TRANSACTIONS */

  /** @see IArmadaManager.getNewDepositTX */
  async getNewDepositTX(params: {
    poolId: IArmadaPoolId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return this._getDepositTX(params)
  }

  /** @see IArmadaManager.getUpdateDepositTX */
  async getUpdateDepositTX(params: {
    poolId: IArmadaPoolId
    positionId: IArmadaPositionId
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return this._getDepositTX({
      poolId: params.poolId,
      user: params.positionId.user,
      amount: params.amount,
    })
  }

  /** @see IArmadaManager.getWithdrawTX */
  async getWithdrawTX(params: {
    poolId: IArmadaPoolId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    const fleetWithdrawTransaction = await fleetContract.withdraw({
      assets: params.amount,
      receiver: params.user.wallet.address,
      owner: params.user.wallet.address,
    })

    return [fleetWithdrawTransaction]
  }

  /** @see IArmadaManager.convertToShares */
  async convertToShares(params: {
    poolId: IArmadaPoolId
    amount: ITokenAmount
  }): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    const erc4626Contract = fleetContract.asErc4626()

    return erc4626Contract.convertToShares({ amount: params.amount })
  }

  /** KEEPERS TRANSACTIONS */

  /** @see IArmadaManager.rebalance */
  async rebalance(params: {
    poolId: IArmadaPoolId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.rebalance({ rebalanceData: params.rebalanceData })
  }

  /** @see IArmadaManager.adjustBuffer */
  async adjustBuffer(params: {
    poolId: IArmadaPoolId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.adjustBuffer({ rebalanceData: params.rebalanceData })
  }

  /** GOVERNANCE TRANSACTIONS */

  /** @see IArmadaManager.setFleetDepositCap */
  async setFleetDepositCap(params: {
    poolId: IArmadaPoolId
    cap: ITokenAmount
  }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.setFleetDepositCap({ cap: params.cap })
  }

  /** @see IArmadaManager.setTipJar */
  async setTipJar(params: { poolId: IArmadaPoolId }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.setTipJar()
  }

  /** @see IArmadaManager.setTipRate */
  async setTipRate(params: { poolId: IArmadaPoolId; rate: IPercentage }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.setTipRate({ rate: params.rate })
  }

  /** @see IArmadaManager.addArk */
  async addArk(params: { poolId: IArmadaPoolId; ark: IAddress }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.addArk({ ark: params.ark })
  }

  /** @see IArmadaManager.addArks */
  async addArks(params: { poolId: IArmadaPoolId; arks: IAddress[] }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.addArks({ arks: params.arks })
  }

  /** @see IArmadaManager.removeArk */
  async removeArk(params: { poolId: IArmadaPoolId; ark: IAddress }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.removeArk({ ark: params.ark })
  }

  /** @see IArmadaManager.setArkDepositCap */
  async setArkDepositCap(params: {
    poolId: IArmadaPoolId
    ark: IAddress
    cap: ITokenAmount
  }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.setArkDepositCap({ ark: params.ark, cap: params.cap })
  }

  /** @see IArmadaManager.setArkMaxRebalanceOutflow */
  async setArkMaxRebalanceOutflow(params: {
    poolId: IArmadaPoolId
    ark: IAddress
    maxRebalanceOutflow: ITokenAmount
  }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.setArkMaxRebalanceOutflow({
      ark: params.ark,
      maxRebalanceOutflow: params.maxRebalanceOutflow,
    })
  }

  /** @see IArmadaManager.setArkMaxRebalanceInflow */
  async setArkMaxRebalanceInflow(params: {
    poolId: IArmadaPoolId
    ark: IAddress
    maxRebalanceInflow: ITokenAmount
  }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.setArkMaxRebalanceInflow({
      ark: params.ark,
      maxRebalanceInflow: params.maxRebalanceInflow,
    })
  }

  /** @see IArmadaManager.setMinimumBufferBalance */
  async setMinimumBufferBalance(params: {
    poolId: IArmadaPoolId
    minimumBufferBalance: ITokenAmount
  }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.setMinimumBufferBalance({
      minimumBufferBalance: params.minimumBufferBalance,
    })
  }

  /** @see IArmadaManager.updateRebalanceCooldown */
  async updateRebalanceCooldown(params: {
    poolId: IArmadaPoolId
    cooldown: number
  }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.updateRebalanceCooldown({ cooldown: params.cooldown })
  }

  /** @see IArmadaManager.forceRebalance */
  async forceRebalance(params: {
    poolId: IArmadaPoolId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.forceRebalance({ rebalanceData: params.rebalanceData })
  }

  /** @see IArmadaManager.emergencyShutdown */
  async emergencyShutdown(params: { poolId: IArmadaPoolId }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.emergencyShutdown()
  }

  /** PRIVATE */

  /**
   * Internal utility method to generate a deposit TX
   *
   * @param poolId The pool for which the deposit is being made
   * @param user The user making the deposit
   * @param amount The amount being deposited
   *
   * @returns The transactions needed to deposit the tokens
   */
  private async _getDepositTX(params: {
    poolId: IArmadaPoolId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const transactions: TransactionInfo[] = []

    // Approval
    const approvalTransaction = await this._allowanceManager.getApproval({
      chainInfo: params.poolId.chainInfo,
      spender: params.poolId.fleetAddress,
      amount: params.amount,
    })
    if (approvalTransaction) {
      transactions.push(...approvalTransaction)
    }

    // Deposit
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    const fleetDepositTransaction = await fleetContract.deposit({
      assets: params.amount,
      receiver: params.user.wallet.address,
    })

    transactions.push(fleetDepositTransaction)

    return transactions
  }
}
