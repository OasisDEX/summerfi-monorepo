import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { AdmiralsQuartersAbi, StakingRewardsManagerBaseAbi } from '@summerfi/armada-protocol-abis'
import {
  getDeployedContractAddress,
  getDeployedRewardsRedeemerAddress,
  isTestDeployment,
  setTestDeployment,
  type IArmadaManagerUtils,
} from '@summerfi/armada-protocol-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import {
  calculatePriceImpact,
  getChainInfoByChainId,
  IAddress,
  ITokenAmount,
  IUser,
  LoggingService,
  Price,
  TokenAmount,
  TransactionInfo,
  type ChainInfo,
  type HexData,
  type IPercentage,
  type IToken,
  type ISpotPriceInfo,
  type TransactionPriceImpact,
  type IArmadaVaultInfo,
  type IArmadaPosition,
  type IArmadaPositionId,
  type IArmadaVaultId,
  ArmadaVaultInfo,
} from '@summerfi/sdk-common'
import { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import { ITokensManager } from '@summerfi/tokens-common'
import { encodeFunctionData } from 'viem'
import { parseGetUserPositionQuery } from './extensions/parseGetUserPositionQuery'
import { parseGetUserPositionsQuery } from './extensions/parseGetUserPositionsQuery'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { ISwapManager } from '@summerfi/swap-common'
import type { IOracleManager } from '@summerfi/oracle-common'
import { BigNumber } from 'bignumber.js'

/**
 * @name ArmadaManagerUtils
 * @description This class is the implementation of the IArmadaManagerUtils interface.
 */
export class ArmadaManagerUtils implements IArmadaManagerUtils {
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
  }

  getSummerToken(
    params: Parameters<IArmadaManagerUtils['getSummerToken']>[0],
  ): ReturnType<IArmadaManagerUtils['getSummerToken']> {
    const tokenSymbol = this._isTestDeployment ? 'BUMMER' : 'SUMR'

    return this._tokensManager.getTokenBySymbol({
      chainInfo: params.chainInfo,
      symbol: tokenSymbol,
    })
  }

  /** POOLS */

  /** @see IArmadaManagerUtils.getVaultsRaw */
  async getVaultsRaw(params: Parameters<IArmadaManagerUtils['getVaultsRaw']>[0]) {
    return await this._subgraphManager.getVaults({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManagerUtils.getVaultRaw */
  async getVaultRaw(params: Parameters<IArmadaManagerUtils['getVaultRaw']>[0]) {
    return this._subgraphManager.getVault({
      chainId: params.vaultId.chainInfo.chainId,
      vaultId: params.vaultId.fleetAddress.value,
    })
  }

  /** @see IArmadaManagerUtils.getGlobalRebalancesRaw */
  async getGlobalRebalancesRaw(
    params: Parameters<IArmadaManagerUtils['getGlobalRebalancesRaw']>[0],
  ) {
    return this._subgraphManager.getGlobalRebalances({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManagerUtils.getUsersActivityRaw */
  async getUsersActivityRaw(params: Parameters<IArmadaManagerUtils['getUsersActivityRaw']>[0]) {
    return this._subgraphManager.getUsersActivity({
      chainId: params.chainInfo.chainId,
      where: params.where,
    })
  }

  /** @see IArmadaManagerUtils.getUserActivityRaw */
  async getUserActivityRaw(params: Parameters<IArmadaManagerUtils['getUserActivityRaw']>[0]) {
    return this._subgraphManager.getUserActivity({
      chainId: params.vaultId.chainInfo.chainId,
      vaultId: params.vaultId.fleetAddress.value,
      accountAddress: params.accountAddress,
    })
  }

  /** @see IArmadaManagerUtils.getVaultInfo */
  async getVaultInfo(
    params: Parameters<IArmadaManagerUtils['getVaultInfo']>[0],
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
  /** @see IArmadaManagerUtils.getUserPositions */
  async getUserPositions({ user }: { user: IUser }): Promise<IArmadaPosition[]> {
    const summerToken = this.getSummerToken({ chainInfo: user.chainInfo })
    const getTokenBySymbol = this._tokensManager.getTokenBySymbol.bind(this._tokensManager)

    return parseGetUserPositionsQuery({
      user,
      query: await this._subgraphManager.getUserPositions({ user }),
      summerToken,
      getTokenBySymbol,
    })
  }

  /** @see IArmadaManagerUtils.getUserPosition */
  async getUserPosition({
    user,
    fleetAddress,
  }: {
    user: IUser
    fleetAddress: IAddress
  }): Promise<IArmadaPosition> {
    const summerToken = this.getSummerToken({ chainInfo: user.chainInfo })
    const getTokenBySymbol = this._tokensManager.getTokenBySymbol.bind(this._tokensManager)

    return parseGetUserPositionQuery({
      user,
      query: await this._subgraphManager.getUserPosition({ user, fleetAddress }),
      summerToken,
      getTokenBySymbol,
    })
  }

  /** @see IArmadaManagerUtils.getPosition */
  async getPosition(params: { positionId: IArmadaPositionId }): Promise<IArmadaPosition> {
    const summerToken = this.getSummerToken({ chainInfo: params.positionId.user.chainInfo })
    const getTokenBySymbol = this._tokensManager.getTokenBySymbol.bind(this._tokensManager)

    return parseGetUserPositionQuery({
      user: params.positionId.user,
      query: await this._subgraphManager.getPosition({ positionId: params.positionId }),
      summerToken,
      getTokenBySymbol,
    })
  }

  async getFleetShares(
    params: Parameters<IArmadaManagerUtils['getFleetShares']>[0],
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
    params: Parameters<IArmadaManagerUtils['getStakedShares']>[0],
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

  /** @see IArmadaManagerUtils.getFleetBalance */
  async getFleetBalance(params: Parameters<IArmadaManagerUtils['getFleetBalance']>[0]): Promise<{
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

  /** @see IArmadaManagerUtils.getStakedBalance */
  async getStakedBalance(params: Parameters<IArmadaManagerUtils['getStakedBalance']>[0]): Promise<{
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

  /** @see IArmadaManagerUtils.getTotalBalance */
  async getTotalBalance(params: Parameters<IArmadaManagerUtils['getTotalBalance']>[0]): Promise<{
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

  /** @see IArmadaManagerUtils.convertToShares */
  async convertToShares(
    params: Parameters<IArmadaManagerUtils['convertToShares']>[0],
  ): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const erc4626Contract = fleetContract.asErc4626()

    return erc4626Contract.convertToShares({ amount: params.amount })
  }

  /** @see IArmadaManagerUtils.convertToAssets */
  async convertToAssets(
    params: Parameters<IArmadaManagerUtils['convertToAssets']>[0],
  ): Promise<ITokenAmount> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const erc4626Contract = fleetContract.asErc4626()

    return erc4626Contract.convertToAssets({ amount: params.amount })
  }

  /** KEEPERS TRANSACTIONS */

  /** @see IArmadaManagerUtils.rebalance */
  async rebalance(
    params: Parameters<IArmadaManagerUtils['rebalance']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.rebalance({ rebalanceData: params.rebalanceData })
  }

  /** @see IArmadaManagerUtils.adjustBuffer */
  async adjustBuffer(
    params: Parameters<IArmadaManagerUtils['adjustBuffer']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.adjustBuffer({ rebalanceData: params.rebalanceData })
  }

  /** GOVERNANCE TRANSACTIONS */

  /** @see IArmadaManagerUtils.setFleetDepositCap */
  async setFleetDepositCap(
    params: Parameters<IArmadaManagerUtils['setFleetDepositCap']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setFleetDepositCap({ cap: params.cap })
  }

  /** @see IArmadaManagerUtils.setTipJar */
  async setTipJar(
    params: Parameters<IArmadaManagerUtils['setTipJar']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setTipJar()
  }

  /** @see IArmadaManagerUtils.setTipRate */
  async setTipRate(
    params: Parameters<IArmadaManagerUtils['setTipRate']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setTipRate({ rate: params.rate })
  }

  /** @see IArmadaManagerUtils.addArk */
  async addArk(params: Parameters<IArmadaManagerUtils['addArk']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.addArk({ ark: params.ark })
  }

  /** @see IArmadaManagerUtils.addArks */
  async addArks(params: Parameters<IArmadaManagerUtils['addArks']>[0]): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.addArks({ arks: params.arks })
  }

  /** @see IArmadaManagerUtils.removeArk */
  async removeArk(
    params: Parameters<IArmadaManagerUtils['removeArk']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.removeArk({ ark: params.ark })
  }

  /** @see IArmadaManagerUtils.setArkDepositCap */
  async setArkDepositCap(
    params: Parameters<IArmadaManagerUtils['setArkDepositCap']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setArkDepositCap({ ark: params.ark, cap: params.cap })
  }

  /** @see IArmadaManagerUtils.setArkMaxRebalanceOutflow */
  async setArkMaxRebalanceOutflow(
    params: Parameters<IArmadaManagerUtils['setArkMaxRebalanceOutflow']>[0],
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

  /** @see IArmadaManagerUtils.setArkMaxRebalanceInflow */
  async setArkMaxRebalanceInflow(
    params: Parameters<IArmadaManagerUtils['setArkMaxRebalanceInflow']>[0],
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

  /** @see IArmadaManagerUtils.setMinimumBufferBalance */
  async setMinimumBufferBalance(
    params: Parameters<IArmadaManagerUtils['setMinimumBufferBalance']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.setMinimumBufferBalance({
      minimumBufferBalance: params.minimumBufferBalance,
    })
  }

  /** @see IArmadaManagerUtils.updateRebalanceCooldown */
  async updateRebalanceCooldown(
    params: Parameters<IArmadaManagerUtils['updateRebalanceCooldown']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.updateRebalanceCooldown({ cooldown: params.cooldown })
  }

  /** @see IArmadaManagerUtils.forceRebalance */
  async forceRebalance(
    params: Parameters<IArmadaManagerUtils['forceRebalance']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.forceRebalance({ rebalanceData: params.rebalanceData })
  }

  /** @see IArmadaManagerUtils.emergencyShutdown */
  async emergencyShutdown(
    params: Parameters<IArmadaManagerUtils['emergencyShutdown']>[0],
  ): Promise<TransactionInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    return fleetContract.emergencyShutdown()
  }

  async getSwapCall(params: {
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

  async getPriceImpact(params: {
    fromAmount: ITokenAmount
    toAmount: ITokenAmount
  }): Promise<TransactionPriceImpact> {
    // for quote we should use optimal quote not the min quote
    const quotePrice = Price.createFrom({
      base: params.fromAmount.token,
      quote: params.toAmount.token,
      value: new BigNumber(params.toAmount.amount).div(params.fromAmount.amount).toString(),
    })

    let spotPriceInfo: ISpotPriceInfo | undefined
    try {
      spotPriceInfo = await this._oracleManager.getSpotPrice({
        baseToken: params.fromAmount.token,
        denomination: params.toAmount.token,
      })
    } catch (error) {
      LoggingService.debug('getSpotPrice', {
        error: (error as Error).message,
      })
    }

    const spotPrice = spotPriceInfo?.price
    const impact =
      !spotPrice || spotPrice.isZero() ? null : calculatePriceImpact(spotPrice, quotePrice)

    LoggingService.debug('getPriceImpact', {
      quotePrice: quotePrice.toString(),
      spotPrice: spotPrice?.toString(),
      impact: impact?.toString(),
    })

    return {
      price: quotePrice,
      impact,
    }
  }
}
