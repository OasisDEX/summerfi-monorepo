import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { AdmiralsQuartersAbi, StakingRewardsManagerBaseAbi } from '@summerfi/armada-protocol-abis'
import {
  getDeployedContractAddress,
  IArmadaManager,
  IArmadaVaultInfo,
  IArmadaPosition,
  IArmadaPositionId,
  IArmadaVaultId,
  createApprovalTransaction,
  createDepositTransaction,
  createWithdrawTransaction,
  type IArmadaManagerClaims,
} from '@summerfi/armada-protocol-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import {
  calculatePriceImpact,
  IAddress,
  ITokenAmount,
  IUser,
  LoggingService,
  Price,
  TokenAmount,
  TransactionInfo,
  type ExtendedTransactionInfo,
  type HexData,
  type IPercentage,
  type IToken,
  type TransactionPriceImpact,
} from '@summerfi/sdk-common'
import { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import { encodeFunctionData } from 'viem'
import { ArmadaVault } from './ArmadaVault'
import { ArmadaVaultInfo } from './ArmadaVaultInfo'
import { ArmadaPosition } from './ArmadaPosition'
import { parseGetUserPositionQuery } from './extensions/parseGetUserPositionQuery'
import { parseGetUserPositionsQuery } from './extensions/parseGetUserPositionsQuery'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { ISwapManager } from '@summerfi/swap-common'
import BigNumber from 'bignumber.js'
import type { IOracleManager } from '@summerfi/oracle-common'
import { ArmadaManagerClaims } from './ArmadaManagerClaims'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManager implements IArmadaManager {
  claims: IArmadaManagerClaims

  private _configProvider: IConfigurationProvider
  private _allowanceManager: IAllowanceManager
  private _contractsProvider: IContractsProvider
  private _subgraphManager: IArmadaSubgraphManager
  private _blockchainClientProvider: IBlockchainClientProvider
  private _swapManager: ISwapManager
  private _oracleManager: IOracleManager

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    contractsProvider: IContractsProvider
    subgraphManager: IArmadaSubgraphManager
    blockchainClientProvider: IBlockchainClientProvider
    swapManager: ISwapManager
    oracleManager: IOracleManager
  }) {
    this._configProvider = params.configProvider
    this._allowanceManager = params.allowanceManager
    this._contractsProvider = params.contractsProvider
    this._subgraphManager = params.subgraphManager
    this._blockchainClientProvider = params.blockchainClientProvider
    this._swapManager = params.swapManager
    this._oracleManager = params.oracleManager

    this.claims = new ArmadaManagerClaims(params)
  }

  /** POOLS */

  /** @see IArmadaManager.getVaultsRaw */
  async getVaultsRaw(params: Parameters<IArmadaManager['getVaultsRaw']>[0]) {
    return this._subgraphManager.getVaults({ chainId: params.chainInfo.chainId })
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
    return this._subgraphManager.getUsersActivity({ chainId: params.chainInfo.chainId })
  }

  /** @see IArmadaManager.getUserActivityRaw */
  async getUserActivityRaw(params: Parameters<IArmadaManager['getUserActivityRaw']>[0]) {
    return this._subgraphManager.getUserActivity({
      chainId: params.vaultId.chainInfo.chainId,
      vaultId: params.vaultId.fleetAddress.value,
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

    const { depositCap } = await fleetContract.config()
    const totalDeposits = await fleetERC4626Contract.totalAssets()
    const totalShares = await fleetERC20Contract.totalSupply()

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

  /** @see IArmadaManager.getFleetBalance */
  async getFleetBalance(params: Parameters<IArmadaManager['getFleetBalance']>[0]): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const shares = await this.getFleetShares(params)
    const assets = await fleetContract.asErc4626().convertToAssets({ amount: shares })

    return { shares, assets }
  }

  /** @see IArmadaManager.getStakedBalance */
  async getStakedBalance(params: Parameters<IArmadaManager['getStakedBalance']>[0]): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const shares = await this.getStakedShares(params)
    const assets = await fleetContract.asErc4626().convertToAssets({ amount: shares })

    return { assets, shares }
  }

  /** @see IArmadaManager.getTotalBalance */
  async getTotalBalance(params: Parameters<IArmadaManager['getTotalBalance']>[0]): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }> {
    const fleetBalance = await this.getFleetBalance(params)
    const stakedBalance = await this.getStakedBalance(params)

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

  /** CLAIMS TRANSACTIONS */

  /** @see IArmadaManagerClaims.eligibleForClaim */
  async eligibleForClaim(
    params: Parameters<IArmadaManagerClaims['eligibleForClaim']>[0],
  ): ReturnType<IArmadaManagerClaims['eligibleForClaim']> {
    return this.claims.eligibleForClaim(params)
  }

  /** @see IArmadaManagerClaims.getClaimTX */
  async getClaimTX(
    params: Parameters<IArmadaManagerClaims['getClaimTX']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimTX']> {
    return this.claims.getClaimTX(params)
  }

  /** @see IArmadaManagerClaims.getClaimAllTX */
  async getClaimAllTX(
    params: Parameters<IArmadaManagerClaims['getClaimAllTX']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimAllTX']> {
    return this.claims.getClaimAllTX(params)
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

  private async _getWithdrawTX(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    toToken: IToken
  }): Promise<ExtendedTransactionInfo[]> {
    const transactions: ExtendedTransactionInfo[] = []

    const { assets: fleetAssets, shares: fleetShares } = await this.getFleetBalance({
      vaultId: params.vaultId,
      user: params.user,
    })
    // handling for ETH
    const assetsToEOA = params.amount
    const swapToToken = params.toToken
    const shouldSwap = !swapToToken.equals(assetsToEOA.token)
    let swapToAmount: ITokenAmount | undefined = undefined

    LoggingService.debug('getWithdrawTX', {
      assetsToEOA: assetsToEOA.toString(),
      swapToToken: swapToToken.toString(),
      shouldSwap,
      fleetAssets: fleetAssets.toString(),
      fleetShares: fleetShares.toString(),
    })

    const admiralsQuarterAddress = getDeployedContractAddress({
      chainInfo: params.vaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    // are unstaked tokens available?
    if (fleetAssets.toSolidityValue() > 0) {
      // Yes. is the unstaked amount sufficient to meet the withdrawal?
      if (fleetAssets.toSolidityValue() >= assetsToEOA.toSolidityValue()) {
        LoggingService.debug('fleet balance is enough for requested amount', {
          fleetAssets: fleetAssets.toString(),
        })

        const sharesToWithdraw = await this._previewWithdraw({
          vaultId: params.vaultId,
          assets: assetsToEOA,
        })
        // Approve the requested amount in shares
        const approveToTakeUserShares = await this._allowanceManager.getApproval({
          chainInfo: params.vaultId.chainInfo,
          spender: admiralsQuarterAddress,
          amount: sharesToWithdraw,
          owner: params.user.wallet.address,
        })
        if (approveToTakeUserShares) {
          transactions.push(
            createApprovalTransaction({
              ...approveToTakeUserShares,
              metadata: { approvalAmount: sharesToWithdraw },
            }),
          )
          LoggingService.debug('approveToTakeUserShares', {
            sharesToWithdraw: sharesToWithdraw.toString(),
          })
        }
        const withdrawCall = await this._getExitWithdrawCall({
          vaultId: params.vaultId,
          slippage: params.slippage,
          amount: assetsToEOA,
          swapToToken,
          shouldSwap,
        })
        const multicallCalldata = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [withdrawCall.calldata],
        })
        transactions.push(
          createWithdrawTransaction({
            target: admiralsQuarterAddress,
            calldata: multicallCalldata,
            description: 'Withdraw Operation using unstaked shares',
            metadata: {
              fromAmount: assetsToEOA,
              toAmount: swapToAmount,
              slippage: params.slippage,
              priceImpact: await this._getPriceImpact({
                fromAmount: assetsToEOA,
                toAmount: swapToAmount,
              }),
            },
          }),
        )
      } else {
        // Request withdrawal of all unstaked tokens and the rest from staked tokens
        LoggingService.debug('fleet balance is not enough for requested amount', {
          fleetAssets: fleetAssets.toString(),
          assetsToEOA: assetsToEOA.toString(),
        })
        // approve all unstaken balance tx
        const approveToTakeUserShares = await this._allowanceManager.getApproval({
          chainInfo: params.vaultId.chainInfo,
          spender: admiralsQuarterAddress,
          amount: fleetShares,
          owner: params.user.wallet.address,
        })
        if (approveToTakeUserShares) {
          transactions.push(
            createApprovalTransaction({
              ...approveToTakeUserShares,
              metadata: { approvalAmount: fleetShares },
            }),
          )
          LoggingService.debug('approveToTakeUserShares', {
            sharesToWithdraw: fleetShares.toString(),
          })
        }
        // approval to swap from user EOA
        if (shouldSwap) {
          const approveToSwap = await this._allowanceManager.getApproval({
            chainInfo: params.vaultId.chainInfo,
            spender: admiralsQuarterAddress,
            amount: assetsToEOA,
            owner: params.user.wallet.address,
          })
          if (approveToSwap) {
            transactions.push(
              createApprovalTransaction({
                ...approveToSwap,
                metadata: { approvalAmount: assetsToEOA },
              }),
            )
            LoggingService.debug('approveToSwap', {
              assetsToEOA: assetsToEOA.toString(),
            })
          }
        }

        const multicallArgs: HexData[] = []
        // withdraw all fleet balance
        const exitWithdrawCall = await this._getExitWithdrawCall({
          vaultId: params.vaultId,
          slippage: params.slippage,
          amount: fleetAssets,
          swapToToken,
          shouldSwap,
        })
        multicallArgs.push(...exitWithdrawCall.calldata)

        // and the reminder from staked tokens
        const sharesToEOA = await this._previewWithdraw({
          vaultId: params.vaultId,
          assets: assetsToEOA,
        })
        const sharesToUnstake = sharesToEOA.subtract(fleetShares)
        LoggingService.debug('withdraw all from fleet and the rest from staked', {
          sharesToEOA: sharesToEOA.toSolidityValue(),
          sharesToUnstake: sharesToUnstake.toSolidityValue(),
        })
        const unstakeAndWithdrawCall = await this._getUnstakeAndWithdrawCall({
          vaultId: params.vaultId,
          shares: sharesToUnstake,
        })
        multicallArgs.push(...unstakeAndWithdrawCall.calldata)

        // swap to target token from user EOA
        if (shouldSwap) {
          const swapCall = await this._getEOASwapCall({
            vaultId: params.vaultId,
            slippage: params.slippage,
            fromAmount: assetsToEOA,
            toToken: swapToToken,
          })
          multicallArgs.push(...swapCall.calldata)
          swapToAmount = swapCall.toAmount
        }
        // compose multicall
        const multicallCalldata = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [multicallArgs],
        })
        transactions.push(
          createWithdrawTransaction({
            target: admiralsQuarterAddress,
            calldata: multicallCalldata,
            description: 'Withdraw Operation using mixed staked and unstaked shares',
            metadata: {
              fromAmount: assetsToEOA,
              toAmount: swapToAmount,
              slippage: params.slippage,
              priceImpact: await this._getPriceImpact({
                fromAmount: assetsToEOA,
                toAmount: swapToAmount,
              }),
            },
          }),
        )
      }
    } else {
      // No. Unstake and withdraw from staked tokens.
      const sharesToEOA = await this._previewWithdraw({
        vaultId: params.vaultId,
        assets: assetsToEOA,
      })
      LoggingService.debug('fleet balance is 0, take all from staked', {
        sharesToWithdraw: sharesToEOA.toString(),
      })

      // approval to swap from user EOA
      if (shouldSwap) {
        const approveToSwap = await this._allowanceManager.getApproval({
          chainInfo: params.vaultId.chainInfo,
          spender: admiralsQuarterAddress,
          amount: assetsToEOA,
          owner: params.user.wallet.address,
        })
        if (approveToSwap) {
          transactions.push(
            createApprovalTransaction({
              ...approveToSwap,
              metadata: { approvalAmount: assetsToEOA },
            }),
          )
          LoggingService.debug('approveToSwap', {
            assetsToEOA: assetsToEOA.toString(),
          })
        } else {
          LoggingService.debug('approveToSwap not needed, allowance exists', {
            assetsToEOA: assetsToEOA.toString(),
          })
        }
      }

      const multicallArgs: HexData[] = []
      const unstakeAndWithdrawCall = await this._getUnstakeAndWithdrawCall({
        vaultId: params.vaultId,
        shares: sharesToEOA,
      })
      multicallArgs.push(...unstakeAndWithdrawCall.calldata)

      if (shouldSwap) {
        const swapCall = await this._getEOASwapCall({
          vaultId: params.vaultId,
          slippage: params.slippage,
          fromAmount: assetsToEOA,
          toToken: swapToToken,
        })
        multicallArgs.push(...swapCall.calldata)
        swapToAmount = swapCall.toAmount
      }
      // compose multicall
      const multicallCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'multicall',
        args: [multicallArgs],
      })

      transactions.push(
        createWithdrawTransaction({
          target: admiralsQuarterAddress,
          calldata: multicallCalldata,
          description: 'Withdraw Operation using staked shares',
          metadata: {
            fromAmount: assetsToEOA,
            toAmount: swapToAmount,
            slippage: params.slippage,
            priceImpact: await this._getPriceImpact({
              fromAmount: assetsToEOA,
              toAmount: swapToAmount,
            }),
          },
        }),
      )
    }

    return transactions
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

    const isEth = params.amount.token.symbol === 'ETH'
    const shouldStake = params.shouldStake ?? true
    const shouldSwap = !params.amount.token.address.equals(fleetToken.address)

    let swapMinAmount: ITokenAmount | undefined
    let swapToAmount: ITokenAmount | undefined
    const transactions: ExtendedTransactionInfo[] = []

    LoggingService.debug('getDepositTX', {
      requestedAmount: params.amount.toString(),
      shouldStake,
      shouldSwap,
    })

    const admiralsQuarterAddress = getDeployedContractAddress({
      chainInfo: params.vaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    // Approval
    const approvalTransaction = await this._allowanceManager.getApproval({
      chainInfo: params.vaultId.chainInfo,
      spender: admiralsQuarterAddress,
      amount: params.amount,
      owner: params.user.wallet.address,
    })
    if (approvalTransaction) {
      transactions.push(
        createApprovalTransaction({
          ...approvalTransaction,
          metadata: { approvalAmount: params.amount },
        }),
      )
      LoggingService.debug('approvalTransaction', {
        amount: params.amount.toString(),
      })
    }

    const multicallArgs: HexData[] = []
    const depositTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'depositTokens',
      args: [params.amount.token.address.value, params.amount.toSolidityValue()],
    })
    multicallArgs.push(depositTokensCalldata)

    // If depositing a token that is not the fleet token,
    // we need to swap it to fleet asset
    if (shouldSwap) {
      const swapCall = await this._getSwapCall({
        vaultId: params.vaultId,
        fromAmount: params.amount,
        toToken: fleetToken,
        slippage: params.slippage,
      })
      multicallArgs.push(swapCall.calldata)
      swapToAmount = swapCall.toAmount
      swapMinAmount = swapCall.minAmount
    }

    // when staking admirals quarters will receive LV tokens, otherwise the user
    const lvTokenReceiver = shouldStake
      ? admiralsQuarterAddress.value
      : params.user.wallet.address.value

    const enterFleetCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'enterFleet',
      args: [params.vaultId.fleetAddress.value, fleetToken.address.value, 0n, lvTokenReceiver],
    })
    multicallArgs.push(enterFleetCalldata)

    if (shouldStake) {
      const stakeCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'stake',
        args: [params.vaultId.fleetAddress.value, 0n],
      })
      multicallArgs.push(stakeCalldata)
    }

    const multicallCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'multicall',
      args: [multicallArgs],
    })
    transactions.push(
      createDepositTransaction({
        target: admiralsQuarterAddress,
        calldata: multicallCalldata,
        description: 'Deposit Operation',
        value: isEth ? params.amount.toSolidityValue() : undefined,
        metadata: {
          fromAmount: params.amount,
          toAmount: swapToAmount,
          slippage: params.slippage,
          priceImpact: await this._getPriceImpact({
            fromAmount: params.amount,
            toAmount: swapToAmount,
          }),
        },
      }),
    )

    return transactions
  }

  /**
   * Internal utility method to generate a withdraw TX
   * @param params The parameters for the withdraw
   *
   * @returns The transactions needed to withdraw the tokens
   */
  private async _getExitWithdrawCall(params: {
    vaultId: IArmadaVaultId
    amount: ITokenAmount
    slippage: IPercentage
    swapToToken: IToken
    shouldSwap: boolean
  }): Promise<{
    calldata: HexData[]
  }> {
    const calldata: HexData[] = []

    const exitFleetCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'exitFleet',
      args: [params.vaultId.fleetAddress.value, params.amount.toSolidityValue()],
    })
    calldata.push(exitFleetCalldata)
    LoggingService.debug('exitFleet', {
      amount: params.amount.toString(),
    })

    let outAssets = params.amount

    // should swap
    if (params.shouldSwap) {
      const swapCall = await this._getSwapCall({
        vaultId: params.vaultId,
        fromAmount: params.amount,
        toToken: params.swapToToken,
        slippage: params.slippage,
      })
      calldata.push(swapCall.calldata)
      LoggingService.debug('swap', {
        minAmount: swapCall.minAmount.toString(),
      })
      outAssets = TokenAmount.createFromBaseUnit({
        token: params.swapToToken,
        amount: '0',
      })
    }

    const withdrawTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'withdrawTokens',
      args: [outAssets.token.address.value, outAssets.toSolidityValue()],
    })
    calldata.push(withdrawTokensCalldata)
    LoggingService.debug('withdrawTokens', {
      amount: outAssets.toString(),
    })

    return { calldata }
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
  }): Promise<{
    calldata: HexData[]
  }> {
    const calldata: HexData[] = []

    const withdrawUnstake = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'unstakeAndWithdrawAssets',
      args: [params.vaultId.fleetAddress.value, params.shares.toSolidityValue()],
    })
    calldata.push(withdrawUnstake)
    LoggingService.debug('unstakeAndWithdrawAssets', {
      amount: params.shares.toString(),
    })

    return { calldata }
  }

  private async _getQuoteAmount(params: {
    fromAmount: ITokenAmount
    toToken: IToken
  }): Promise<ITokenAmount> {
    // get swapdata from the 1inch swap api
    const swapData = await this._swapManager.getSwapQuoteExactInput({
      fromAmount: params.fromAmount,
      toToken: params.toToken,
    })

    return swapData.toTokenAmount
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
    const admiralsQuarterAddress = getDeployedContractAddress({
      chainInfo: params.vaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    // get swapdata from the 1inch swap api
    const swapData = await this._swapManager.getSwapDataExactInput({
      fromAmount: params.fromAmount,
      toToken: params.toToken,
      recipient: admiralsQuarterAddress,
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

  private async _getEOASwapCall(params: {
    vaultId: IArmadaVaultId
    fromAmount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
  }): Promise<{ calldata: HexData[]; minAmount: ITokenAmount; toAmount: ITokenAmount }> {
    const calldata: HexData[] = []

    // swapping out assets
    // deposit withdrawn assets
    const depositTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'depositTokens',
      args: [params.fromAmount.token.address.value, params.fromAmount.toSolidityValue()],
    })
    calldata.push(depositTokensCalldata)
    LoggingService.debug('depositTokens', {
      amount: params.fromAmount.toString(),
    })

    // swap
    const swapCall = await this._getSwapCall({
      vaultId: params.vaultId,
      fromAmount: params.fromAmount,
      toToken: params.toToken,
      slippage: params.slippage,
    })
    calldata.push(swapCall.calldata)
    LoggingService.debug('swap', {
      toAmount: swapCall.toAmount.toString(),
      minAmount: swapCall.minAmount.toString(),
    })
    const outAssets = TokenAmount.createFromBaseUnit({
      token: params.toToken,
      amount: '0',
    })

    // withdraw swapped assets
    const withdrawTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'withdrawTokens',
      args: [outAssets.token.address.value, outAssets.toSolidityValue()],
    })
    calldata.push(withdrawTokensCalldata)
    LoggingService.debug('withdrawTokens', {
      amount: outAssets.toString(),
    })

    return {
      calldata,
      minAmount: swapCall.minAmount,
      toAmount: swapCall.toAmount,
    }
  }

  private async _getPriceImpact(params: {
    fromAmount: ITokenAmount
    toAmount?: ITokenAmount
  }): Promise<TransactionPriceImpact | undefined> {
    if (params.toAmount === undefined) {
      return undefined
    }

    // for quote we should use optimal quote not the min quote
    const quotePrice = Price.createFrom({
      base: params.fromAmount.token,
      quote: params.toAmount.token,
      value: new BigNumber(params.toAmount.amount).div(params.fromAmount.amount).toString(),
    })

    const spotPrice = await this._oracleManager.getSpotPrice({
      baseToken: params.fromAmount.token,
      quoteToken: params.toAmount.token,
    })

    const impact = calculatePriceImpact(spotPrice.price, quotePrice)

    LoggingService.debug('getPriceImpact', {
      spotPrice: spotPrice.price.toString(),
      quotePrice: quotePrice.toString(),
      impact: impact.toString(),
    })

    return {
      price: spotPrice.price,
      impact,
    }
  }
}
