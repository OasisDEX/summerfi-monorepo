import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import {
  IArmadaManagerVaults,
  createDepositTransaction,
  createWithdrawTransaction,
  type IArmadaManagerUtils,
  createVaultSwitchTransaction,
  type MerklApiOpportunitiesResponse,
} from '@summerfi/armada-protocol-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { AdmiralsQuartersAbi } from '@summerfi/armada-protocol-abis'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import type { IOracleManager } from '@summerfi/oracle-common'
import {
  IChainInfo,
  IArmadaVaultId,
  IUser,
  ITokenAmount,
  IPercentage,
  IToken,
  TokenAmount,
  LoggingService,
  HexData,
  IAddress,
  type DepositTransactionInfo,
  type ApproveTransactionInfo,
  type WithdrawTransactionInfo,
  type IArmadaVaultInfo,
  ArmadaVaultInfo,
  ArmadaVaultId,
  getChainInfoByChainId,
  Address,
  Percentage,
  Price,
  FiatCurrency,
  FiatCurrencyAmount,
  fetchWithTimeout,
  type IPrice,
  type VaultApys,
  ChainIds,
  type ChainId,
  NATIVE_CURRENCY_ADDRESS_LOWERCASE,
  type TransactionPriceImpact,
  Token,
  type AddressValue,
} from '@summerfi/sdk-common'
import type { ISwapManager } from '@summerfi/swap-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import { encodeFunctionData } from 'viem'
import { BigNumber } from 'bignumber.js'
import type { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import { calculateRewardApy } from './utils/calculate-summer-yield'
import type { IDeploymentProvider } from '../..'
import { getByFleetAddressFallback } from './utils/merklRewardsFallback'
import { ArmadaManagerShared } from './ArmadaManagerShared'
import { EnsoClient, type BundleAction } from '../services/EnsoClient'
import type { RouteParams } from '@ensofinance/sdk'

export class ArmadaManagerVaults extends ArmadaManagerShared implements IArmadaManagerVaults {
  private _supportedChains: IChainInfo[]
  private _blockchainClientProvider: IBlockchainClientProvider
  private _configProvider: IConfigurationProvider
  private _tokensManager: ITokensManager
  private _allowanceManager: IAllowanceManager
  private _oracleManager: IOracleManager
  private _contractsProvider: IContractsProvider
  private _deploymentProvider: IDeploymentProvider
  private _swapManager: ISwapManager
  private _utils: IArmadaManagerUtils
  private _subgraphManager: IArmadaSubgraphManager
  private _functionsUrl: string
  private _namedReferralsBucketUrl: string

  constructor(params: {
    clientId?: string
    supportedChains: IChainInfo[]
    blockchainClientProvider: IBlockchainClientProvider
    configProvider: IConfigurationProvider
    tokensManager: ITokensManager
    allowanceManager: IAllowanceManager
    oracleManager: IOracleManager
    contractsProvider: IContractsProvider
    swapManager: ISwapManager
    utils: IArmadaManagerUtils
    subgraphManager: IArmadaSubgraphManager
    deploymentProvider: IDeploymentProvider
  }) {
    super({ clientId: params.clientId })
    this._supportedChains = params.supportedChains
    this._blockchainClientProvider = params.blockchainClientProvider
    this._configProvider = params.configProvider
    this._tokensManager = params.tokensManager
    this._allowanceManager = params.allowanceManager
    this._oracleManager = params.oracleManager
    this._contractsProvider = params.contractsProvider
    this._swapManager = params.swapManager
    this._deploymentProvider = params.deploymentProvider
    this._utils = params.utils
    this._subgraphManager = params.subgraphManager
    this._functionsUrl = this._configProvider.getConfigurationItem({
      name: 'FUNCTIONS_API_URL',
    })
    const bucketBaseUrl = this._configProvider.getConfigurationItem({
      name: 'SDK_DISTRIBUTIONS_BASE_URL',
    })
    const bucketFileName = this._configProvider.getConfigurationItem({
      name: 'SDK_NAMED_REFERRALS_FILE',
    })
    this._namedReferralsBucketUrl = new URL(bucketFileName, bucketBaseUrl).toString()
  }

  /**
   * @see IArmadaManagerVaults.getNewDepositTx
   */
  async getNewDepositTx(
    params: Parameters<IArmadaManagerVaults['getNewDepositTx']>[0],
  ): ReturnType<IArmadaManagerVaults['getNewDepositTx']> {
    return this._getDepositTx(params)
  }

  async getUpdateDepositTx(
    params: Parameters<IArmadaManagerVaults['getUpdateDepositTx']>[0],
  ): ReturnType<IArmadaManagerVaults['getUpdateDepositTx']> {
    // Call getNewDepositTX with user from positionId
    return this.getNewDepositTx({
      vaultId: params.vaultId,
      user: params.positionId.user,
      amount: params.amount,
      slippage: params.slippage,
      shouldStake: params.shouldStake,
    })
  }

  /**
   * @see IArmadaManagerVaults.getWithdrawTx
   */
  async getWithdrawTx(
    params: Parameters<IArmadaManagerVaults['getWithdrawTx']>[0],
  ): ReturnType<IArmadaManagerVaults['getWithdrawTx']> {
    return this._getWithdrawTx(params)
  }

  async getVaultSwitchTx(params: {
    sourceVaultId: IArmadaVaultId
    destinationVaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    shouldStake?: boolean
  }): ReturnType<IArmadaManagerVaults['getVaultSwitchTx']> {
    // vaults should have same chainId
    if (params.sourceVaultId.chainInfo.chainId !== params.destinationVaultId.chainInfo.chainId) {
      throw new Error('Vaults must be on the same chain')
    }
    const withdrawAmount = params.amount
    if (withdrawAmount.toSolidityValue() <= 0) {
      throw new Error('Cannot switch 0 or negative amounts')
    }

    const sourceFleet = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.sourceVaultId.chainInfo,
      address: params.sourceVaultId.fleetAddress,
    })
    const sourceFleetToken = await sourceFleet.asErc4626().asset()
    // source token must be the same as the amount
    if (!sourceFleetToken.address.equals(withdrawAmount.token.address)) {
      throw new Error('Source fleet token must be the same as the amount token')
    }

    const destinationFleet = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.destinationVaultId.chainInfo,
      address: params.destinationVaultId.fleetAddress,
    })
    const destinationFleetToken = await destinationFleet.asErc4626().asset()

    const shouldSwap = !destinationFleetToken.equals(sourceFleetToken)

    let swapToAmount: ITokenAmount | undefined
    let transactions: Awaited<ReturnType<IArmadaManagerVaults['getVaultSwitchTx']>>

    const [beforeFleetShares, beforeStakedShares, previewWithdrawSharesAmount] = await Promise.all([
      this._utils.getFleetShares({
        vaultId: params.sourceVaultId,
        user: params.user,
      }),
      this._utils.getStakedShares({
        vaultId: params.sourceVaultId,
        user: params.user,
      }),
      this._previewWithdraw({
        vaultId: params.sourceVaultId,
        assets: withdrawAmount,
      }),
    ])

    LoggingService.debug('getVaultSwitchTx', {
      beforeFleetShares: beforeFleetShares.toString(),
      beforeStakedShares: beforeStakedShares.toString(),
      beforeTotalShares: beforeFleetShares.add(beforeStakedShares).toString(),
      withdrawAmount: withdrawAmount.toString(),
      previewWithdrawSharesAmount: previewWithdrawSharesAmount.toString(),
      shouldSwap,
      sourceFleetToken: sourceFleetToken.toString(),
      destinationFleetToken: destinationFleetToken.toString(),
    })

    const admiralsQuartersAddress = this._deploymentProvider.getDeployedContractAddress({
      chainId: params.sourceVaultId.chainInfo.chainId,
      contractName: 'admiralsQuarters',
    })

    let approvalForWithdraw: ApproveTransactionInfo | undefined
    let approvalForDeposit: ApproveTransactionInfo | undefined

    // region Deposit logic
    // should compensate the tip during withdrawal
    const depositAmount = this._compensateAmount(withdrawAmount, 'decrease')

    // default to not staking as rewardsManager was deprecated
    const shouldStake = params.shouldStake ?? false

    const depositMulticallArgs: HexData[] = []
    const depositMulticallOperations: string[] = []

    const depositTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'depositTokens',
      args: [depositAmount.token.address.value, depositAmount.toSolidityValue()],
    })
    depositMulticallArgs.push(depositTokensCalldata)
    depositMulticallOperations.push('depositTokens ' + depositAmount.toString())

    // If depositing a token that is not the fleet token,
    // we need to swap it to fleet asset
    if (shouldSwap) {
      const swapCall = await this._utils.getSwapCall({
        vaultId: params.sourceVaultId,
        fromAmount: depositAmount,
        toToken: destinationFleetToken,
        slippage: params.slippage,
      })
      depositMulticallArgs.push(swapCall.calldata)
      depositMulticallOperations.push(
        `swap ${depositAmount.toString()} to min ${swapCall.minAmount.toString()}`,
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
      args: [params.destinationVaultId.fleetAddress.value, 0n, fleetTokenReceiver],
    })
    depositMulticallArgs.push(enterFleetCalldata)
    depositMulticallOperations.push('enterFleet all (0)')

    if (shouldStake) {
      const stakeCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'stake',
        args: [params.destinationVaultId.fleetAddress.value, 0n],
      })
      depositMulticallArgs.push(stakeCalldata)
      depositMulticallOperations.push('stake all (0)')
    }

    // region Withdraw logic

    // Are fleetShares available at all? (should be greater than dust)
    if (beforeFleetShares.toSolidityValue() > 0) {
      // Yes. Are fleetShares sufficient to meet the calculatedWithdrawShares?
      if (beforeFleetShares.toSolidityValue() >= previewWithdrawSharesAmount.toSolidityValue()) {
        // region only fleet
        // Yes. Withdraw all from fleetShares
        LoggingService.debug('>>> Withdraw all from fleetShares')

        const {
          finalWithdrawSharesApprovalAmount: finalWithdrawSharesApprovalAmount,
          finalWithdrawAmount: finalWithdrawAmount,
        } = this._calculateFinalWithdrawAmount({
          vaultId: params.sourceVaultId,
          fleetShares: beforeFleetShares,
          withdrawShares: previewWithdrawSharesAmount,
          withdrawAmount,
        })

        // Approve the requested amount in shares
        const [
          approvalToWithdrawSharesOnBehalf,
          approvalToDepositAsset,
          exitWithdrawMulticall,
          priceImpact,
        ] = await Promise.all([
          this._allowanceManager.getApproval({
            chainInfo: params.sourceVaultId.chainInfo,
            spender: admiralsQuartersAddress,
            amount: finalWithdrawSharesApprovalAmount,
            owner: params.user.wallet.address,
          }),
          this._allowanceManager.getApproval({
            chainInfo: params.sourceVaultId.chainInfo,
            spender: admiralsQuartersAddress,
            amount: withdrawAmount,
            owner: params.user.wallet.address,
          }),
          this._getExitWithdrawMulticall({
            vaultId: params.sourceVaultId,
            slippage: params.slippage,
            amount: finalWithdrawAmount,
            withdrawToken: finalWithdrawAmount.token,
            shouldSwap: false, //override as we do swap in deposit
            toEth: false,
          }),
          swapToAmount &&
            this._utils.getPriceImpact({
              fromAmount: withdrawAmount,
              toAmount: swapToAmount,
            }),
        ])

        if (approvalToWithdrawSharesOnBehalf) {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            spender: approvalToWithdrawSharesOnBehalf.metadata.approvalSpender.toString(),
            approved: approvalToWithdrawSharesOnBehalf.metadata.approvalAmount.toString(),
          })
        } else {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            message: 'No approval needed',
          })
        }

        approvalForWithdraw = approvalToWithdrawSharesOnBehalf
        approvalForDeposit = approvalToDepositAsset

        const multicallCalldata = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [[...exitWithdrawMulticall.multicallArgs, ...depositMulticallArgs]],
        })
        const withdrawTransaction = createVaultSwitchTransaction({
          target: admiralsQuartersAddress,
          calldata: multicallCalldata,
          description:
            'Vault Switch Operations: ' +
            exitWithdrawMulticall.multicallOperations.concat(depositMulticallOperations).join(', '),
          metadata: {
            fromAmount: withdrawAmount,
            toAmount: swapToAmount || withdrawAmount,
            fromVault: params.sourceVaultId,
            toVault: params.destinationVaultId,
            slippage: params.slippage,
            priceImpact,
          },
        })
        transactions =
          approvalForWithdraw && approvalForDeposit
            ? [approvalForWithdraw, approvalForDeposit, withdrawTransaction]
            : approvalForDeposit
              ? [approvalForDeposit, withdrawTransaction]
              : approvalForWithdraw
                ? [approvalForWithdraw, withdrawTransaction]
                : [withdrawTransaction]
      } else {
        // region fleet + staked
        // No. Withdraw all fleetShares and the reminder from stakedShares
        LoggingService.debug('>>> Withdraw all fleetShares and the reminder from stakedShares')

        const [previewRedeemAssetsAmount] = await Promise.all([
          this._previewRedeem({
            vaultId: params.sourceVaultId,
            shares: beforeFleetShares,
          }),
        ])

        const withdrawMulticallArgs: HexData[] = []
        const withdrawMulticallOperations: string[] = []
        const unstakeWithdrawMulticallArgs: HexData[] = []
        const unstakeWithdrawMulticallOperations: string[] = []

        const reminderFromStakedShares = previewWithdrawSharesAmount.subtract(beforeFleetShares)
        LoggingService.debug('- first take all fleet shares, then reminder from staked shares', {
          beforeFleetShares: beforeFleetShares.toString(),
          previewRedeemAssetsAmount: previewRedeemAssetsAmount.toString(),
          reminderShares: reminderFromStakedShares.toString(),
        })

        const finalUnstakeAndWithdrawAmount = await this._calculateFinalUnstakeAndWithdrawAmount({
          vaultId: params.sourceVaultId,
          withdrawShares: reminderFromStakedShares,
          stakedShares: beforeStakedShares,
          withdrawAmount: withdrawAmount,
        })

        const [
          approvalToWithdrawSharesOnBehalf,
          approvalToDepositBasedWithdrawAmount,
          exitWithdrawMulticall,
          unstakeAndWithdrawCall,
          priceImpact,
        ] = await Promise.all([
          this._allowanceManager.getApproval({
            chainInfo: params.sourceVaultId.chainInfo,
            spender: admiralsQuartersAddress,
            amount: beforeFleetShares,
            owner: params.user.wallet.address,
          }),
          this._allowanceManager.getApproval({
            chainInfo: params.sourceVaultId.chainInfo,
            spender: admiralsQuartersAddress,
            amount: withdrawAmount,
            owner: params.user.wallet.address,
          }),
          this._getExitWithdrawMulticall({
            vaultId: params.sourceVaultId,
            slippage: params.slippage,
            amount: previewRedeemAssetsAmount,
            withdrawToken: withdrawAmount.token,
            shouldSwap: false, //override as we do swap in deposit
            toEth: false, // in fleet it's always wrapped
          }),
          this._getUnstakeAndWithdrawCall({
            vaultId: params.sourceVaultId,
            sharesValue: finalUnstakeAndWithdrawAmount.finalUnstakeAndWithdrawSharesValue,
          }),
          swapToAmount &&
            this._utils.getPriceImpact({
              fromAmount: withdrawAmount,
              toAmount: swapToAmount,
            }),
        ])

        if (approvalToWithdrawSharesOnBehalf) {
          LoggingService.debug('approveToWithdrawSharesOnBehalf', {
            spender: approvalToWithdrawSharesOnBehalf.metadata.approvalSpender.toString(),
            approved: approvalToWithdrawSharesOnBehalf.metadata.approvalAmount.toString(),
          })
        } else {
          LoggingService.debug('approveToWithdrawSharesOnBehalf', {
            message: 'No approval needed',
          })
        }

        approvalForWithdraw = approvalToWithdrawSharesOnBehalf
        approvalForDeposit = approvalToDepositBasedWithdrawAmount

        withdrawMulticallArgs.push(...exitWithdrawMulticall.multicallArgs)
        withdrawMulticallOperations.push(...exitWithdrawMulticall.multicallOperations)

        unstakeWithdrawMulticallArgs.push(unstakeAndWithdrawCall.calldata)
        unstakeWithdrawMulticallOperations.push(
          'unstakeAndWithdraw ' + finalUnstakeAndWithdrawAmount.finalUnstakeAndWithdrawSharesValue,
        )

        // compose unstake withdraw deposit multicall
        const multicallCalldata = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [
            [...withdrawMulticallArgs, ...unstakeWithdrawMulticallArgs, ...depositMulticallArgs],
          ],
        })

        const vaultSwitchTransaction = createVaultSwitchTransaction({
          target: admiralsQuartersAddress,
          calldata: multicallCalldata,
          description:
            'Vault Switch Operations: ' +
            withdrawMulticallOperations
              .concat(unstakeWithdrawMulticallOperations)
              .concat(depositMulticallOperations)
              .join(', '),
          metadata: {
            fromAmount: withdrawAmount,
            toAmount: swapToAmount || withdrawAmount,
            fromVault: params.sourceVaultId,
            toVault: params.destinationVaultId,
            slippage: params.slippage,
            priceImpact,
          },
        })

        transactions =
          approvalForWithdraw && approvalForDeposit
            ? [approvalForWithdraw, approvalForDeposit, vaultSwitchTransaction]
            : approvalForDeposit
              ? [approvalForDeposit, vaultSwitchTransaction]
              : approvalForWithdraw
                ? [approvalForWithdraw, vaultSwitchTransaction]
                : [vaultSwitchTransaction]
      }
    } else {
      // region only staked
      // No. Unstake and withdraw everything from stakedShares.
      LoggingService.debug('>>> Unstake and withdraw everything from stakedShares.')

      const unstakeWithdrawMulticallArgs: HexData[] = []
      const unstakeWithdrawMulticallOperations: string[] = []

      const { finalUnstakeAndWithdrawSharesApprovalAmount, finalUnstakeAndWithdrawSharesValue } =
        await this._calculateFinalUnstakeAndWithdrawAmount({
          vaultId: params.sourceVaultId,
          withdrawShares: previewWithdrawSharesAmount,
          stakedShares: beforeStakedShares,
          withdrawAmount: withdrawAmount,
        })

      // withdraw all from staked tokens
      const [unstakeAndWithdrawCall, priceImpact] = await Promise.all([
        this._getUnstakeAndWithdrawCall({
          vaultId: params.sourceVaultId,
          sharesValue: finalUnstakeAndWithdrawSharesValue,
        }),
        swapToAmount &&
          this._utils.getPriceImpact({
            fromAmount: withdrawAmount,
            toAmount: swapToAmount,
          }),
      ])
      unstakeWithdrawMulticallArgs.push(unstakeAndWithdrawCall.calldata)
      unstakeWithdrawMulticallOperations.push(
        'unstakeAndWithdraw ' + finalUnstakeAndWithdrawSharesValue,
      )
      approvalForDeposit = await this._getApprovalBasedOnUnstakeWithdrawData({
        admiralsQuartersAddress,
        vaultId: params.sourceVaultId,
        user: params.user,
        amount: finalUnstakeAndWithdrawSharesApprovalAmount,
      })

      // compose unstake withdraw deposit multicall
      const multicallCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'multicall',
        args: [[...unstakeWithdrawMulticallArgs, ...depositMulticallArgs]],
      })

      const vaultSwitchTransaction = createVaultSwitchTransaction({
        target: admiralsQuartersAddress,
        calldata: multicallCalldata,
        description:
          'Vault Switch Operations: ' +
          unstakeWithdrawMulticallOperations.concat(depositMulticallOperations).join(', '),
        metadata: {
          fromAmount: withdrawAmount,
          toAmount: swapToAmount || withdrawAmount,
          fromVault: params.sourceVaultId,
          toVault: params.destinationVaultId,
          slippage: params.slippage,
          priceImpact,
        },
      })

      transactions = approvalForDeposit
        ? [approvalForDeposit, vaultSwitchTransaction]
        : [vaultSwitchTransaction]
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
   * @see IArmadaManagerVaults.getCrossChainDepositTx
   */
  async getCrossChainDepositTx(
    params: Parameters<IArmadaManagerVaults['getCrossChainDepositTx']>[0],
  ): ReturnType<IArmadaManagerVaults['getCrossChainDepositTx']> {
    return this._getCrossChainDepositTx(params)
  }

  /**
   * @see IArmadaManagerVaults.getCrossChainWithdrawTx
   */
  async getCrossChainWithdrawTx(
    params: Parameters<IArmadaManagerVaults['getCrossChainWithdrawTx']>[0],
  ): ReturnType<IArmadaManagerVaults['getCrossChainWithdrawTx']> {
    return this._getCrossChainWithdrawTx(params)
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
  private async _getDepositTx(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    shouldStake?: boolean
    referralCode?: string
  }): ReturnType<IArmadaManagerVaults['getNewDepositTx']> {
    const fleetCommander = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })
    const fleetToken = await fleetCommander.asErc4626().asset()

    const inAmount = params.amount
    const fromEth = inAmount.token.symbol === 'ETH'
    let swapFromAmount = inAmount
    // if the deposit is in ETH, we need to convert to WETH for the swap
    if (fromEth) {
      const token = this._tokensManager.getTokenBySymbol({
        chainInfo: params.vaultId.chainInfo,
        symbol: 'WETH',
      })
      swapFromAmount = TokenAmount.createFrom({
        amount: inAmount.amount,
        token,
      })
    }

    const shouldSwap = !swapFromAmount.token.equals(fleetToken)
    // default to not staking as rewardsManager was deprecated
    const shouldStake = params.shouldStake ?? false

    let swapToAmount: ITokenAmount | undefined

    LoggingService.debug('getDepositTx', {
      inAmount: inAmount.toString(),
      shouldSwap,
      isEth: fromEth,
      swapFromAmount: swapFromAmount.toString(),
      shouldStake,
    })

    const admiralsQuartersAddress = this._deploymentProvider.getDeployedContractAddress({
      chainId: params.vaultId.chainInfo.chainId,
      contractName: 'admiralsQuarters',
    })
    console.log('admiralsQuartersAddress', admiralsQuartersAddress)
    let approveTransaction: ApproveTransactionInfo | undefined
    // Approval for AQ
    if (!fromEth) {
      approveTransaction = await this._allowanceManager.getApproval({
        chainInfo: params.vaultId.chainInfo,
        spender: admiralsQuartersAddress,
        amount: inAmount,
        owner: params.user.wallet.address,
      })
      if (approveTransaction) {
        LoggingService.debug('approvalTransaction', {
          approved: approveTransaction.metadata.approvalAmount.toString(),
          spender: approveTransaction.metadata.approvalSpender.toString(),
        })
      } else {
        LoggingService.debug('approvalTransaction', {
          message: 'No approval needed',
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
      const swapCall = await this._utils.getSwapCall({
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

    const validReferralCode = await this._validateReferralCode({
      referralCode: params.referralCode,
    })
    const args = validReferralCode
      ? ([params.vaultId.fleetAddress.value, 0n, fleetTokenReceiver, validReferralCode] as const)
      : ([params.vaultId.fleetAddress.value, 0n, fleetTokenReceiver] as const)

    const enterFleetCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'enterFleet',
      args,
    })
    multicallArgs.push(enterFleetCalldata)
    multicallOperations.push(
      'enterFleet all (0)' + (validReferralCode ? ` with referral ${validReferralCode}` : ''),
    )

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
    const depositTransaction = createDepositTransaction({
      target: admiralsQuartersAddress,
      calldata: multicallCalldata,
      description: 'Deposit Operations: ' + multicallOperations.join(', '),
      value: fromEth ? inAmount.toSolidityValue() : undefined,
      metadata: {
        fromAmount: inAmount,
        toAmount: swapToAmount || inAmount,
        slippage: params.slippage,
        priceImpact:
          swapToAmount &&
          (await this._utils.getPriceImpact({
            fromAmount: inAmount,
            toAmount: swapToAmount,
          })),
      },
    })
    const transactions:
      | [DepositTransactionInfo]
      | [ApproveTransactionInfo, DepositTransactionInfo] = approveTransaction
      ? [approveTransaction, depositTransaction]
      : [depositTransaction]

    LoggingService.debug('transactions', {
      transactions: transactions.map(({ description, type, transaction }) => ({
        description,
        type,
        transactionValue: transaction.value,
      })),
    })

    return transactions
  }

  private async _validateReferralCode(params: {
    referralCode: string | undefined
  }): Promise<HexData | undefined> {
    if (!params.referralCode) {
      return undefined
    }

    let validReferral: bigint

    // check if the referral code is in the namedReferrals mapping
    const namedReferral = await this._checkInNamedReferrals(params.referralCode)
    if (namedReferral) {
      validReferral = namedReferral
    }
    // check if params.referralCode is a valid bigint
    else if (
      /^\d+$/.test(params.referralCode) &&
      BigInt(params.referralCode) > 0n &&
      BigInt(params.referralCode) < 2n ** 64n
    ) {
      validReferral = BigInt(params.referralCode)
    } else {
      throw new Error(
        'Invalid referral code. It must be a positive integer or a valid named referral.',
      )
    }
    // encode referral to hex string representation
    const referralCodeHex = ('0x' + validReferral.toString(16).padStart(64, '0')) as HexData
    return referralCodeHex
  }

  private async _checkInNamedReferrals(referralCode: string): Promise<bigint | undefined> {
    const url = this._namedReferralsBucketUrl

    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Failed to fetch named referrals: ${res.status} ${res.statusText}`)
    }
    const json: { [referralCode: string]: string } = await res.json().catch((error) => {
      throw new Error('Failed to load sdk bucket: ' + url + '\n' + error)
    })

    const code = json[referralCode]
    if (code) {
      const codeBigInt = BigInt(code)
      if (codeBigInt > 0n && codeBigInt < 2n ** 64n) {
        return codeBigInt
      } else {
        throw new Error('Invalid referral code in the named referrals bucket: ' + code)
      }
    } else {
      return undefined
    }
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
  private async _getWithdrawTx(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    toToken: IToken
  }): ReturnType<IArmadaManagerVaults['getWithdrawTx']> {
    const withdrawAmount = params.amount
    const toEth = params.toToken.symbol === 'ETH'
    const swapToToken = params.toToken
    const shouldSwap = !swapToToken.equals(withdrawAmount.token)

    if (withdrawAmount.toSolidityValue() <= 0) {
      throw new Error('Cannot withdraw 0 or negative amounts')
    }

    // let swapMinAmount: ITokenAmount | undefined
    let swapToAmount: ITokenAmount | undefined = undefined
    let transactions: Awaited<ReturnType<IArmadaManagerVaults['getWithdrawTx']>>

    const [beforeFleetShares, beforeStakedShares, previewWithdrawSharesAmount] = await Promise.all([
      this._utils.getFleetShares({
        vaultId: params.vaultId,
        user: params.user,
      }),
      this._utils.getStakedShares({
        vaultId: params.vaultId,
        user: params.user,
      }),
      this._previewWithdraw({
        vaultId: params.vaultId,
        assets: withdrawAmount,
      }),
    ])

    LoggingService.debug('getWithdrawTX', {
      beforeFleetShares: beforeFleetShares.toString(),
      beforeStakedShares: beforeStakedShares.toString(),
      withdrawAmount: withdrawAmount.toString(),
      previewWithdrawSharesAmount: previewWithdrawSharesAmount.toString(),
      toEth: toEth,
      swapToToken: swapToToken.toString(),
      shouldSwap,
    })

    const admiralsQuartersAddress = this._deploymentProvider.getDeployedContractAddress({
      chainId: params.vaultId.chainInfo.chainId,
      contractName: 'admiralsQuarters',
    })

    // region Withdraw logic
    // Are fleetShares available at all? (should be greater than dust)
    if (beforeFleetShares.toSolidityValue() > 0) {
      // Yes. Are fleetShares sufficient to meet the calculatedWithdrawShares?
      if (beforeFleetShares.toSolidityValue() >= previewWithdrawSharesAmount.toSolidityValue()) {
        // region only fleet
        // Yes. Withdraw all from fleetShares
        LoggingService.debug('>>> Withdraw all from fleetShares')

        const {
          finalWithdrawSharesApprovalAmount: finalWithdrawSharesApprovalAmount,
          finalWithdrawAmount: finalWithdrawAmount,
        } = this._calculateFinalWithdrawAmount({
          vaultId: params.vaultId,
          fleetShares: beforeFleetShares,
          withdrawShares: previewWithdrawSharesAmount,
          withdrawAmount,
        })
        // Approve the requested amount in shares
        const [approvalToWithdrawSharesOnBehalf, exitWithdrawMulticall, priceImpact] =
          await Promise.all([
            this._allowanceManager.getApproval({
              chainInfo: params.vaultId.chainInfo,
              spender: admiralsQuartersAddress,
              amount: finalWithdrawSharesApprovalAmount,
              owner: params.user.wallet.address,
            }),
            this._getExitWithdrawMulticall({
              vaultId: params.vaultId,
              slippage: params.slippage,
              amount: finalWithdrawAmount,
              withdrawToken: swapToToken,
              shouldSwap,
              toEth,
            }),
            swapToAmount &&
              this._utils.getPriceImpact({
                fromAmount: withdrawAmount,
                toAmount: swapToAmount,
              }),
          ])

        if (approvalToWithdrawSharesOnBehalf) {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            spender: approvalToWithdrawSharesOnBehalf.metadata.approvalSpender.toString(),
            approved: approvalToWithdrawSharesOnBehalf.metadata.approvalAmount.toString(),
          })
        } else {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            message: 'No approval needed',
          })
        }

        const multicallCalldata = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [exitWithdrawMulticall.multicallArgs],
        })
        const withdrawTransaction = createWithdrawTransaction({
          target: admiralsQuartersAddress,
          calldata: multicallCalldata,
          description:
            'Withdraw Operations: ' + exitWithdrawMulticall.multicallOperations.join(', '),
          metadata: {
            fromAmount: withdrawAmount,
            toAmount: swapToAmount || withdrawAmount,
            slippage: params.slippage,
            priceImpact,
          },
        })
        if (approvalToWithdrawSharesOnBehalf) {
          transactions = [approvalToWithdrawSharesOnBehalf, withdrawTransaction]
        } else {
          transactions = [withdrawTransaction]
        }
      } else {
        // region fleet + staked
        // No. Withdraw all fleetShares and the reminder from stakedShares
        LoggingService.debug('>>> Withdraw all fleetShares and the reminder from stakedShares')

        const [previewRedeemAssetsAmount] = await Promise.all([
          this._previewRedeem({
            vaultId: params.vaultId,
            shares: beforeFleetShares,
          }),
        ])

        const withdrawMulticallArgs: HexData[] = []
        const withdrawMulticallOperations: string[] = []
        const unstakeWithdrawMulticallArgs: HexData[] = []
        const unstakeWithdrawMulticallOperations: string[] = []

        const reminderFromStakedShares = previewWithdrawSharesAmount.subtract(beforeFleetShares)
        LoggingService.debug('- first take all fleet shares, then reminder from staked shares', {
          beforeFleetShares: beforeFleetShares.toString(),
          previewRedeemAssetsAmount: previewRedeemAssetsAmount.toString(),
          reminderShares: reminderFromStakedShares.toString(),
        })

        const finalUnstakeAndWithdrawAmount = await this._calculateFinalUnstakeAndWithdrawAmount({
          vaultId: params.vaultId,
          withdrawShares: reminderFromStakedShares,
          stakedShares: beforeStakedShares,
          withdrawAmount: withdrawAmount,
        })

        const [
          approveToWithdrawSharesOnBehalf,
          exitWithdrawMulticall,
          unstakeAndWithdrawCall,
          priceImpact,
        ] = await Promise.all([
          this._allowanceManager.getApproval({
            chainInfo: params.vaultId.chainInfo,
            spender: admiralsQuartersAddress,
            amount: beforeFleetShares,
            owner: params.user.wallet.address,
          }),
          this._getExitWithdrawMulticall({
            vaultId: params.vaultId,
            slippage: params.slippage,
            amount: previewRedeemAssetsAmount,
            exitAll: true,
            withdrawToken: swapToToken,
            shouldSwap,
            toEth,
          }),
          this._getUnstakeAndWithdrawCall({
            vaultId: params.vaultId,
            sharesValue: finalUnstakeAndWithdrawAmount.finalUnstakeAndWithdrawSharesValue,
          }),
          swapToAmount &&
            this._utils.getPriceImpact({
              fromAmount: withdrawAmount,
              toAmount: swapToAmount,
            }),
        ])

        if (approveToWithdrawSharesOnBehalf) {
          LoggingService.debug('approveToWithdrawSharesOnBehalf', {
            spender: approveToWithdrawSharesOnBehalf.metadata.approvalSpender.toString(),
            approved: approveToWithdrawSharesOnBehalf.metadata.approvalAmount.toString(),
          })
        } else {
          LoggingService.debug('approveToWithdrawSharesOnBehalf', {
            message: 'No approval needed',
          })
        }

        withdrawMulticallArgs.push(...exitWithdrawMulticall.multicallArgs)
        withdrawMulticallOperations.push(...exitWithdrawMulticall.multicallOperations)

        unstakeWithdrawMulticallArgs.push(unstakeAndWithdrawCall.calldata)
        unstakeWithdrawMulticallOperations.push(
          'unstakeAndWithdraw ' + finalUnstakeAndWithdrawAmount.finalUnstakeAndWithdrawSharesValue,
        )

        let approvalDepositSwapWithdraw: ApproveTransactionInfo | undefined

        // we need to swap to eth after unstake&withdraw but only the unstaked part
        if (shouldSwap || toEth) {
          // approval to swap from user EOA
          const [_approvalDepositSwapWithdraw, depositSwapWithdrawMulticall] = await Promise.all([
            this._allowanceManager.getApproval({
              chainInfo: params.vaultId.chainInfo,
              spender: admiralsQuartersAddress,
              amount: finalUnstakeAndWithdrawAmount.finalUnstakeAndWithdrawSharesApprovalAmount,
              owner: params.user.wallet.address,
            }),
            this._getDepositSwapWithdrawMulticall({
              vaultId: params.vaultId,
              slippage: params.slippage,
              fromAmount: finalUnstakeAndWithdrawAmount.finalUnstakeAndWithdrawSharesApprovalAmount,
              toToken: swapToToken,
              toEth,
            }),
          ])

          if (_approvalDepositSwapWithdraw) {
            approvalDepositSwapWithdraw = _approvalDepositSwapWithdraw
            LoggingService.debug('approvalDepositSwapWithdraw', {
              spender: approvalDepositSwapWithdraw.metadata.approvalSpender.toString(),
              approved: approvalDepositSwapWithdraw.metadata.approvalAmount.toString(),
            })
          } else {
            LoggingService.debug('approvalDepositSwapWithdraw', {
              message: 'No approval needed',
            })
          }

          unstakeWithdrawMulticallArgs.push(...depositSwapWithdrawMulticall.multicallArgs)
          unstakeWithdrawMulticallOperations.push(
            ...depositSwapWithdrawMulticall.multicallOperations,
          )
          swapToAmount = depositSwapWithdrawMulticall.toAmount
        }

        // compose multicall
        const multicallCalldata = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [[...withdrawMulticallArgs, ...unstakeWithdrawMulticallArgs]],
        })
        const withdrawTransaction = createWithdrawTransaction({
          target: admiralsQuartersAddress,
          calldata: multicallCalldata,
          description:
            'Withdraw Operations: ' +
            withdrawMulticallOperations.concat(unstakeWithdrawMulticallOperations).join(', '),
          metadata: {
            fromAmount: withdrawAmount,
            toAmount: swapToAmount || withdrawAmount,
            slippage: params.slippage,
            priceImpact,
          },
        })

        transactions =
          approveToWithdrawSharesOnBehalf && approvalDepositSwapWithdraw
            ? [approveToWithdrawSharesOnBehalf, approvalDepositSwapWithdraw, withdrawTransaction]
            : approvalDepositSwapWithdraw
              ? [approvalDepositSwapWithdraw, withdrawTransaction]
              : approveToWithdrawSharesOnBehalf
                ? [approveToWithdrawSharesOnBehalf, withdrawTransaction]
                : [withdrawTransaction]
      }
    } else {
      // region only staked
      // No. Unstake and withdraw everything from stakedShares.
      LoggingService.debug('>>> Unstake and withdraw everything from stakedShares.')

      const unstakeWithdrawMulticallArgs: HexData[] = []
      const unstakeWithdrawMulticallOperations: string[] = []

      const finalUnstakeAndWithdrawAmount = await this._calculateFinalUnstakeAndWithdrawAmount({
        vaultId: params.vaultId,
        withdrawShares: previewWithdrawSharesAmount,
        stakedShares: beforeStakedShares,
        withdrawAmount: withdrawAmount,
      })

      // withdraw all from staked tokens
      const [unstakeAndWithdrawCall, priceImpact] = await Promise.all([
        this._getUnstakeAndWithdrawCall({
          vaultId: params.vaultId,
          sharesValue: finalUnstakeAndWithdrawAmount.finalUnstakeAndWithdrawSharesValue,
        }),
        swapToAmount &&
          this._utils.getPriceImpact({
            fromAmount: withdrawAmount,
            toAmount: swapToAmount,
          }),
      ])
      unstakeWithdrawMulticallArgs.push(unstakeAndWithdrawCall.calldata)
      unstakeWithdrawMulticallOperations.push(
        'unstakeAndWithdraw ' + finalUnstakeAndWithdrawAmount.finalUnstakeAndWithdrawSharesValue,
      )

      let approvalDepositSwapWithdraw: ApproveTransactionInfo | undefined

      if (shouldSwap) {
        // approval to swap from user EOA
        const [_approvalDepositSwapWithdraw, depositSwapWithdrawMulticall] = await Promise.all([
          this._allowanceManager.getApproval({
            chainInfo: params.vaultId.chainInfo,
            spender: admiralsQuartersAddress,
            amount: withdrawAmount,
            owner: params.user.wallet.address,
          }),
          this._getDepositSwapWithdrawMulticall({
            vaultId: params.vaultId,
            slippage: params.slippage,
            fromAmount: withdrawAmount,
            toToken: swapToToken,
            toEth,
          }),
        ])

        if (_approvalDepositSwapWithdraw) {
          approvalDepositSwapWithdraw = _approvalDepositSwapWithdraw
          LoggingService.debug('approvalDepositSwapWithdraw', {
            spender: approvalDepositSwapWithdraw.metadata.approvalSpender.toString(),
            approved: approvalDepositSwapWithdraw.metadata.approvalAmount.toString(),
          })
        } else {
          LoggingService.debug('approvalDepositSwapWithdraw', {
            message: 'No approval needed',
          })
        }

        unstakeWithdrawMulticallArgs.push(...depositSwapWithdrawMulticall.multicallArgs)
        unstakeWithdrawMulticallOperations.push(...depositSwapWithdrawMulticall.multicallOperations)
        swapToAmount = depositSwapWithdrawMulticall.toAmount
      }

      // compose unstake withdraw multicall
      const multicallCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'multicall',
        args: [unstakeWithdrawMulticallArgs],
      })

      const withdrawTransaction = createWithdrawTransaction({
        target: admiralsQuartersAddress,
        calldata: multicallCalldata,
        description: 'Withdraw Operations: ' + unstakeWithdrawMulticallOperations.join(', '),
        metadata: {
          fromAmount: withdrawAmount,
          toAmount: swapToAmount || withdrawAmount,
          slippage: params.slippage,
          priceImpact,
        },
      })

      transactions = approvalDepositSwapWithdraw
        ? [approvalDepositSwapWithdraw, withdrawTransaction]
        : [withdrawTransaction]
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

    // we need to compensate for the tip eating during unstake-withdraw,
    // so the amount user get from the vault can be a tiny bit lower
    const depositAmount = this._compensateAmount(params.fromAmount, 'decrease')

    const depositTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'depositTokens',
      args: [depositAmount.token.address.value, depositAmount.toSolidityValue()],
    })
    multicallArgs.push(depositTokensCalldata)
    multicallOperations.push('depositTokens ' + depositAmount.toString())

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

    // do not swap from WETH to ETH, it will be unwrapped and transferred on withdraw instead
    if (depositAmount.token.symbol !== 'WETH' || !params.toEth) {
      swapCall = await this._utils.getSwapCall({
        vaultId: params.vaultId,
        fromAmount: depositAmount,
        toToken: outToken,
        slippage: params.slippage,
      })
      multicallArgs.push(swapCall.calldata)
      multicallOperations.push(
        `swap ${depositAmount.toString()} to min ${swapCall.minAmount.toString()}`,
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
    if (depositAmount.token.symbol === 'WETH' && params.toEth) {
      // if we are withdrawing WETH to ETH, we'll unwrap and transfer WETH
      multicallOperations.push(
        `unwrap ${outAmount.toString()} and send as ETH ${outAmount.token.address.value}`,
      )
    } else {
      multicallOperations.push('withdrawTokens ' + outAmount.toString())
    }

    return {
      multicallArgs: multicallArgs,
      multicallOperations: multicallOperations,
      minAmount: swapCall?.minAmount,
      toAmount: swapCall?.toAmount,
    }
  }
  /**
   * Internal utility method to generate a withdraw+unstake TX
   * @param params The parameters for the withdraw+unstake
   *
   * @returns The transactions needed to withdraw+unstake the tokens
   */
  private async _getUnstakeAndWithdrawCall(params: {
    vaultId: IArmadaVaultId
    sharesValue: bigint
    claimRewards?: boolean
  }): Promise<{
    calldata: HexData
  }> {
    const claimRewards = params.claimRewards ?? true

    const calldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'unstakeAndWithdrawAssets',
      args: [params.vaultId.fleetAddress.value, params.sharesValue, claimRewards],
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
    withdrawToken: IToken
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
    multicallOperations.push(
      'exitFleet ' +
        (fromAmount.toSolidityValue() === 0n || exitAll
          ? fromAmount.token.toString() + ' (all)'
          : fromAmount.toString()),
    )

    let toToken = params.withdrawToken
    // if the out token is ETH, we need to use wrapped ETH to withdraw
    if (params.toEth) {
      toToken = await this._tokensManager.getTokenBySymbol({
        chainInfo: params.vaultId.chainInfo,
        symbol: 'WETH',
      })
    }

    // do not swap from WETH to ETH
    if (params.shouldSwap && (fromAmount.token.symbol !== 'WETH' || !params.toEth)) {
      // we need to compensate for the tip eating exited amount
      // by decreasing swap amount as it will be lower than read amount
      const compensatedFromAmount = this._compensateAmount(fromAmount, 'decrease')
      // const compensatedFromAmount = fromAmount

      const swapCall = await this._utils.getSwapCall({
        vaultId: params.vaultId,
        fromAmount: compensatedFromAmount,
        toToken: toToken,
        slippage: params.slippage,
      })
      multicallArgs.push(swapCall.calldata)
      multicallOperations.push(
        `swap ${compensatedFromAmount.toString()} to min ${swapCall.minAmount.toString()}`,
      )

      const withdrawRemainingDustAfterSwapCalldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'withdrawTokens',
        args: [fromAmount.token.address.value, 0n],
      })
      multicallArgs.push(withdrawRemainingDustAfterSwapCalldata)
      multicallOperations.push(
        'withdrawRemainingDustAfterSwap ' + fromAmount.token.toString() + ' (all)',
      )
    }

    const withdrawAll = TokenAmount.createFromBaseUnit({
      token: params.withdrawToken,
      amount: '0', // all
    })

    const withdrawTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'withdrawTokens',
      args: [withdrawAll.token.address.value, withdrawAll.toSolidityValue()],
    })
    multicallArgs.push(withdrawTokensCalldata)
    multicallOperations.push(
      'withdrawTokens ' +
        (fromAmount.toSolidityValue() === 0n || exitAll
          ? fromAmount.token.toString() + ' (all)'
          : fromAmount.toString()),
    )

    return { multicallArgs, multicallOperations }
  }

  /**
   * Compensate the amount with slight increase or decrease, rounding down
   * @param amount The amount to compensate
   * @param direction The direction to compensate (increase or decrease)
   * @returns The compensated amount
   * @throws Error if the direction is invalid
   */

  private _compensateAmount(
    amount: ITokenAmount,
    direction: 'increase' | 'decrease',
  ): ITokenAmount {
    const multiplierUp = 1.00001
    const multiplierDown = 0.99999

    let multiplier: number
    switch (direction) {
      case 'increase':
        multiplier = multiplierUp
        break
      case 'decrease':
        multiplier = multiplierDown
        break
      default:
        throw new Error(`Invalid direction: ${direction}. Must be 'increase' or 'decrease'.`)
    }

    return TokenAmount.createFromBaseUnit({
      token: amount.token,
      amount: new BigNumber(amount.toSolidityValue().toString())
        .times(multiplier)
        .toFixed(0, BigNumber.ROUND_DOWN),
    })
  }

  private _calculateFinalWithdrawAmount(params: {
    vaultId: IArmadaVaultId
    fleetShares: ITokenAmount
    withdrawShares: ITokenAmount
    withdrawAmount: ITokenAmount
  }): {
    shouldWithdrawAll: boolean
    finalWithdrawSharesApprovalAmount: ITokenAmount
    finalWithdrawAmount: ITokenAmount
  } {
    // if the requested amount is close to all fleet shares, we make assumption to withdraw all
    const withdrawAllThreshold = 0.998

    const sharesToWithdraw = params.withdrawShares.toSolidityValue()
    const fleetShares = params.fleetShares.toSolidityValue()
    if (sharesToWithdraw <= 0n || fleetShares <= 0n) {
      throw new Error('Cannot calculate final withdraw amount for 0 or negative shares')
    }

    const shouldWithdrawAll = new BigNumber(sharesToWithdraw.toString())
      .div(fleetShares.toString())
      .gte(withdrawAllThreshold)
    const approvalAmountValue = shouldWithdrawAll ? fleetShares : sharesToWithdraw
    const approvalAmount = TokenAmount.createFromBaseUnit({
      token: params.withdrawShares.token,
      amount: approvalAmountValue.toString(),
    })
    // if we are withdrawing all, we set withdraw amount to 0 (all)
    // so the contract can calculate the exact amount
    // otherwise we use the requested withdraw amount
    const finalWithdrawAmount = shouldWithdrawAll
      ? TokenAmount.createFromBaseUnit({
          token: params.withdrawAmount.token,
          amount: '0',
        })
      : params.withdrawAmount

    LoggingService.debug('_calculateWithdrawSharesData', {
      shouldWithdrawAll,
      finalWithdrawSharesApprovalAmount: approvalAmount.toString(),
      finalWithdrawAmount: finalWithdrawAmount.toString(),
    })

    return {
      shouldWithdrawAll,
      finalWithdrawSharesApprovalAmount: approvalAmount,
      finalWithdrawAmount: finalWithdrawAmount,
    }
  }

  private async _calculateFinalUnstakeAndWithdrawAmount(params: {
    vaultId: IArmadaVaultId
    stakedShares: ITokenAmount
    withdrawShares: ITokenAmount
    withdrawAmount: ITokenAmount
  }): Promise<{
    shouldWithdrawAll: boolean
    finalUnstakeAndWithdrawSharesApprovalAmount: ITokenAmount
    finalUnstakeAndWithdrawSharesValue: bigint
  }> {
    // if the requested amount is close to all staked shares, we make assumption to withdraw all
    const withdrawAllThreshold = 0.998

    const sharesToWithdraw = params.withdrawShares.toSolidityValue()
    const stakedShares = params.stakedShares.toSolidityValue()
    if (sharesToWithdraw <= 0n || stakedShares <= 0n) {
      throw new Error('Cannot calculate final unstake and withdraw amount for 0 or negative shares')
    }

    const shouldWithdrawAll = new BigNumber(sharesToWithdraw.toString())
      .div(stakedShares.toString())
      .gte(withdrawAllThreshold)
    const sharesValue = shouldWithdrawAll ? 0n : sharesToWithdraw

    let approvalAmount: ITokenAmount | undefined
    if (shouldWithdrawAll) {
      const calculatedFullAmount = await this._previewRedeem({
        vaultId: params.vaultId,
        shares: params.withdrawShares,
      })
      approvalAmount = calculatedFullAmount
    } else {
      // if we are not withdrawing all, we need to approve the requested amount
      approvalAmount = params.withdrawAmount
    }

    LoggingService.debug('_calculateWithdrawalDataForStakedShares', {
      shouldWithdrawAll,
      finalUnstakeAndWithdrawSharesValue: sharesValue.toString(),
      finalUnstakeAndWithdrawSharesApprovalAmount: approvalAmount.toString(),
    })

    return {
      shouldWithdrawAll,
      finalUnstakeAndWithdrawSharesValue: sharesValue,
      finalUnstakeAndWithdrawSharesApprovalAmount: approvalAmount,
    }
  }

  private async _getApprovalBasedOnUnstakeWithdrawData(params: {
    admiralsQuartersAddress: IAddress
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
  }) {
    let result: ApproveTransactionInfo | undefined

    const [approvalTx] = await Promise.all([
      this._allowanceManager.getApproval({
        chainInfo: params.vaultId.chainInfo,
        spender: params.admiralsQuartersAddress,
        amount: params.amount,
        owner: params.user.wallet.address,
      }),
    ])
    if (approvalTx) {
      LoggingService.debug('approvalForDeposit', {
        spender: approvalTx.metadata.approvalSpender.toString(),
        approved: approvalTx.metadata.approvalAmount.toString(),
      })
      result = approvalTx
    } else {
      LoggingService.debug('approvalForDeposit', {
        message: 'No approval needed',
      })
    }
    return result
  }

  /** @see IArmadaManagerVaults.getVaultInfo */
  async getVaultInfo(
    params: Parameters<IArmadaManagerVaults['getVaultInfo']>[0],
  ): Promise<IArmadaVaultInfo> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })

    const fleetERC4626Contract = fleetContract.asErc4626()
    const fleetERC20Contract = fleetERC4626Contract.asErc20()

    const [config, token, assetToken, totalDeposits, totalShares, apys, rewardsApys, merklRewards] =
      await Promise.all([
        fleetContract.config(),
        fleetERC20Contract.getToken(),
        fleetERC4626Contract.asset(),
        fleetERC4626Contract.totalAssets(),
        fleetERC20Contract.totalSupply(),
        this.getVaultsApys({
          chainId: params.vaultId.chainInfo.chainId,
          vaultIds: [params.vaultId],
        }),
        this.getVaultsRewardsApys({
          chainId: params.vaultId.chainInfo.chainId,
          vaultIds: [params.vaultId],
        }),
        this.getMerklRewardsData({
          chainId: params.vaultId.chainInfo.chainId,
          vaultIds: [params.vaultId],
        }),
      ])
    const { depositCap } = config

    const apysForVault = apys.byFleetAddress[params.vaultId.fleetAddress.value.toLowerCase()]

    const sharePrice = Price.createFromAmountsRatio({
      numerator: totalDeposits,
      denominator: totalShares,
    })

    // Calculate tvlUsd from rawVault data or default to 0
    const tvlUsd = FiatCurrencyAmount.createFrom({
      fiat: FiatCurrency.USD,
      amount: params.rawVault?.totalValueLockedUSD ?? '0',
    })

    return ArmadaVaultInfo.createFrom({
      id: params.vaultId,
      token: token,
      assetToken: assetToken,
      depositCap: depositCap,
      totalDeposits: totalDeposits,
      totalShares: totalShares,
      sharePrice: sharePrice,
      apy: apysForVault?.live || null,
      apys: apysForVault || {
        live: null,
        sma24h: null,
        sma7day: null,
        sma30day: null,
      },
      rewardsApys: rewardsApys.byFleetAddress[params.vaultId.fleetAddress.toSolidityValue()],
      merklRewards: merklRewards.byFleetAddress[params.vaultId.fleetAddress.toSolidityValue()],
      tvlUsd: tvlUsd,
    })
  }

  async getVaultInfoListPerChain(
    params: Parameters<IArmadaManagerVaults['getVaultInfoListPerChain']>[0],
  ): ReturnType<IArmadaManagerVaults['getVaultInfoListPerChain']> {
    const { chainId } = params
    const queryResult = await this._subgraphManager.getVaults({
      chainId,
      clientId: this.getClientIdOrUndefined(),
    })

    const vaultIds = queryResult.vaults.map((vault) =>
      ArmadaVaultId.createFrom({
        chainInfo: getChainInfoByChainId(chainId),
        fleetAddress: Address.createFromEthereum({ value: vault.id }),
      }),
    )

    const [apys, rewardsApys, merklRewards] = await Promise.all([
      this.getVaultsApys({
        chainId,
        vaultIds,
      }),
      this.getVaultsRewardsApys({
        chainId,
        vaultIds,
      }),
      this.getMerklRewardsData({
        chainId,
        vaultIds,
      }),
    ])

    if (!queryResult || !queryResult.vaults) {
      return { list: [] }
    }

    const chainInfo = getChainInfoByChainId(chainId)

    const list = queryResult.vaults.map((rawVault) => {
      const fleetAddress = rawVault.id.toLowerCase()
      const vaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
      })

      if (!rawVault.outputToken) {
        throw new Error(`Vault ${vaultId.toString()} is missing outputToken data`)
      }
      const token = Token.createFrom({
        chainInfo,
        address: Address.createFromEthereum({ value: rawVault.outputToken.id }),
        decimals: rawVault.outputToken.decimals,
        symbol: rawVault.outputToken.symbol,
        name: rawVault.outputToken.name,
      })
      const assetToken = this._tokensManager.getTokenByAddress({
        chainInfo,
        address: Address.createFromEthereum({ value: rawVault.inputToken.id }),
      })
      const depositCap = TokenAmount.createFromBaseUnit({
        token,
        amount: rawVault.depositCap.toString(),
      })

      const apysForVault = apys.byFleetAddress[fleetAddress]

      const totalDepositsRaw = BigInt(rawVault.inputTokenBalance)
      const totalDeposits = TokenAmount.createFromBaseUnit({
        token: assetToken,
        amount: totalDepositsRaw.toString(),
      })
      const totalSharesRaw = BigInt(rawVault.outputTokenSupply)
      const totalShares = TokenAmount.createFromBaseUnit({
        token,
        amount: totalSharesRaw.toString(),
      })

      const sharePrice = Price.createFromAmountsRatio({
        numerator: totalDeposits,
        denominator: totalShares,
      })

      // Calculate tvlUsd from rawVault data or default to 0
      const tvlUsd = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: rawVault.totalValueLockedUSD,
      })

      return ArmadaVaultInfo.createFrom({
        id: vaultId,
        token: token,
        assetToken: assetToken,
        depositCap: depositCap,
        totalDeposits: totalDeposits,
        totalShares: totalShares,
        sharePrice: sharePrice,
        apy: apysForVault?.live || null,
        apys: apysForVault || {
          live: null,
          sma24h: null,
          sma7day: null,
          sma30day: null,
        },
        rewardsApys: rewardsApys.byFleetAddress[fleetAddress],
        merklRewards: merklRewards.byFleetAddress[fleetAddress],
        tvlUsd: tvlUsd,
      })
    })

    return { list }
  }

  async getVaultsApys(
    params: Parameters<IArmadaManagerVaults['getVaultsApys']>[0],
  ): ReturnType<IArmadaManagerVaults['getVaultsApys']> {
    if (params.vaultIds.some((vaultId) => vaultId.chainInfo.chainId !== params.chainId)) {
      throw new Error('ChainId mismatch in vaultIds')
    }

    const input = {
      fleets: params.vaultIds.map((vaultId) => ({
        fleetAddress: vaultId.fleetAddress.value,
        chainId: vaultId.chainInfo.chainId,
      })),
    }

    const res = await fetch(this._functionsUrl + '/api/vault/rates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })
    const jsonData = await res.json()

    // handle res errors
    if (!res.ok) {
      console.error(`Error fetching /api/vault/rates from lambda: ${JSON.stringify(jsonData)}`)
      return { byFleetAddress: {} }
    }

    const data:
      | {
          rates?: Array<{
            chainId: number
            fleetAddress: string
            sma: {
              sma24h: string | null
              sma7d: string | null
              sma30d: string | null
            }
            rates:
              | [
                  {
                    id: string
                    rate: string
                    timestamp: number
                    fleetAddress: string
                  },
                ]
              | []
          }>
        }
      | undefined = jsonData

    const byFleetAddress =
      data?.rates?.reduce(
        (result, rate) => {
          const fleetAddress = rate.fleetAddress
          const latestApy = rate.rates[0]?.rate || null
          const apys = {
            live: latestApy
              ? Percentage.createFrom({
                  value: Number(latestApy),
                })
              : null,
            sma24h: rate.sma.sma24h
              ? Percentage.createFrom({
                  value: Number(rate.sma.sma24h),
                })
              : null,
            sma7day: rate.sma.sma7d
              ? Percentage.createFrom({
                  value: Number(rate.sma.sma7d),
                })
              : null,
            sma30day: rate.sma.sma30d
              ? Percentage.createFrom({
                  value: Number(rate.sma.sma30d),
                })
              : null,
          }
          result[fleetAddress.toLowerCase()] = apys
          return result
        },
        {} as {
          [fleetAddress: string]: VaultApys
        },
      ) || {}

    return { byFleetAddress }
  }

  async getVaultsRewardsApys(
    params: Parameters<IArmadaManagerVaults['getVaultsRewardsApys']>[0],
  ): ReturnType<IArmadaManagerVaults['getVaultsRewardsApys']> {
    // iterate vaultIds and check chainId is matching params.chainId
    if (params.vaultIds.some((vaultId) => vaultId.chainInfo.chainId !== params.chainId)) {
      throw new Error('ChainId mismatch in vaultIds')
    }

    const chainInfo = getChainInfoByChainId(params.chainId)
    const vaultsRaw = await this._subgraphManager.getVaults({
      chainId: params.chainId,
      clientId: this.getClientIdOrUndefined(),
    })

    // get unique reward token symbols
    const rewardTokensSymbolSet = new Set<string>()
    vaultsRaw.vaults.forEach((v) =>
      v.rewardTokens.forEach((rt) => rewardTokensSymbolSet.add(rt.token.symbol)),
    )

    // map each symbol once to a base token
    const rewardTokens = Array.from(rewardTokensSymbolSet).map((symbol) =>
      this._tokensManager.getTokenBySymbol({ chainInfo, symbol }),
    )
    // fetch spot prices for unique base tokens excluding SUMR as it's not available on 1inch
    const baseTokens = rewardTokens.filter((token) => token.symbol !== 'SUMR')
    let prices: { priceByAddress: { [address: string]: IPrice } } = { priceByAddress: {} }
    if (baseTokens.length > 0) {
      prices = await this._oracleManager.getSpotPrices({
        chainInfo,
        baseTokens,
      })
    }

    // override SUMR price in prices as it's not available from 1inch
    const sumrToken = rewardTokens.find((token) => token.symbol === 'SUMR')
    if (sumrToken) {
      // TODO: REMOVE THIS and use oracle in the future
      const sumrPriceUsd = await this._utils.getSummerPrice()

      prices.priceByAddress[sumrToken.address.value.toLowerCase()] = Price.createFrom({
        base: sumrToken,
        quote: FiatCurrency.USD,
        value: sumrPriceUsd.toString(),
      })
    }

    const byFleetAddress = vaultsRaw.vaults.reduce(
      (result, vault) => {
        const {
          rewardTokens,
          rewardTokenEmissionsAmount,
          rewardTokenEmissionsFinish,
          totalValueLockedUSD,
        } = vault
        // Calculate APY for each reward token
        result[vault.id.toLowerCase()] = rewardTokens.map((token, index) => {
          // if emission finish is in the past, skip
          const timestampInSeconds = Math.floor(Date.now() / 1000)
          const rewardToken = this._tokensManager.getTokenBySymbol({
            chainInfo,
            symbol: token.token.symbol,
          })

          if (Number(rewardTokenEmissionsFinish[index]) < timestampInSeconds) {
            return {
              token: rewardToken,
              apy: Percentage.createFrom({ value: 0 }),
            }
          }

          const dailyTokenEmissionAmount = new BigNumber(
            rewardTokenEmissionsAmount[index].toString(),
          )
            // 18 is coming form the bug in contract increasing denomination by Constants.WAD
            .div(new BigNumber(10).pow(18 + token.token.decimals))
            .times(100) // why 36 and not decimals
            .toString()
          // Use token price if available, otherwise fallback to default for SUMR
          const tokenPriceUsd = prices.priceByAddress[token.token.id.toLowerCase()]
            .toBigNumber()
            .toString()

          return {
            token: rewardToken,
            apy: calculateRewardApy({
              dailyTokenEmissionAmount,
              tokenPriceUsd,
              tvlUsd: totalValueLockedUSD,
            }),
          }
        })
        return result
      },
      {} as {
        [fleetAddress: string]: {
          token: IToken
          apy: IPercentage | null
        }[]
      },
    )

    return {
      byFleetAddress,
    }
  }

  async getMerklRewardsData(
    params: Parameters<IArmadaManagerVaults['getMerklRewardsData']>[0],
  ): ReturnType<IArmadaManagerVaults['getMerklRewardsData']> {
    const { chainId, vaultIds } = params
    // get vaults data by creating promises list and executing with promise all
    const vaultsData = await Promise.all(
      vaultIds.map((vaultId) =>
        this._subgraphManager.getVault({
          chainId: params.chainId,
          vaultId: vaultId.fleetAddress.value,
        }),
      ),
    )
    // get rewards manager addresses of the provided vaults
    const rewardsManagerAddresses = vaultsData.map((vault) => {
      if (vault.vault && 'rewardsManager' in vault.vault) {
        return vault.vault.rewardsManager.id
      } else {
        return undefined
      }
    })

    // find opportunities by querying merkl api using rewards manager address as id
    const url = `https://api.merkl.xyz/v4/opportunities?identifier={{identifier}}&chainId=${chainId}`
    const opportunitiesPerVault: (MerklApiOpportunitiesResponse | undefined)[] = await Promise.all(
      rewardsManagerAddresses.map((address) =>
        address
          ? fetchWithTimeout(url.replace('{{identifier}}', address))
              .then((res) => (res.ok ? res.json() : undefined))
              .catch(() => undefined)
          : Promise.resolve(undefined),
      ),
    )

    const sumrToken = this._tokensManager.getTokenBySymbol({
      chainInfo: getChainInfoByChainId(params.chainId),
      symbol: 'SUMR',
    })

    // this is not used as temp fallback is enabled
    const byFleetAddress: {
      [fleetAddress: string]:
        | {
            token: IToken
            dailyEmission: string
          }[]
        | undefined
    } = opportunitiesPerVault.reduce(
      (acc, opportunities, index) => {
        const fleetAddress = vaultIds[index].fleetAddress.value.toLowerCase()
        if (opportunities == null) {
          return acc
        }
        if (!acc[fleetAddress]) {
          acc[fleetAddress] = []
        }
        acc[fleetAddress].push({
          dailyEmission: opportunities
            .reduce((dailyEmission, opportunity) => {
              // check opportunity is live
              if (opportunity.status !== 'LIVE') {
                return dailyEmission
              }
              const sumrReward = opportunity.rewardsRecord.breakdowns.find(
                (b) => b.token.symbol === 'SUMR',
              )
              if (sumrReward) {
                try {
                  dailyEmission += BigInt(sumrReward.amount)
                } catch (error) {
                  console.error('Error parsing SUMR reward amount:', error)
                }
              }
              return dailyEmission
            }, 0n)
            .toString(),
          token: sumrToken,
        })
        return acc
      },
      {} as {
        [fleetAddress: string]:
          | {
              token: IToken
              dailyEmission: string
            }[]
          | undefined
      },
    )

    return {
      byFleetAddress: getByFleetAddressFallback(chainId, sumrToken),
    }
  }

  async getProtocolRevenue(): ReturnType<IArmadaManagerVaults['getProtocolRevenue']> {
    // Get vaults info list on all chains by creating a promise array
    const vaultsPromises = Object.values(ChainIds).map((chainId) =>
      this.getVaultInfoListPerChain({ chainId }),
    )
    const vaults = await (await Promise.all(vaultsPromises)).flatMap((res) => res.list)

    // Calculate revenue for each vault based on token symbol
    // WETH vaults: 0.3% of TVL
    // Non-WETH vaults: 1% of TVL
    const debugLog: Array<{
      tvlAmount: number
      isWETH: boolean
      symbol: string
      revenuePercentage: number
      vaultRevenue: number
    }> = []
    const revenueAmount = vaults.reduce((acc, vault) => {
      const tvlAmount = parseFloat(vault.tvlUsd.amount)
      const isWETH = vault.assetToken.symbol === 'WETH'
      const revenuePercentage = isWETH ? 0.003 : 0.01
      const vaultRevenue = tvlAmount * revenuePercentage
      debugLog.push({
        tvlAmount,
        isWETH,
        symbol: vault.assetToken.symbol,
        revenuePercentage,
        vaultRevenue,
      })
      return acc + vaultRevenue
    }, 0)

    LoggingService.log('Vault Revenue Calculation', JSON.stringify(debugLog, null, 2))

    return revenueAmount
  }

  /** @see IArmadaManagerVaults.getProtocolTvl */
  async getProtocolTvl(): ReturnType<IArmadaManagerVaults['getProtocolTvl']> {
    // Get vaults info list on all chains by creating a promise array
    const vaultsPromises = Object.values(ChainIds).map((chainId) =>
      this.getVaultInfoListPerChain({ chainId }),
    )
    const vaults = await (await Promise.all(vaultsPromises)).flatMap((res) => res.list)

    // Calculate total TVL by summing tvlUsd.amount for all active vaults
    const totalTvl = vaults.reduce((acc, vault) => {
      const tvlAmount = parseFloat(vault.tvlUsd.amount)
      return acc + tvlAmount
    }, 0)

    return totalTvl
  }

  /**
   * Internal utility method to generate a cross-chain deposit TX using Enso
   *
   * @param fromChainId The source chain ID
   * @param vaultId The vault for which the deposit is being made
   * @param user The user making the deposit
   * @param amount The amount being deposited
   * @param slippage Maximum slippage tolerance in basis points
   * @param shouldStake Whether to stake after deposit
   *
   * @returns The transactions needed to deposit the tokens cross-chain
   */
  private async _getCrossChainDepositTx(params: {
    fromChainId: ChainId
    vaultId: IArmadaVaultId
    senderAddressValue: AddressValue
    receiverAddressValue?: AddressValue
    amount: ITokenAmount
    slippage: IPercentage
  }): ReturnType<IArmadaManagerVaults['getCrossChainDepositTx']> {
    const sourceChainId = params.fromChainId
    const destinationChainId = params.vaultId.chainInfo.chainId
    const senderAddressValue = params.senderAddressValue
    const receiverAddressValue = params.receiverAddressValue ?? params.senderAddressValue

    // Get source and destination tokens
    const sourceToken = params.amount.token
    const tokenInSymbol = sourceToken.symbol
    const tokenInAddress = sourceToken.address.toSolidityValue()
    const amountIn = params.amount

    // Get the fleet asset token on destination chain
    const fleetCommander = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })
    const [tokenOut] = await Promise.all([fleetCommander.asErc20().getToken()])
    const tokenOutAddress = tokenOut.address.toSolidityValue()

    // Convert slippage from percentage to basis points
    const slippageBps = Math.floor(parseFloat(params.slippage.value.toString()) * 100)

    const routeParams: RouteParams = {
      fromAddress: senderAddressValue,
      receiver: receiverAddressValue,
      chainId: sourceChainId,
      amountIn: [amountIn.toSolidityValue().toString()],
      tokenIn: [tokenInAddress],
      destinationChainId: destinationChainId,
      tokenOut: [tokenOutAddress],
      slippage: slippageBps,
      routingStrategy: 'router',
    }

    // Build Enso bundle actions
    const routeData = await EnsoClient.getClient().getRouteData(routeParams)

    const tokenOutAmount = routeData.amountOut

    const amountOut = TokenAmount.createFromBaseUnit({
      token: tokenOut,
      amount: tokenOutAmount.toString(),
    })
    const priceImpact: TransactionPriceImpact = {
      impact: Percentage.createFrom({
        value: parseFloat(routeData.priceImpact?.toString() || '0') / 100,
      }),
      price: Price.createFromAmountsRatio({
        numerator: amountIn,
        denominator: amountOut,
      }),
    }

    const isNative = tokenInAddress === NATIVE_CURRENCY_ADDRESS_LOWERCASE

    LoggingService.debug('Cross-chain deposit Enso bundle data', {
      isNative,
      sourceChainId,
      from: tokenInSymbol,
      fromAddress: tokenInAddress,
      fromAmount: amountIn.toString(),
      destinationChainId,
      to: tokenOut.symbol,
      toAddress: tokenOutAddress,
      toAmount: amountOut.toString(),
      priceImpact: {
        rawPriceImpact: routeData.priceImpact?.toString(),
        impact: priceImpact.impact?.toString(),
        price: priceImpact.price?.toString(),
      },
    })

    // Create deposit transaction from Enso data
    const depositTransaction = createDepositTransaction({
      target: Address.createFromEthereum({ value: routeData.tx.to }),
      calldata: routeData.tx.data as HexData,
      description: `Cross-chain deposit from ${sourceChainId} to ${destinationChainId}`,
      value: BigInt(routeData.tx.value.toString()),
      metadata: {
        fromAmount: amountIn,
        toAmount: amountOut,
        slippage: params.slippage,
        priceImpact: priceImpact,
      },
    })

    // Check if approval is needed
    let approveTransaction: ApproveTransactionInfo | undefined
    if (!isNative) {
      approveTransaction = await this._allowanceManager.getApproval({
        chainInfo: getChainInfoByChainId(sourceChainId),
        spender: Address.createFromEthereum({ value: routeData.tx.to }),
        amount: amountIn,
        owner: Address.createFromEthereum({ value: senderAddressValue }),
      })
    }

    const transactions:
      | [DepositTransactionInfo]
      | [ApproveTransactionInfo, DepositTransactionInfo] = approveTransaction
      ? [approveTransaction, depositTransaction]
      : [depositTransaction]

    LoggingService.debug('Cross-chain deposit transactions', {
      transactions: transactions.map(({ description, type, transaction }) => ({
        description,
        type,
        transactionValue: transaction.value,
      })),
    })

    return transactions
  }

  /**
   * Internal utility method to generate a cross-chain withdraw TX using Enso
   *
   * @param vaultId The vault from which to withdraw
   * @param user The user making the withdrawal
   * @param amount The amount being withdrawn
   * @param slippage Maximum slippage tolerance in basis points
   * @param toChainId The destination chain ID
   *
   * @returns The transactions needed to withdraw the tokens cross-chain
   */
  private async _getCrossChainWithdrawTx(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    toChainId: ChainId
  }): ReturnType<IArmadaManagerVaults['getCrossChainWithdrawTx']> {
    const sourceChainId = params.vaultId.chainInfo.chainId
    const destinationChainId = params.toChainId
    const senderAddress = params.user.wallet.address.value
    const fleetAddress = params.vaultId.fleetAddress.value

    // Get the fleet asset token on source chain
    const fleetCommander = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.vaultId.chainInfo,
      address: params.vaultId.fleetAddress,
    })
    const assetToken = await fleetCommander.asErc4626().asset()
    const assetTokenSymbol = assetToken.symbol

    // Get destination token (for now, assume same asset on destination chain)
    const destinationChainInfo = getChainInfoByChainId(destinationChainId)
    const destinationToken = this._tokensManager.getTokenBySymbol({
      chainInfo: destinationChainInfo,
      symbol: assetTokenSymbol,
    })

    // Convert slippage from percentage to basis points
    const slippageBps = Math.floor(parseFloat(params.slippage.value.toString()) * 100)

    const isNative =
      destinationToken.address.value.toLowerCase() === NATIVE_CURRENCY_ADDRESS_LOWERCASE

    // Build Enso bundle actions for withdraw + bridge
    const actions: BundleAction[] = [
      // Withdraw from vault (using redeem action)
      {
        protocol: 'summer-fi',
        action: 'redeem',
        args: {
          tokenIn: fleetAddress,
          tokenOut: assetToken.address.value,
          amountIn: params.amount.toSolidityValue().toString(),
          primaryAddress: fleetAddress,
        },
      },
      // Swap to native for bridging
      {
        protocol: 'enso',
        action: 'route',
        args: {
          tokenIn: assetToken.address.value,
          amountIn: { useOutputOfCallAt: 0 },
          tokenOut: NATIVE_CURRENCY_ADDRESS_LOWERCASE,
          slippage: slippageBps,
        },
      },
      // Bridge to destination chain
      {
        protocol: 'stargate',
        action: 'bridge',
        args: {
          primaryAddress: '0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7', // Stargate router
          destinationChainId: destinationChainId,
          tokenIn: NATIVE_CURRENCY_ADDRESS_LOWERCASE,
          amountIn: { useOutputOfCallAt: 1 },
          receiver: senderAddress,
          callback: isNative
            ? []
            : [
                {
                  protocol: 'enso',
                  action: 'route',
                  args: {
                    tokenIn: NATIVE_CURRENCY_ADDRESS_LOWERCASE,
                    amountIn: { useOutputOfCallAt: 0 },
                    tokenOut: destinationToken.address.value,
                    slippage: slippageBps,
                  },
                },
              ],
        },
      },
    ]

    // Get bundle data from Enso
    const ensoBundleData = await EnsoClient.getBundleData(
      {
        chainId: sourceChainId,
        fromAddress: senderAddress,
        spender: senderAddress,
        routingStrategy: 'router',
      },
      actions,
    )

    const destinationTokenAmount =
      ensoBundleData.amountsOut[destinationToken.address.toSolidityValue()]
    const toAmount = TokenAmount.createFromBaseUnit({
      token: destinationToken,
      amount: destinationTokenAmount.toString(),
    })
    const priceImpact: TransactionPriceImpact = {
      impact: Percentage.createFrom({ value: 0 }),
      price: Price.createFromAmountsRatio({
        numerator: params.amount,
        denominator: toAmount,
      }),
    }

    LoggingService.debug('Cross-chain withdraw Enso bundle data', {
      from: assetTokenSymbol,
      to: destinationToken.symbol,
      sourceChainId,
      destinationChainId,
      amount: params.amount.toString(),
    })

    // Create withdraw transaction from Enso data
    const withdrawTransaction = createWithdrawTransaction({
      target: Address.createFromEthereum({ value: ensoBundleData.tx.to }),
      calldata: ensoBundleData.tx.data as HexData,
      description: `Cross-chain withdraw from ${sourceChainId} to ${destinationChainId}`,
      metadata: {
        fromAmount: params.amount,
        toAmount: toAmount,
        slippage: params.slippage,
        priceImpact: priceImpact,
      },
    })

    // Check if approval is needed for the fleet token
    const approveTransaction = await this._allowanceManager.getApproval({
      chainInfo: params.vaultId.chainInfo,
      spender: Address.createFromEthereum({ value: ensoBundleData.tx.to }),
      amount: params.amount,
      owner: params.user.wallet.address,
    })

    const transactions:
      | [WithdrawTransactionInfo]
      | [ApproveTransactionInfo, WithdrawTransactionInfo] = approveTransaction
      ? [approveTransaction, withdrawTransaction]
      : [withdrawTransaction]

    LoggingService.debug('Cross-chain withdraw transactions', {
      transactions: transactions.map(({ description, type, transaction }) => ({
        description,
        type,
        transactionValue: transaction.value,
      })),
    })

    return transactions
  }
}
