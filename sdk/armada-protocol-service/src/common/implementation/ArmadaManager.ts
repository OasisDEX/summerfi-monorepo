import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { AdmiralsQuartersAbi, StakingRewardsManagerBaseAbi } from '@summerfi/armada-protocol-abis'
import {
  getDeployedContractAddress,
  IArmadaManager,
  IArmadaVaultInfo,
  IArmadaPosition,
  IArmadaPositionId,
  IArmadaVaultId,
  createDepositTransaction,
  createWithdrawTransaction,
  type IArmadaManagerClaims,
  type IArmadaManagerGovernance,
  getDeployedRewardsRedeemerAddress,
  isTestDeployment,
  setTestDeployment,
  type IArmadaManagerMigrations,
  type IArmadaManagerBridge,
} from '@summerfi/armada-protocol-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import {
  Address,
  calculatePriceImpact,
  getChainInfoByChainId,
  IAddress,
  ITokenAmount,
  IUser,
  LoggingService,
  Price,
  Token,
  TokenAmount,
  TransactionInfo,
  type ChainInfo,
  type ExtendedTransactionInfo,
  type HexData,
  type IPercentage,
  type IToken,
  type TransactionPriceImpact,
} from '@summerfi/sdk-common'
import { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import { ITokensManager } from '@summerfi/tokens-common'
import { encodeFunctionData } from 'viem'
import { ArmadaVault } from './ArmadaVault'
import { ArmadaVaultInfo } from './ArmadaVaultInfo'
import { ArmadaPosition } from './ArmadaPosition'
import { parseGetUserPositionQuery } from './extensions/parseGetUserPositionQuery'
import { parseGetUserPositionsQuery } from './extensions/parseGetUserPositionsQuery'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { ISwapManager } from '@summerfi/swap-common'
import type { IOracleManager } from '@summerfi/oracle-common'
import { ArmadaManagerClaims } from './ArmadaManagerClaims'
import { ArmadaManagerGovernance } from './ArmadaManagerGovernance'
import { ArmadaManagerMigrations } from './ArmadaManagerMigrations'
import { ArmadaManagerBridge } from './ArmadaManagerBridge'
import { BigNumber } from 'bignumber.js'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManager implements IArmadaManager {
  claims: IArmadaManagerClaims
  governance: IArmadaManagerGovernance
  migrations: IArmadaManagerMigrations
  bridge: IArmadaManagerBridge

  private _supportedChains: ChainInfo[]
  private _rewardsRedeemerAddress: IAddress
  private _isTestDeployment: boolean

  private _hubChainInfo: ChainInfo
  private _configProvider: IConfigurationProvider
  private _allowanceManager: IAllowanceManager
  private _contractsProvider: IContractsProvider
  private _subgraphManager: IArmadaSubgraphManager
  private _blockchainClientProvider: IBlockchainClientProvider
  private _swapManager: ISwapManager
  private _oracleManager: IOracleManager
  private _tokensManager: ITokensManager

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    contractsProvider: IContractsProvider
    subgraphManager: IArmadaSubgraphManager
    blockchainClientProvider: IBlockchainClientProvider
    swapManager: ISwapManager
    oracleManager: IOracleManager
    tokensManager: ITokensManager
  }) {
    this._configProvider = params.configProvider
    this._allowanceManager = params.allowanceManager
    this._contractsProvider = params.contractsProvider
    this._subgraphManager = params.subgraphManager
    this._blockchainClientProvider = params.blockchainClientProvider
    this._swapManager = params.swapManager
    this._oracleManager = params.oracleManager
    this._tokensManager = params.tokensManager

    setTestDeployment(
      this._configProvider.getConfigurationItem({ name: 'SUMMER_DEPLOYMENT_CONFIG' }),
    )

    this._isTestDeployment = isTestDeployment()

    this._supportedChains = this._configProvider
      .getConfigurationItem({
        name: 'SUMMER_DEPLOYED_CHAINS_ID',
      })
      .split(',')
      .map((chainId) => getChainInfoByChainId(Number(chainId)))
    const _hubChainId = this._configProvider.getConfigurationItem({
      name: 'SUMMER_HUB_CHAIN_ID',
    })
    this._hubChainInfo = getChainInfoByChainId(Number(_hubChainId))
    this._rewardsRedeemerAddress = getDeployedRewardsRedeemerAddress()

    this.claims = new ArmadaManagerClaims({
      ...params,
      hubChainInfo: this._hubChainInfo,
      rewardsRedeemerAddress: this._rewardsRedeemerAddress,
      supportedChains: this._supportedChains,
      getSummerToken: this.getSummerToken.bind(this),
    })
    this.governance = new ArmadaManagerGovernance({
      ...params,
      hubChainInfo: this._hubChainInfo,
      getSummerToken: this.getSummerToken.bind(this),
    })
    this.migrations = new ArmadaManagerMigrations({
      ...params,
      hubChainInfo: this._hubChainInfo,
      supportedChains: this._supportedChains,
      getSwapCall: this._getSwapCall.bind(this),
      getPriceImpact: this._getPriceImpact.bind(this),
    })
    this.bridge = new ArmadaManagerBridge({
      supportedChains: this._supportedChains,
      blockchainClientProvider: this._blockchainClientProvider,
      configProvider: this._configProvider,
      tokensManager: this._tokensManager,
      bridgeContractAddress: this.getSummerToken({ chainInfo: this._hubChainInfo }).address,
    })
  }

  getSummerToken(
    params: Parameters<IArmadaManager['getSummerToken']>[0],
  ): ReturnType<IArmadaManager['getSummerToken']> {
    const address = getDeployedContractAddress({
      chainInfo: params.chainInfo,
      contractCategory: 'gov',
      contractName: 'summerToken',
    })

    return Token.createFrom({
      chainInfo: params.chainInfo,
      address: address,
      decimals: 18,
      name: 'SummerToken',
      symbol: this._isTestDeployment ? 'BUMMER' : 'SUMR',
    })
  }

  /** POOLS */

  /** @see IArmadaManager.getVaultsRaw */
  async getVaultsRaw(params: Parameters<IArmadaManager['getVaultsRaw']>[0]) {
    return await this._subgraphManager.getVaults({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManager.getVaultRaw */
  async getVaultRaw(params: Parameters<IArmadaManager['getVaultRaw']>[0]) {
    return this._subgraphManager.getVault({
      chainId: params.vaultId.chainInfo.chainId,
      vaultId: params.vaultId.fleetAddress.value,
    })
  }

  /** @see IArmadaManager.getGlobalRebalancesRaw */
  async getGlobalRebalancesRaw(params: Parameters<IArmadaManager['getGlobalRebalancesRaw']>[0]) {
    return this._subgraphManager.getGlobalRebalances({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManager.getUsersActivityRaw */
  async getUsersActivityRaw(params: Parameters<IArmadaManager['getUsersActivityRaw']>[0]) {
    return this._subgraphManager.getUsersActivity({
      chainId: params.chainInfo.chainId,
      where: params.where,
    })
  }

  /** @see IArmadaManager.getUserActivityRaw */
  async getUserActivityRaw(params: Parameters<IArmadaManager['getUserActivityRaw']>[0]) {
    return this._subgraphManager.getUserActivity({
      chainId: params.vaultId.chainInfo.chainId,
      vaultId: params.vaultId.fleetAddress.value,
      accountAddress: params.accountAddress,
    })
  }

  /** @see IArmadaManager.getVaultInfo */
  async getVaultInfo(
    params: Parameters<IArmadaManager['getVaultInfo']>[0],
  ): Promise<IArmadaVaultInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const fleetERC4626Contract = fleetContract.asErc4626()
    const fleetERC20Contract = fleetERC4626Contract.asErc20()

    const [config, totalDeposits, totalShares] = await Promise.all([
      fleetContract.config(),
      fleetERC4626Contract.totalAssets(),
      fleetERC20Contract.totalSupply(),
    ])
    const { depositCap } = config

    return ArmadaVaultInfo.createFrom({
      id: params.vaultId,
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
    vaultId: IArmadaVaultId
    positionId: IArmadaPositionId
  }): Promise<IArmadaPosition> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const fleetERC4626Contract = fleetContract.asErc4626()
    const fleetERC20Contract = fleetERC4626Contract.asErc20()

    const userShares = await fleetERC20Contract.balanceOf({
      address: params.positionId.user.wallet.address,
    })
    const userAssets = await fleetERC4626Contract.convertToAssets({ amount: userShares })

    const pool = ArmadaVault.createFrom({
      id: params.vaultId,
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

  async getFleetShares(
    params: Parameters<IArmadaManager['getFleetShares']>[0],
  ): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const fleetERC20Contract = fleetContract.asErc20()
    const shares = await fleetERC20Contract.balanceOf({ address: params.user.wallet.address })

    return shares
  }

  async getStakedShares(
    params: Parameters<IArmadaManager['getStakedShares']>[0],
  ): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const { stakingRewardsManager } = await fleetContract.config()
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.vaultId.chainInfo,
    })

    const [balance, token] = await Promise.all([
      client.readContract({
        abi: StakingRewardsManagerBaseAbi,
        address: stakingRewardsManager.value,
        functionName: 'balanceOf',
        args: [params.user.wallet.address.value],
      }),
      fleetContract.asErc20().getToken(),
    ])

    return TokenAmount.createFromBaseUnit({
      token: token,
      amount: balance.toString(),
    })
  }

  /** @see IArmadaManager.getFleetBalance */
  async getFleetBalance(params: Parameters<IArmadaManager['getFleetBalance']>[0]): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }> {
    const [fleetContract, shares] = await Promise.all([
      this._contractsProvider.getFleetCommanderContract({
        chainInfo: params.vaultId.chainInfo,
        address: params.vaultId.fleetAddress,
      }),
      this.getFleetShares(params),
    ])
    const assets = await fleetContract.asErc4626().convertToAssets({ amount: shares })

    return { shares, assets }
  }

  /** @see IArmadaManager.getStakedBalance */
  async getStakedBalance(params: Parameters<IArmadaManager['getStakedBalance']>[0]): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }> {
    const [fleetContract, shares] = await Promise.all([
      this._contractsProvider.getFleetCommanderContract({
        chainInfo: params.vaultId.chainInfo,
        address: params.vaultId.fleetAddress,
      }),
      this.getStakedShares(params),
    ])

    const assets = await fleetContract.asErc4626().convertToAssets({ amount: shares })

    return { assets, shares }
  }

  /** @see IArmadaManager.getTotalBalance */
  async getTotalBalance(params: Parameters<IArmadaManager['getTotalBalance']>[0]): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }> {
    const [fleetBalance, stakedBalance] = await Promise.all([
      this.getFleetBalance(params),
      this.getStakedBalance(params),
    ])

    return {
      shares: fleetBalance.shares.add(stakedBalance.shares),
      assets: fleetBalance.assets.add(stakedBalance.assets),
    }
  }

  /** @see IArmadaManager.convertToShares */
  async convertToShares(
    params: Parameters<IArmadaManager['convertToShares']>[0],
  ): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const erc4626Contract = fleetContract.asErc4626()

    return erc4626Contract.convertToShares({ amount: params.amount })
  }

  /** @see IArmadaManager.convertToAssets */
  async convertToAssets(
    params: Parameters<IArmadaManager['convertToAssets']>[0],
  ): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const erc4626Contract = fleetContract.asErc4626()

    return erc4626Contract.convertToAssets({ amount: params.amount })
  }

  /** USER TRANSACTIONS */

  /** @see IArmadaManager.getNewDepositTX */
  async getNewDepositTX(
    params: Parameters<IArmadaManager['getNewDepositTX']>[0],
  ): Promise<ExtendedTransactionInfo[]> {
    return this._getDepositTX(params)
  }

  /** @see IArmadaManager.getUpdateDepositTX */
  async getUpdateDepositTX(
    params: Parameters<IArmadaManager['getUpdateDepositTX']>[0],
  ): Promise<ExtendedTransactionInfo[]> {
    return this._getDepositTX({
      vaultId: params.vaultId,
      user: params.positionId.user,
      amount: params.amount,
      shouldStake: params.shouldStake,
      slippage: params.slippage,
    })
  }

  /** @see IArmadaManager.getWithdrawTX */
  async getWithdrawTX(
    params: Parameters<IArmadaManager['getWithdrawTX']>[0],
  ): Promise<ExtendedTransactionInfo[]> {
    return this._getWithdrawTX(params)
  }

  /** KEEPERS TRANSACTIONS */

  /** @see IArmadaManager.rebalance */
  async rebalance(params: Parameters<IArmadaManager['rebalance']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.rebalance({ rebalanceData: params.rebalanceData })
  }

  /** @see IArmadaManager.adjustBuffer */
  async adjustBuffer(
    params: Parameters<IArmadaManager['adjustBuffer']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.adjustBuffer({ rebalanceData: params.rebalanceData })
  }

  /** GOVERNANCE TRANSACTIONS */

  /** @see IArmadaManager.setFleetDepositCap */
  async setFleetDepositCap(
    params: Parameters<IArmadaManager['setFleetDepositCap']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setFleetDepositCap({ cap: params.cap })
  }

  /** @see IArmadaManager.setTipJar */
  async setTipJar(params: Parameters<IArmadaManager['setTipJar']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setTipJar()
  }

  /** @see IArmadaManager.setTipRate */
  async setTipRate(params: Parameters<IArmadaManager['setTipRate']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setTipRate({ rate: params.rate })
  }

  /** @see IArmadaManager.addArk */
  async addArk(params: Parameters<IArmadaManager['addArk']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.addArk({ ark: params.ark })
  }

  /** @see IArmadaManager.addArks */
  async addArks(params: Parameters<IArmadaManager['addArks']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.addArks({ arks: params.arks })
  }

  /** @see IArmadaManager.removeArk */
  async removeArk(params: Parameters<IArmadaManager['removeArk']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.removeArk({ ark: params.ark })
  }

  /** @see IArmadaManager.setArkDepositCap */
  async setArkDepositCap(
    params: Parameters<IArmadaManager['setArkDepositCap']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setArkDepositCap({ ark: params.ark, cap: params.cap })
  }

  /** @see IArmadaManager.setArkMaxRebalanceOutflow */
  async setArkMaxRebalanceOutflow(
    params: Parameters<IArmadaManager['setArkMaxRebalanceOutflow']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setArkMaxRebalanceOutflow({
      ark: params.ark,
      maxRebalanceOutflow: params.maxRebalanceOutflow,
    })
  }

  /** @see IArmadaManager.setArkMaxRebalanceInflow */
  async setArkMaxRebalanceInflow(
    params: Parameters<IArmadaManager['setArkMaxRebalanceInflow']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setArkMaxRebalanceInflow({
      ark: params.ark,
      maxRebalanceInflow: params.maxRebalanceInflow,
    })
  }

  /** @see IArmadaManager.setMinimumBufferBalance */
  async setMinimumBufferBalance(
    params: Parameters<IArmadaManager['setMinimumBufferBalance']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setMinimumBufferBalance({
      minimumBufferBalance: params.minimumBufferBalance,
    })
  }

  /** @see IArmadaManager.updateRebalanceCooldown */
  async updateRebalanceCooldown(
    params: Parameters<IArmadaManager['updateRebalanceCooldown']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.updateRebalanceCooldown({ cooldown: params.cooldown })
  }

  /** @see IArmadaManager.forceRebalance */
  async forceRebalance(
    params: Parameters<IArmadaManager['forceRebalance']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.forceRebalance({ rebalanceData: params.rebalanceData })
  }

  /** @see IArmadaManager.emergencyShutdown */
  async emergencyShutdown(
    params: Parameters<IArmadaManager['emergencyShutdown']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.emergencyShutdown()
  }

  /** PRIVATE */

  /**
   * Returns the chain-specific Admirals Quarters address for unstake operations
   * @param chainInfo The chain information
   * @returns The appropriate Admirals Quarters address for the chain
   */
  private _getUnstakeAdmiralsQuartersAddress(chainInfo: ChainInfo): IAddress {
    // Chain-specific overrides for unstake operations
    switch (chainInfo.chainId) {
      case 1: // Ethereum Mainnet
        return Address.createFromEthereum({ value: '0x275CA55c32258CE10870CA4e44c071aa14A2C836' })
      case 42161: // Arbitrum
        return Address.createFromEthereum({ value: '0x275CA55c32258CE10870CA4e44c071aa14A2C836' })
      case 8453: // Base
        return Address.createFromEthereum({ value: '0x275CA55c32258CE10870CA4e44c071aa14A2C836' })
      default:
        // For other chains, use the deployed address
        return getDeployedContractAddress({
          chainInfo: chainInfo,
          contractCategory: 'core',
          contractName: 'admiralsQuarters',
        })
    }
  }

  /**
   * Internal utility method to generate a deposit TX
   *
   * @param vaultId The vault for which the deposit is being made
   * @param user The user making the deposit
   * @param amount The amount being deposited
   *
   * @returns The transactions needed to deposit the tokens
   */
  private async _getDepositTX(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    shouldStake?: boolean
  }): Promise<ExtendedTransactionInfo[]> {
    const fleetCommander = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })
    const fleetToken = await fleetCommander.asErc4626().asset()

    const inAmount = params.amount
    const fromEth = inAmount.token.symbol === 'ETH'
    const swapFromAmount = fromEth
      ? // if the deposit is in ETH, we need to wrap it to WETH for the swap
        TokenAmount.createFrom({
          amount: inAmount.amount,
          token: await this._tokensManager.getTokenBySymbol({
            chainInfo: params.vaultId.chainInfo,
            symbol: 'WETH',
          }),
        })
      : inAmount
    const shouldSwap = !swapFromAmount.token.address.equals(fleetToken.address)
    const shouldStake = params.shouldStake ?? true

    let swapToAmount: ITokenAmount | undefined
    const transactions: ExtendedTransactionInfo[] = []

    LoggingService.debug('getDepositTX', {
      inAmount: inAmount.toString(),
      shouldSwap,
      isEth: fromEth,
      swapFromAmount: swapFromAmount.toString(),
      shouldStake,
    })

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: params.vaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    // Approval for AQ
    if (!fromEth) {
      const approvalTransaction = await this._allowanceManager.getApproval({
        chainInfo: params.vaultId.chainInfo,
        spender: admiralsQuartersAddress,
        amount: inAmount,
        owner: params.user.wallet.address,
      })
      if (approvalTransaction) {
        transactions.push(approvalTransaction)
        LoggingService.debug('approvalTransaction', {
          amount: approvalTransaction.metadata.approvalAmount.toString(),
        })
      }
    }

    const multicallArgs: HexData[] = []
    const multicallOperations: string[] = []
    const depositTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'depositTokens',
      args: [inAmount.token.address.value, inAmount.toSolidityValue()],
    })
    multicallArgs.push(depositTokensCalldata)
    multicallOperations.push('depositTokens ' + inAmount.toString())

    // If depositing a token that is not the fleet token,
    // we need to swap it to fleet asset
    if (shouldSwap) {
      const swapCall = await this._getSwapCall({
        vaultId: params.vaultId,
        fromAmount: swapFromAmount,
        toToken: fleetToken,
        slippage: params.slippage,
      })
      multicallArgs.push(swapCall.calldata)
      multicallOperations.push(
        `swap ${swapFromAmount.toString()} to min ${swapCall.minAmount.toString()}`,
      )

      swapToAmount = swapCall.toAmount
    }

    // when staking admirals quarters will receive LV tokens, otherwise the user
    const fleetTokenReceiver = shouldStake
      ? admiralsQuartersAddress.value
      : params.user.wallet.address.value

    const enterFleetCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'enterFleet',
      args: [params.vaultId.fleetAddress.value, 0n, fleetTokenReceiver],
    })
    multicallArgs.push(enterFleetCalldata)
    multicallOperations.push('enterFleet all (0)')

    if (shouldStake) {
      const stakeCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'stake',
        args: [params.vaultId.fleetAddress.value, 0n],
      })
      multicallArgs.push(stakeCalldata)
      multicallOperations.push('stake all (0)')
    }

    const multicallCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'multicall',
      args: [multicallArgs],
    })
    transactions.push(
      createDepositTransaction({
        target: admiralsQuartersAddress,
        calldata: multicallCalldata,
        description: 'Deposit Operations: ' + multicallOperations.join(', '),
        value: fromEth ? inAmount.toSolidityValue() : undefined,
        metadata: {
          fromAmount: inAmount,
          toAmount: swapToAmount,
          slippage: params.slippage,
          priceImpact:
            swapToAmount &&
            (await this._getPriceImpact({
              fromAmount: inAmount,
              toAmount: swapToAmount,
            })),
        },
      }),
    )

    LoggingService.debug('transactions', {
      transactions: transactions.map(({ description, type, transaction }) => ({
        description,
        type,
        transactionValue: transaction.value,
      })),
    })

    return transactions
  }

  /**
   * Internal utility method to generate a withdraw TX
   *
   * @param vaultId The vault for which the withdraw is being made
   * @param user The user making the withdraw
   * @param amount The amount being withdrawn
   * @param slippage The slippage tolerance for the swap
   * @param toToken The token to swap to
   *
   * @returns The transactions needed to withdraw the tokens
   */
  private async _getWithdrawTX(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    toToken: IToken
  }): Promise<ExtendedTransactionInfo[]> {
    const withdrawAmount = params.amount
    const toEth = params.toToken.symbol === 'ETH'
    const swapToToken = params.toToken
    const shouldSwap = !swapToToken.equals(withdrawAmount.token)

    // let swapMinAmount: ITokenAmount | undefined
    let swapToAmount: ITokenAmount | undefined
    const transactions: ExtendedTransactionInfo[] = []

    const [beforeFleetShares, beforeStakedShares, requestedWithdrawShares] = await Promise.all([
      this.getFleetShares({
        vaultId: params.vaultId,
        user: params.user,
      }),
      this.getStakedShares({
        vaultId: params.vaultId,
        user: params.user,
      }),
      this._previewWithdraw({
        vaultId: params.vaultId,
        assets: withdrawAmount,
      }),
    ])

    LoggingService.debug('getWithdrawTX', {
      withdrawAmount: withdrawAmount.toString(),
      withdrawShares: requestedWithdrawShares.toString(),
      shouldSwap,
      isEth: toEth,
      swapToToken: swapToToken.toString(),
    })

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: params.vaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    // are unstaked tokens available greater than dust
    if (beforeFleetShares.toSolidityValue() > 0) {
      // Yes. is the unstaked amount sufficient to meet the withdrawal?
      if (beforeFleetShares.toSolidityValue() >= requestedWithdrawShares.toSolidityValue()) {
        LoggingService.debug('fleet shares is enough for requested amount', {
          fleetShares: beforeFleetShares.toString(),
        })

        // TODO: when withdraw from fleetShares and no swap, we can skip approval and multicall and withdraw directly from fleet

        // Approve the requested amount in shares
        const [approveToTakeSharesOnBehalf, exitWithdrawMulticall, priceImpact] = await Promise.all(
          [
            this._allowanceManager.getApproval({
              chainInfo: params.vaultId.chainInfo,
              spender: admiralsQuartersAddress,
              amount: requestedWithdrawShares,
              owner: params.user.wallet.address,
            }),
            this._getExitWithdrawMulticall({
              vaultId: params.vaultId,
              slippage: params.slippage,
              amount: withdrawAmount,
              // if withdraw is WETH and unwrapping to ETH,
              // we need to withdraw WETH for later deposit & unwrap operation
              swapToToken:
                withdrawAmount.token.symbol === 'WETH' && toEth
                  ? withdrawAmount.token
                  : swapToToken,
              shouldSwap,
              toEth,
            }),
            swapToAmount &&
              this._getPriceImpact({
                fromAmount: withdrawAmount,
                toAmount: swapToAmount,
              }),
          ],
        )

        if (approveToTakeSharesOnBehalf) {
          transactions.push(approveToTakeSharesOnBehalf)
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            sharesToWithdraw: requestedWithdrawShares.toString(),
          })
        }
        const multicallCalldata = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [exitWithdrawMulticall.multicallArgs],
        })
        transactions.push(
          createWithdrawTransaction({
            target: admiralsQuartersAddress,
            calldata: multicallCalldata,
            description:
              'Withdraw Operations: ' + exitWithdrawMulticall.multicallOperations.join(', '),
            metadata: {
              fromAmount: withdrawAmount,
              toAmount: swapToAmount,
              slippage: params.slippage,
              priceImpact,
            },
          }),
        )
      } else {
        // Request withdrawal of all unstaked tokens and the rest from staked tokens
        LoggingService.debug('fleet shares is not enough', {
          fleetShares: beforeFleetShares.toString(),
        })
        const [fleetAssetsWithdrawAmount, approveToTakeSharesOnBehalf] = await Promise.all([
          this._previewRedeem({
            vaultId: params.vaultId,
            shares: beforeFleetShares,
          }),
          this._allowanceManager.getApproval({
            chainInfo: params.vaultId.chainInfo,
            spender: admiralsQuartersAddress,
            amount: beforeFleetShares,
            owner: params.user.wallet.address,
          }),
        ])

        LoggingService.debug('- first take all fleet shares', {
          fleetAssetsWithdrawAmount: fleetAssetsWithdrawAmount.toString(),
        })

        if (approveToTakeSharesOnBehalf) {
          transactions.push(approveToTakeSharesOnBehalf)
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            sharesToWithdraw: beforeFleetShares.toString(),
          })
        }

        const multicallArgs: HexData[] = []
        const multicallOperations: string[] = []
        const unstakeMulticallArgs: HexData[] = []
        const unstakeMulticallOperations: string[] = []

        const reminderShares = requestedWithdrawShares.subtract(beforeFleetShares)
        LoggingService.debug('- then reminder from staked shares', {
          reminderShares: reminderShares.toString(),
        })

        // For unstakeAndWithdraw operations, get the chain-specific address
        const unstakeAdmiralsQuartersAddress = this._getUnstakeAdmiralsQuartersAddress(
          params.vaultId.chainInfo,
        )

        const [exitWithdrawMulticall, unstakeAndWithdrawCall, priceImpact] = await Promise.all([
          this._getExitWithdrawMulticall({
            vaultId: params.vaultId,
            slippage: params.slippage,
            amount: fleetAssetsWithdrawAmount,
            exitAll: true,
            // if withdraw is WETH and unwrapping to ETH,
            // we need to withdraw WETH for later deposit & unwrap operation
            swapToToken:
              fleetAssetsWithdrawAmount.token.symbol === 'WETH' && toEth
                ? fleetAssetsWithdrawAmount.token
                : swapToToken,
            shouldSwap,
            toEth,
          }),
          this._getUnstakeAndWithdrawCall({
            vaultId: params.vaultId,
            shares: reminderShares,
            stakedShares: beforeStakedShares,
          }),
          swapToAmount &&
            this._getPriceImpact({
              fromAmount: withdrawAmount,
              toAmount: swapToAmount,
            }),
        ])

        multicallArgs.push(...exitWithdrawMulticall.multicallArgs)
        multicallOperations.push(...exitWithdrawMulticall.multicallOperations)
        // multicallArgs.push(unstakeAndWithdrawCall.calldata)
        // multicallOperations.push('unstakeAndWithdraw ' + reminderShares.toString())

        // NOTE: Temporary solution whilst using two AdmiralsQuarters contracts
        unstakeMulticallArgs.push(unstakeAndWithdrawCall.calldata)
        unstakeMulticallOperations.push('unstakeAndWithdraw ' + reminderShares.toString())

        // NOTE: Disabled whilst withdraws require two AdmiralsQuarters contracts
        // if (shouldSwap) {
        //   // approval to swap from user EOA
        //   const [approveToSwapForUser, depositSwapWithdrawMulticall] = await Promise.all([
        //     this._allowanceManager.getApproval({
        //       chainInfo: params.vaultId.chainInfo,
        //       spender: admiralsQuartersAddress,
        //       amount: withdrawAmount,
        //       owner: params.user.wallet.address,
        //     }),
        //     this._getDepositSwapWithdrawMulticall({
        //       vaultId: params.vaultId,
        //       slippage: params.slippage,
        //       fromAmount: withdrawAmount,
        //       toToken: swapToToken,
        //       toEth,
        //     }),
        //   ])
        //   if (approveToSwapForUser) {
        //     transactions.push(approveToSwapForUser)
        //     LoggingService.debug('approveToSwapForUser', {
        //       outAmount: withdrawAmount.toString(),
        //     })
        //   }
        //   multicallArgs.push(...depositSwapWithdrawMulticall.multicallArgs)
        //   multicallOperations.push(...depositSwapWithdrawMulticall.multicallOperations)
        //   swapToAmount = depositSwapWithdrawMulticall.toAmount
        // }
        // compose multicall
        const multicallCalldata = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [multicallArgs],
        })
        transactions.push(
          createWithdrawTransaction({
            target: admiralsQuartersAddress,
            calldata: multicallCalldata,
            description: 'Withdraw Operations: ' + multicallOperations.join(', '),
            metadata: {
              fromAmount: withdrawAmount,
              toAmount: swapToAmount,
              slippage: params.slippage,
              priceImpact,
            },
          }),
        )

        const unstakeAndWithdrawCalldata = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [unstakeMulticallArgs],
        })
        transactions.push(
          createWithdrawTransaction({
            target: unstakeAdmiralsQuartersAddress,
            calldata: unstakeAndWithdrawCalldata,
            description: 'Withdraw Operations: ' + unstakeMulticallOperations.join(', '),
            metadata: {
              fromAmount: withdrawAmount,
              toAmount: swapToAmount,
              slippage: params.slippage,
              priceImpact,
            },
          }),
        )
      }
    } else {
      // No. Unstake and withdraw everything from staked tokens.
      const multicallArgs: HexData[] = []
      const multicallOperations: string[] = []

      LoggingService.debug('fleet shares is 0, take all from staked shares', {
        outShares: requestedWithdrawShares.toString(),
      })

      // Get the chain-specific address for unstakeAndWithdraw
      const unstakeAdmiralsQuartersAddress = this._getUnstakeAdmiralsQuartersAddress(
        params.vaultId.chainInfo,
      )

      // withdraw all from staked tokens
      const [unstakeAndWithdrawCall, priceImpact] = await Promise.all([
        this._getUnstakeAndWithdrawCall({
          vaultId: params.vaultId,
          shares: requestedWithdrawShares,
          stakedShares: beforeStakedShares,
        }),
        swapToAmount &&
          this._getPriceImpact({
            fromAmount: withdrawAmount,
            toAmount: swapToAmount,
          }),
      ])
      multicallArgs.push(unstakeAndWithdrawCall.calldata)
      multicallOperations.push('unstakeAndWithdraw ' + requestedWithdrawShares.toString())

      // NOTE: Disabled whilst withdraws require two AdmiralsQuarters contracts
      // if (shouldSwap) {
      //   // approval to swap from user EOA
      //   const [approveToSwapForUser, depositSwapWithdrawMulticall] = await Promise.all([
      //     this._allowanceManager.getApproval({
      //       chainInfo: params.vaultId.chainInfo,
      //       spender: admiralsQuartersAddress,
      //       amount: withdrawAmount,
      //       owner: params.user.wallet.address,
      //     }),
      //     this._getDepositSwapWithdrawMulticall({
      //       vaultId: params.vaultId,
      //       slippage: params.slippage,
      //       fromAmount: withdrawAmount,
      //       toToken: swapToToken,
      //       toEth,
      //     }),
      //   ])
      //   if (approveToSwapForUser) {
      //     transactions.push(approveToSwapForUser)
      //     LoggingService.debug('approveToSwapForUser', {
      //       approveToSwapForUser: withdrawAmount.toString(),
      //     })
      //   }

      //   multicallArgs.push(...depositSwapWithdrawMulticall.multicallArgs)
      //   multicallOperations.push(...depositSwapWithdrawMulticall.multicallOperations)
      //   swapToAmount = depositSwapWithdrawMulticall.toAmount
      // }
      // compose multicall
      const multicallCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'multicall',
        args: [multicallArgs],
      })

      transactions.push(
        createWithdrawTransaction({
          target: unstakeAdmiralsQuartersAddress, // Use the chain-specific address for transactions with unstakeAndWithdraw
          calldata: multicallCalldata,
          description: 'Withdraw Operations: ' + multicallOperations.join(', '),
          metadata: {
            fromAmount: withdrawAmount,
            toAmount: swapToAmount,
            slippage: params.slippage,
            priceImpact,
          },
        }),
      )
    }

    LoggingService.debug('transactions', {
      transactions: transactions.map(({ description, type, transaction }) => ({
        description,
        type,
        transactionValue: transaction.value,
      })),
    })

    return transactions
  }

  /**
   * Internal utility method to generate a withdraw+unstake TX
   * @param params The parameters for the withdraw+unstake
   *
   * @returns The transactions needed to withdraw+unstake the tokens
   */
  private async _getUnstakeAndWithdrawCall(params: {
    vaultId: IArmadaVaultId
    shares: ITokenAmount
    stakedShares: ITokenAmount
    claimRewards?: boolean
  }): Promise<{
    calldata: HexData
  }> {
    const claimRewards = params.claimRewards ?? true

    // if the requested amount is close to all staked shares, we make assumption to withdraw all
    // withdraw all assumption threshold is set to 0.9999
    const withdrawAllThreshold = 0.9999
    const shouldWithdrawAll = new BigNumber(params.shares.toSolidityValue().toString())
      .div(params.stakedShares.toSolidityValue().toString())
      .gte(withdrawAllThreshold)
    const withdrawSharesAmount = shouldWithdrawAll ? 0n : params.shares.toSolidityValue()

    const calldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'unstakeAndWithdrawAssets',
      args: [params.vaultId.fleetAddress.value, withdrawSharesAmount, claimRewards],
    })

    return { calldata }
  }

  /**
   * Internal utility method to generate a withdraw TX
   * @param params The parameters for the withdraw
   *
   * @returns The transactions needed to withdraw the tokens
   */
  private async _getExitWithdrawMulticall(params: {
    vaultId: IArmadaVaultId
    amount: ITokenAmount
    swapToToken: IToken
    slippage: IPercentage
    toEth: boolean
    shouldSwap: boolean
    exitAll?: boolean
  }): Promise<{
    multicallArgs: HexData[]
    multicallOperations: string[]
  }> {
    const multicallArgs: HexData[] = []
    const multicallOperations: string[] = []

    const fromAmount = params.amount
    const exitAll = params.exitAll ?? false

    const exitFleetCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'exitFleet',
      args: [params.vaultId.fleetAddress.value, exitAll ? 0n : fromAmount.toSolidityValue()],
    })
    multicallArgs.push(exitFleetCalldata)
    multicallOperations.push('exitFleet ' + fromAmount.token.toString() + ' (all)')

    let toToken = params.swapToToken
    // if the out token is ETH, we need to use wrapped ETH to withdraw
    if (params.toEth) {
      toToken = await this._tokensManager.getTokenBySymbol({
        chainInfo: params.vaultId.chainInfo,
        symbol: 'WETH',
      })
    }

    // do not swap from WETH to ETH
    if (params.shouldSwap && (fromAmount.token.symbol !== 'WETH' || !params.toEth)) {
      const compensatedFromAmount = TokenAmount.createFromBaseUnit({
        token: fromAmount.token,
        // we need to compensate for the tip eating exited amount
        // by decreasing swap amount as it will be lower than read amount
        // we are using 0.99999 multiplier and rounding down
        amount: new BigNumber(fromAmount.toSolidityValue().toString())
          .times(0.99999)
          .toFixed(0, BigNumber.ROUND_DOWN),
      })

      const swapCall = await this._getSwapCall({
        vaultId: params.vaultId,
        fromAmount: compensatedFromAmount,
        toToken: toToken,
        slippage: params.slippage,
      })
      multicallArgs.push(swapCall.calldata)
      multicallOperations.push(
        `swap ${compensatedFromAmount.toString()} to min ${swapCall.minAmount.toString()}`,
      )

      const withdrawTokensCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'withdrawTokens',
        args: [fromAmount.token.address.value, 0n],
      })
      multicallArgs.push(withdrawTokensCalldata)
      multicallOperations.push('withdrawTokens ' + fromAmount.token.toString() + ' (all)')
    }

    const withdrawAmount = TokenAmount.createFromBaseUnit({
      token: params.swapToToken,
      amount: '0', // all
    })

    const withdrawTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'withdrawTokens',
      args: [withdrawAmount.token.address.value, withdrawAmount.toSolidityValue()],
    })
    multicallArgs.push(withdrawTokensCalldata)
    multicallOperations.push('withdrawTokens ' + withdrawAmount.toString())

    return { multicallArgs, multicallOperations }
  }

  private async _getDepositSwapWithdrawMulticall(params: {
    vaultId: IArmadaVaultId
    fromAmount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
    toEth: boolean
  }): Promise<{
    multicallArgs: HexData[]
    multicallOperations: string[]
    minAmount?: ITokenAmount
    toAmount?: ITokenAmount
  }> {
    const multicallArgs: HexData[] = []
    const multicallOperations: string[] = []

    const depositTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'depositTokens',
      args: [params.fromAmount.token.address.value, params.fromAmount.toSolidityValue()],
    })
    multicallArgs.push(depositTokensCalldata)
    multicallOperations.push('depositTokens ' + params.fromAmount.toString())

    let outToken = params.toToken
    // if the out token is ETH, we need to use wrapped ETH to withdraw
    if (params.toEth) {
      outToken = await this._tokensManager.getTokenBySymbol({
        chainInfo: params.vaultId.chainInfo,
        symbol: 'WETH',
      })
    }

    let swapCall:
      | undefined
      | {
          calldata: HexData
          minAmount: ITokenAmount
          toAmount: ITokenAmount
        }

    // do not swap from WETH to ETH
    if (params.fromAmount.token.symbol !== 'WETH' || !params.toEth) {
      swapCall = await this._getSwapCall({
        vaultId: params.vaultId,
        fromAmount: params.fromAmount,
        toToken: outToken,
        slippage: params.slippage,
      })
      multicallArgs.push(swapCall.calldata)
      multicallOperations.push(
        `swap ${params.fromAmount.toString()} to min ${swapCall.minAmount.toString()}`,
      )
    }

    const outAmount = TokenAmount.createFromBaseUnit({
      token: params.toToken,
      amount: '0', // all tokens
    })
    // withdraw swapped assets
    const withdrawTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'withdrawTokens',
      args: [outAmount.token.address.value, outAmount.toSolidityValue()],
    })
    multicallArgs.push(withdrawTokensCalldata)
    multicallOperations.push('withdrawTokens ' + outAmount.toString())

    return {
      multicallArgs: multicallArgs,
      multicallOperations: multicallOperations,
      minAmount: swapCall?.minAmount,
      toAmount: swapCall?.toAmount,
    }
  }

  private async _getSwapCall(params: {
    vaultId: IArmadaVaultId
    fromAmount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
  }): Promise<{
    calldata: HexData
    minAmount: ITokenAmount
    toAmount: ITokenAmount
  }> {
    // get the admirals quarters address
    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: params.vaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    // get swapdata from the 1inch swap api
    const swapData = await this._swapManager.getSwapDataExactInput({
      fromAmount: params.fromAmount,
      toToken: params.toToken,
      recipient: admiralsQuartersAddress,
      slippage: params.slippage,
    })

    const slippageComplement = params.slippage.toComplement()
    const minTokensReceived = BigInt(
      new BigNumber(swapData.toTokenAmount.toSolidityValue().toString())
        .times(slippageComplement.value / 100)
        .toFixed(0, BigNumber.ROUND_DOWN),
    )

    // prepare calldata
    const calldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'swap',
      args: [
        params.fromAmount.token.address.value, // from token
        params.toToken.address.value, // to token
        params.fromAmount.toSolidityValue(), // from amount
        minTokensReceived, // min to amount
        swapData.calldata,
      ],
    })

    const minAmount = TokenAmount.createFromBaseUnit({
      token: params.toToken,
      amount: minTokensReceived.toString(),
    })

    LoggingService.debug('getSwapData', {
      fromAmount: swapData.fromTokenAmount.toString(),
      toAmount: swapData.toTokenAmount.toString(),
      minAmount: minAmount.toString(),
      slippage: params.slippage.toString(),
      slippageComplement: slippageComplement.toString(),
    })

    return {
      calldata,
      minAmount,
      toAmount: swapData.toTokenAmount,
    }
  }

  private async _getPriceImpact(params: {
    fromAmount: ITokenAmount
    toAmount: ITokenAmount
  }): Promise<TransactionPriceImpact> {
    // for quote we should use optimal quote not the min quote
    const quotePrice = Price.createFrom({
      base: params.fromAmount.token,
      quote: params.toAmount.token,
      value: new BigNumber(params.toAmount.amount).div(params.fromAmount.amount).toString(),
    })

    const spotPrice = await this._oracleManager.getSpotPrice({
      baseToken: params.fromAmount.token,
      denomination: params.toAmount.token,
    })

    const impact =
      !spotPrice.price || spotPrice.price.isZero()
        ? null
        : calculatePriceImpact(spotPrice.price, quotePrice)

    LoggingService.debug('getPriceImpact', {
      spotPrice: spotPrice.price.toString(),
      quotePrice: quotePrice.toString(),
      impact: impact?.toString(),
    })

    return {
      price: spotPrice.price,
      impact,
    }
  }

  private async _previewWithdraw(params: {
    vaultId: IArmadaVaultId
    assets: ITokenAmount
  }): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })
    return await fleetContract.asErc4626().previewWithdraw({ assets: params.assets })
  }

  private async _previewRedeem(params: {
    vaultId: IArmadaVaultId
    shares: ITokenAmount
  }): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })
    return await fleetContract.asErc4626().previewRedeem({ shares: params.shares })
  }

  private async _previewDeposit(params: {
    vaultId: IArmadaVaultId
    assets: ITokenAmount
  }): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })
    return await fleetContract.asErc4626().previewDeposit({ assets: params.assets })
  }
}
