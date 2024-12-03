import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { AdmiralsQuartersAbi, StakingRewardsManagerBaseAbi } from '@summerfi/armada-protocol-abis'
import {
  createTransaction,
  getDeployedContractAddress,
  IArmadaManager,
  IArmadaPoolInfo,
  IArmadaPosition,
  IArmadaPositionId,
  IArmadaVaultId,
} from '@summerfi/armada-protocol-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider, type IRebalanceData } from '@summerfi/contracts-provider-common'
import {
  IAddress,
  IPercentage,
  ITokenAmount,
  IUser,
  TokenAmount,
  TransactionInfo,
  type HexData,
} from '@summerfi/sdk-common'
import { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import { encodeFunctionData } from 'viem'
import { ArmadaPool } from './ArmadaPool'
import { ArmadaPoolInfo } from './ArmadaPoolInfo'
import { ArmadaPosition } from './ArmadaPosition'
import { parseGetUserPositionQuery } from './extensions/parseGetUserPositionQuery'
import { parseGetUserPositionsQuery } from './extensions/parseGetUserPositionsQuery'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManager implements IArmadaManager {
  private _configProvider: IConfigurationProvider
  private _allowanceManager: IAllowanceManager
  private _contractsProvider: IContractsProvider
  private _subgraphManager: IArmadaSubgraphManager
  private _blockchainClientProvider: IBlockchainClientProvider

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    contractsProvider: IContractsProvider
    subgraphManager: IArmadaSubgraphManager
    blockchainClientProvider: IBlockchainClientProvider
  }) {
    this._configProvider = params.configProvider
    this._allowanceManager = params.allowanceManager
    this._contractsProvider = params.contractsProvider
    this._subgraphManager = params.subgraphManager
    this._blockchainClientProvider = params.blockchainClientProvider
  }

  /** POOLS */

  /** @see IArmadaManager.getVaultsRaw */
  async getVaultsRaw(params: Parameters<IArmadaManager['getVaultsRaw']>[0]) {
    return this._subgraphManager.getVaults({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManager.getVaultRaw */
  async getVaultRaw(params: Parameters<IArmadaManager['getVaultRaw']>[0]) {
    return this._subgraphManager.getVault({
      chainId: params.poolId.chainInfo.chainId,
      vaultId: params.poolId.fleetAddress.value,
    })
  }

  /** @see IArmadaManager.getGlobalRebalancesRaw */
  async getGlobalRebalancesRaw(params: Parameters<IArmadaManager['getGlobalRebalancesRaw']>[0]) {
    return this._subgraphManager.getGlobalRebalances({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManager.getUsersActivityRaw */
  async getUsersActivityRaw(params: Parameters<IArmadaManager['getUsersActivityRaw']>[0]) {
    return this._subgraphManager.getUsersActivity({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManager.getUserActivityRaw */
  async getUserActivityRaw(params: Parameters<IArmadaManager['getUserActivityRaw']>[0]) {
    return this._subgraphManager.getUserActivity({
      chainId: params.poolId.chainInfo.chainId,
      vaultId: params.poolId.fleetAddress.value,
    })
  }

  /** @see IArmadaManager.getPoolInfo */
  async getPoolInfo(params: { poolId: IArmadaVaultId }): Promise<IArmadaPoolInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    const fleetERC4626Contract = fleetContract.asErc4626()
    const fleetERC20Contract = fleetERC4626Contract.asErc20()

    const { depositCap } = await fleetContract.config()
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
    poolId: IArmadaVaultId
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
      deposits: [],
      withdrawals: [],
    })
  }

  async getFleetBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const fleetERC20Contract = fleetContract.asErc20()
    return fleetERC20Contract.balanceOf({ address: params.user.wallet.address })
  }

  async getStakedBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const { stakingRewardsManager } = await fleetContract.config()
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.vaultId.chainInfo,
    })
    const balance = await client.readContract({
      abi: StakingRewardsManagerBaseAbi,
      address: stakingRewardsManager.value,
      functionName: 'balanceOf',
      args: [params.user.wallet.address.value],
    })

    return TokenAmount.createFromBaseUnit({
      token: await fleetContract.asErc20().getToken(),
      amount: balance.toString(),
    })
  }

  async getTotalBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<ITokenAmount> {
    const fleetBalance = await this.getFleetBalance(params)
    const stakedBalance = await this.getStakedBalance(params)

    return fleetBalance.add(stakedBalance)
  }

  /** USER TRANSACTIONS */

  /** @see IArmadaManager.getNewDepositTX */
  async getNewDepositTX(params: {
    poolId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    shouldStake?: boolean
  }): Promise<TransactionInfo[]> {
    return this._getDepositTX(params)
  }

  /** @see IArmadaManager.getUpdateDepositTX */
  async getUpdateDepositTX(params: {
    poolId: IArmadaVaultId
    positionId: IArmadaPositionId
    amount: ITokenAmount
    shouldStake?: boolean
  }): Promise<TransactionInfo[]> {
    return this._getDepositTX({
      poolId: params.poolId,
      user: params.positionId.user,
      amount: params.amount,
      shouldStake: params.shouldStake,
    })
  }

  /** @see IArmadaManager.getWithdrawTX */
  async getWithdrawTX(params: {
    poolId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const transactions: TransactionInfo[] = []
    const multicallArgs: HexData[] = []

    const admiralsQuarterAddress = getDeployedContractAddress({
      chainInfo: params.poolId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    const sharesAmount = await this.convertToShares({
      poolId: params.poolId,
      amount: params.amount,
    })

    // Approval
    const approvalTransaction = await this._allowanceManager.getApproval({
      chainInfo: params.poolId.chainInfo,
      spender: admiralsQuarterAddress,
      amount: sharesAmount,
    })
    if (approvalTransaction) {
      transactions.push(...approvalTransaction)
    }

    const exitFleetCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'exitFleet',
      args: [params.poolId.fleetAddress.value, params.amount.toSolidityValue()],
    })
    multicallArgs.push(exitFleetCalldata)

    const withdrawTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'withdrawTokens',
      args: [params.amount.token.address.value, 0n],
    })
    multicallArgs.push(withdrawTokensCalldata)

    const withdrawMulticallCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'multicall',
      args: [multicallArgs],
    })

    transactions.push(
      createTransaction({
        target: admiralsQuarterAddress,
        calldata: withdrawMulticallCalldata,
        description: 'Withdraw Multicall Transaction',
      }),
    )

    return transactions
  }

  /** @see IArmadaManager.convertToShares */
  async convertToShares(params: {
    poolId: IArmadaVaultId
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
    poolId: IArmadaVaultId
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
    poolId: IArmadaVaultId
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
    poolId: IArmadaVaultId
    cap: ITokenAmount
  }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.setFleetDepositCap({ cap: params.cap })
  }

  /** @see IArmadaManager.setTipJar */
  async setTipJar(params: { poolId: IArmadaVaultId }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.setTipJar()
  }

  /** @see IArmadaManager.setTipRate */
  async setTipRate(params: {
    poolId: IArmadaVaultId
    rate: IPercentage
  }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.setTipRate({ rate: params.rate })
  }

  /** @see IArmadaManager.addArk */
  async addArk(params: { poolId: IArmadaVaultId; ark: IAddress }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.addArk({ ark: params.ark })
  }

  /** @see IArmadaManager.addArks */
  async addArks(params: { poolId: IArmadaVaultId; arks: IAddress[] }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.addArks({ arks: params.arks })
  }

  /** @see IArmadaManager.removeArk */
  async removeArk(params: { poolId: IArmadaVaultId; ark: IAddress }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.removeArk({ ark: params.ark })
  }

  /** @see IArmadaManager.setArkDepositCap */
  async setArkDepositCap(params: {
    poolId: IArmadaVaultId
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
    poolId: IArmadaVaultId
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
    poolId: IArmadaVaultId
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
    poolId: IArmadaVaultId
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
    poolId: IArmadaVaultId
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
    poolId: IArmadaVaultId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
    })

    return fleetContract.forceRebalance({ rebalanceData: params.rebalanceData })
  }

  /** @see IArmadaManager.emergencyShutdown */
  async emergencyShutdown(params: { poolId: IArmadaVaultId }): Promise<TransactionInfo> {
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
    poolId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    shouldStake?: boolean
  }): Promise<TransactionInfo[]> {
    const transactions: TransactionInfo[] = []
    const shouldStake = params.shouldStake ?? true

    const admiralsQuarterAddress = getDeployedContractAddress({
      chainInfo: params.poolId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    // Approval
    const approvalTransaction = await this._allowanceManager.getApproval({
      chainInfo: params.poolId.chainInfo,
      spender: admiralsQuarterAddress,
      amount: params.amount,
    })
    if (approvalTransaction) {
      transactions.push(...approvalTransaction)
    }

    const multicallArgs: HexData[] = []
    const depositTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'depositTokens',
      args: [params.amount.token.address.value, params.amount.toSolidityValue()],
    })
    multicallArgs.push(depositTokensCalldata)

    // when staking admirals quarters will receive LV tokens, otherwise the user
    const lvTokenReceiver = shouldStake
      ? admiralsQuarterAddress.value
      : params.user.wallet.address.value

    const enterFleetCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'enterFleet',
      args: [
        params.poolId.fleetAddress.value,
        params.amount.token.address.value,
        params.amount.toSolidityValue(),
        lvTokenReceiver,
      ],
    })
    multicallArgs.push(enterFleetCalldata)

    if (shouldStake) {
      const stakeCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'stake',
        args: [params.poolId.fleetAddress.value, 0n],
      })
      multicallArgs.push(stakeCalldata)
    }

    const depositMulticallCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'multicall',
      args: [multicallArgs],
    })
    transactions.push(
      createTransaction({
        target: admiralsQuarterAddress,
        calldata: depositMulticallCalldata,
        description: 'Deposit Multicall Transaction',
      }),
    )

    return transactions
  }
}
