import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { AdmiralsQuartersAbi } from '@summerfi/armada-protocol-abis'
import {
  IArmadaManager,
  IArmadaPoolInfo,
  IArmadaPosition,
  IArmadaPositionId,
  IArmadaVaultId,
} from '@summerfi/armada-protocol-common'
import { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider, type IRebalanceData } from '@summerfi/contracts-provider-common'
import { GenericContractWrapper } from '@summerfi/contracts-provider-service'
import { IAddress, IPercentage, ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'
import { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import { encodeFunctionData } from 'viem'
import { getDeployedContractAddress } from '../../deployments/config'
import { ArmadaPool } from './ArmadaPool'
import { ArmadaPoolInfo } from './ArmadaPoolInfo'
import { ArmadaPosition } from './ArmadaPosition'
import { parseGetUserPositionQuery } from './extensions/parseGetUserPositionQuery'
import { parseGetUserPositionsQuery } from './extensions/parseGetUserPositionsQuery'

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

  /** USER TRANSACTIONS */

  /** @see IArmadaManager.getNewDepositTX */
  async getNewDepositTX(params: {
    poolId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return this._getDepositTX(params)
  }

  /** @see IArmadaManager.getUpdateDepositTX */
  async getUpdateDepositTX(params: {
    poolId: IArmadaVaultId
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
    poolId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const admiralsQuartersWrapper = await GenericContractWrapper.create({
      chainInfo: params.poolId.chainInfo,
      address: params.poolId.fleetAddress,
      abi: AdmiralsQuartersAbi,
      blockchainClient: this._blockchainClientProvider.getBlockchainClient({
        chainInfo: params.poolId.chainInfo,
      }),
    })

    // TODO: Implement this method

    throw new Error('Method not implemented.')
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
  }): Promise<TransactionInfo[]> {
    const transactions: TransactionInfo[] = []
    const admiralsQuarterAddress = getDeployedContractAddress({
      chainInfo: params.poolId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })
    const admiralsQuartersWrapper = await GenericContractWrapper.create({
      chainInfo: params.poolId.chainInfo,
      address: admiralsQuarterAddress,
      abi: AdmiralsQuartersAbi,
      // TODO: move to generic contract wrapper later
      blockchainClient: this._blockchainClientProvider.getBlockchainClient({
        chainInfo: params.poolId.chainInfo,
      }),
    })

    // Approval
    const approvalTransaction = await this._allowanceManager.getApproval({
      chainInfo: params.poolId.chainInfo,
      spender: params.poolId.fleetAddress,
      amount: params.amount,
    })
    if (approvalTransaction) {
      transactions.push(...approvalTransaction)
    }

    const depositTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'depositTokens',
      args: [params.amount.token.address.value, params.amount.toSolidityValue()],
    })

    const enterFleetCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'enterFleet',
      args: [
        params.poolId.fleetAddress.value,
        params.amount.token.address.value,
        params.amount.toSolidityValue(),
        params.user.wallet.address.value,
      ],
    })

    const depositMulticallCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'multicall',
      args: [[depositTokensCalldata, enterFleetCalldata]],
    })

    transactions.push(
      admiralsQuartersWrapper.createTransaction({
        calldata: depositMulticallCalldata,
        description: 'Deposit Multicall Transaction',
      }),
    )

    return transactions
  }
}
