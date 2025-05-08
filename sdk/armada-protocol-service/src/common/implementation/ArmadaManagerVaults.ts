import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import {
  IArmadaManagerVaults,
  createDepositTransaction,
  createWithdrawTransaction,
  getDeployedContractAddress,
  type IArmadaManagerUtils,
  createVaultSwitchTransaction,
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
} from '@summerfi/sdk-common'
import type { ISwapManager } from '@summerfi/swap-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import { encodeFunctionData } from 'viem'
import { BigNumber } from 'bignumber.js'

export class ArmadaManagerVaults implements IArmadaManagerVaults {
  private _supportedChains: IChainInfo[]
  private _blockchainClientProvider: IBlockchainClientProvider
  private _configProvider: IConfigurationProvider
  private _tokensManager: ITokensManager
  private _allowanceManager: IAllowanceManager
  private _oracleManager: IOracleManager
  private _contractsProvider: IContractsProvider
  private _swapManager: ISwapManager
  private _utils: IArmadaManagerUtils

  constructor(params: {
    supportedChains: IChainInfo[]
    blockchainClientProvider: IBlockchainClientProvider
    configProvider: IConfigurationProvider
    tokensManager: ITokensManager
    allowanceManager: IAllowanceManager
    oracleManager: IOracleManager
    contractsProvider: IContractsProvider
    swapManager: ISwapManager
    utils: IArmadaManagerUtils
  }) {
    this._supportedChains = params.supportedChains
    this._blockchainClientProvider = params.blockchainClientProvider
    this._configProvider = params.configProvider
    this._tokensManager = params.tokensManager
    this._allowanceManager = params.allowanceManager
    this._oracleManager = params.oracleManager
    this._contractsProvider = params.contractsProvider
    this._swapManager = params.swapManager
    this._utils = params.utils
  }

  /**
   * @see IArmadaManagerVaults.getNewDepositTx
   */
  async getNewDepositTx(
    params: Parameters<IArmadaManagerVaults['getNewDepositTx']>[0],
  ): ReturnType<IArmadaManagerVaults['getNewDepositTx']> {
    return this._getDepositTX(params)
  }

  async getUpdateDepositTX(
    params: Parameters<IArmadaManagerVaults['getUpdateDepositTX']>[0],
  ): ReturnType<IArmadaManagerVaults['getUpdateDepositTX']> {
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
    return this._getWithdrawTX(params)
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

    let swapToAmount: ITokenAmount | undefined = undefined
    let transactions: Awaited<ReturnType<IArmadaManagerVaults['getVaultSwitchTx']>>

    const [beforeFleetShares, beforeStakedShares, calculatedSharesToWithdraw] = await Promise.all([
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
      withdrawAmount: withdrawAmount.toString(),
      calculatedSharesToWithdraw: calculatedSharesToWithdraw.toString(),
      shouldSwap,
      sourceFleetToken: sourceFleetToken.toString(),
      destinationFleetToken: destinationFleetToken.toString(),
    })

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: params.sourceVaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    let approvalForWithdraw: ApproveTransactionInfo | undefined
    let approvalForDeposit: ApproveTransactionInfo | undefined

    // Deposit logic
    const shouldStake = params.shouldStake ?? true
    // should compensate the tip during withdrawal
    const depositAmount = this._compensateAmount(withdrawAmount, 'decrease')

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

    // Withdraw logic

    // Are fleetShares available at all? (should be greater than dust)
    if (beforeFleetShares.toSolidityValue() > 0) {
      // Yes. Are fleetShares sufficient to meet the calculatedWithdrawShares?
      if (beforeFleetShares.toSolidityValue() >= calculatedSharesToWithdraw.toSolidityValue()) {
        // Yes. Withdraw all from fleetShares
        LoggingService.debug('>>> fleet shares is enough for requested amount')

        // Approve the requested amount in shares
        const [
          approvalToTakeSharesOnBehalf,
          approvalToDepositAsset,
          exitWithdrawMulticall,
          priceImpact,
        ] = await Promise.all([
          this._allowanceManager.getApproval({
            chainInfo: params.sourceVaultId.chainInfo,
            spender: admiralsQuartersAddress,
            amount: calculatedSharesToWithdraw,
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
            amount: withdrawAmount,
            withdrawToken: withdrawAmount.token,
            shouldSwap: false, //override as we do swap in deposit
            toEth: false,
          }),
          swapToAmount &&
            this._utils.getPriceImpact({
              fromAmount: withdrawAmount,
              toAmount: swapToAmount,
            }),
        ])

        if (approvalToTakeSharesOnBehalf) {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            spender: approvalToTakeSharesOnBehalf.metadata.approvalSpender.toString(),
            approved: approvalToTakeSharesOnBehalf.metadata.approvalAmount.toString(),
          })
        } else {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            message: 'No approval needed',
          })
        }

        approvalForWithdraw = approvalToTakeSharesOnBehalf
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
            toAmount: swapToAmount,
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
        // No. Withdraw all from fleetShares and the reminder from stakedShares
        LoggingService.debug('>>> fleet shares is not enough')
        throw new Error('Not implemented yet')
      }
    } else {
      // No. Unstake and withdraw everything from stakedShares.
      LoggingService.debug('>>> fleet shares is 0, take all from staked shares')

      const unstakeWithdrawMulticallArgs: HexData[] = []
      const unstakeWithdrawMulticallOperations: string[] = []

      const withdrawalData = await this._calculateWithdrawalDataForStakedShares({
        vaultId: params.sourceVaultId,
        shares: calculatedSharesToWithdraw,
        stakedShares: beforeStakedShares,
        amount: withdrawAmount,
      })

      // withdraw all from staked tokens
      const [unstakeAndWithdrawCall, priceImpact] = await Promise.all([
        this._getUnstakeAndWithdrawCall({
          vaultId: params.sourceVaultId,
          sharesValue: withdrawalData.unstakeWithdrawSharesAmount,
        }),
        swapToAmount &&
          this._utils.getPriceImpact({
            fromAmount: withdrawAmount,
            toAmount: swapToAmount,
          }),
      ])
      unstakeWithdrawMulticallArgs.push(unstakeAndWithdrawCall.calldata)
      unstakeWithdrawMulticallOperations.push(
        'unstakeAndWithdraw ' + withdrawalData.unstakeWithdrawSharesAmount,
      )
      approvalForDeposit = await this._getApprovalBasedOnWithdrawalData({
        admiralsQuartersAddress,
        vaultId: params.sourceVaultId,
        user: params.user,
        amount: withdrawalData.approvedDepositAmount,
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
          toAmount: swapToAmount,
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
    const shouldStake = params.shouldStake ?? true

    let swapToAmount: ITokenAmount | undefined

    LoggingService.debug('getDepositTx', {
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
    const depositTransaction = createDepositTransaction({
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
  }): ReturnType<IArmadaManagerVaults['getWithdrawTx']> {
    const withdrawAmount = params.amount
    const toEth = params.toToken.symbol === 'ETH'
    const swapToToken = params.toToken
    const shouldSwap = !swapToToken.equals(withdrawAmount.token)

    // let swapMinAmount: ITokenAmount | undefined
    let swapToAmount: ITokenAmount | undefined = undefined
    let transactions:
      | [WithdrawTransactionInfo]
      | [ApproveTransactionInfo, WithdrawTransactionInfo]
      | [WithdrawTransactionInfo, WithdrawTransactionInfo]
      | [ApproveTransactionInfo, WithdrawTransactionInfo, WithdrawTransactionInfo]

    const [beforeFleetShares, beforeStakedShares, calculatedSharesToWithdraw] = await Promise.all([
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
      calculatedSharesToWithdraw: calculatedSharesToWithdraw.toString(),
      toEth: toEth,
      swapToToken: swapToToken.toString(),
      shouldSwap,
    })

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: params.vaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    // Are fleetShares available at all? (should be greater than dust)
    if (beforeFleetShares.toSolidityValue() > 0) {
      // Yes. Are fleetShares sufficient to meet the calculatedWithdrawShares?
      if (beforeFleetShares.toSolidityValue() >= calculatedSharesToWithdraw.toSolidityValue()) {
        // Yes. Withdraw all from fleetShares
        LoggingService.debug('>>> fleet shares is enough for requested amount')

        // TODO: when withdraw from fleetShares and no swap, we can skip approval and multicall and withdraw directly from fleet

        // Approve the requested amount in shares
        const [approvalToTakeSharesOnBehalf, exitWithdrawMulticall, priceImpact] =
          await Promise.all([
            this._allowanceManager.getApproval({
              chainInfo: params.vaultId.chainInfo,
              spender: admiralsQuartersAddress,
              amount: calculatedSharesToWithdraw,
              owner: params.user.wallet.address,
            }),
            this._getExitWithdrawMulticall({
              vaultId: params.vaultId,
              slippage: params.slippage,
              amount: withdrawAmount,
              // if withdraw is WETH and unwrapping to ETH,
              // we need to withdraw WETH for later deposit & unwrap operation
              withdrawToken:
                withdrawAmount.token.symbol === 'WETH' && toEth
                  ? withdrawAmount.token
                  : swapToToken,
              shouldSwap,
              toEth,
            }),
            swapToAmount &&
              this._utils.getPriceImpact({
                fromAmount: withdrawAmount,
                toAmount: swapToAmount,
              }),
          ])

        if (approvalToTakeSharesOnBehalf) {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            spender: approvalToTakeSharesOnBehalf.metadata.approvalSpender.toString(),
            approved: approvalToTakeSharesOnBehalf.metadata.approvalAmount.toString(),
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
            toAmount: swapToAmount,
            slippage: params.slippage,
            priceImpact,
          },
        })
        if (approvalToTakeSharesOnBehalf) {
          transactions = [approvalToTakeSharesOnBehalf, withdrawTransaction]
        } else {
          transactions = [withdrawTransaction]
        }
      } else {
        // No. Withdraw all from fleetShares and the reminder from stakedShares
        LoggingService.debug('>>> fleet shares is not enough')

        const [approveToTakeSharesOnBehalf, calculatedUnstakedAssets] = await Promise.all([
          this._allowanceManager.getApproval({
            chainInfo: params.vaultId.chainInfo,
            spender: admiralsQuartersAddress,
            amount: beforeFleetShares,
            owner: params.user.wallet.address,
          }),
          this._previewRedeem({
            vaultId: params.vaultId,
            shares: beforeFleetShares,
          }),
        ])

        LoggingService.debug('- first take all fleet shares', {
          beforeFleetShares: beforeFleetShares.toString(),
          calculatedUnstakedAssets: calculatedUnstakedAssets.toString(),
        })

        if (approveToTakeSharesOnBehalf) {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            spender: approveToTakeSharesOnBehalf.metadata.approvalSpender.toString(),
            approved: approveToTakeSharesOnBehalf.metadata.approvalAmount.toString(),
          })
        } else {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            message: 'No approval needed',
          })
        }

        const multicallArgs: HexData[] = []
        const multicallOperations: string[] = []
        const unstakeWithdrawMulticallArgs: HexData[] = []
        const unstakeWithdrawMulticallOperations: string[] = []

        const reminderShares = calculatedSharesToWithdraw.subtract(beforeFleetShares)
        LoggingService.debug('- then reminder from staked shares', {
          reminderShares: reminderShares.toString(),
        })

        const withdrawalData = await this._calculateWithdrawalDataForStakedShares({
          vaultId: params.vaultId,
          shares: reminderShares,
          stakedShares: beforeStakedShares,
          amount: withdrawAmount,
        })

        const [exitWithdrawMulticall, unstakeAndWithdrawCall, priceImpact] = await Promise.all([
          this._getExitWithdrawMulticall({
            vaultId: params.vaultId,
            slippage: params.slippage,
            amount: calculatedUnstakedAssets,
            exitAll: true,
            // if withdraw is WETH and unwrapping to ETH,
            // we need to withdraw WETH for later deposit & unwrap operation
            withdrawToken:
              calculatedUnstakedAssets.token.symbol === 'WETH' && toEth
                ? calculatedUnstakedAssets.token
                : swapToToken,
            shouldSwap,
            toEth,
          }),
          this._getUnstakeAndWithdrawCall({
            vaultId: params.vaultId,
            sharesValue: withdrawalData.unstakeWithdrawSharesAmount,
          }),
          swapToAmount &&
            this._utils.getPriceImpact({
              fromAmount: withdrawAmount,
              toAmount: swapToAmount,
            }),
        ])

        multicallArgs.push(...exitWithdrawMulticall.multicallArgs)
        multicallOperations.push(...exitWithdrawMulticall.multicallOperations)

        unstakeWithdrawMulticallArgs.push(unstakeAndWithdrawCall.calldata)
        unstakeWithdrawMulticallOperations.push(
          'unstakeAndWithdraw ' + withdrawalData.unstakeWithdrawSharesAmount,
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
          unstakeWithdrawMulticallOperations.push(
            ...depositSwapWithdrawMulticall.multicallOperations,
          )
          swapToAmount = depositSwapWithdrawMulticall.toAmount
        }

        // compose multicall
        const multicallCalldata = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [[...multicallArgs, ...unstakeWithdrawMulticallArgs]],
        })
        const withdrawTransaction = createWithdrawTransaction({
          target: admiralsQuartersAddress,
          calldata: multicallCalldata,
          description:
            'Withdraw Operations: ' +
            multicallOperations.concat(unstakeWithdrawMulticallOperations).join(', '),
          metadata: {
            fromAmount: withdrawAmount,
            toAmount: swapToAmount,
            slippage: params.slippage,
            priceImpact,
          },
        })

        const unstakeAndWithdrawCalldata = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [unstakeWithdrawMulticallArgs],
        })
        const unstakeAndWithdrawTransaction = createWithdrawTransaction({
          target: admiralsQuartersAddress,
          calldata: unstakeAndWithdrawCalldata,
          description: 'Unstake and withdraw: ' + unstakeWithdrawMulticallOperations.join(', '),
          metadata: {
            fromAmount: withdrawAmount,
            toAmount: swapToAmount,
            slippage: params.slippage,
            priceImpact,
          },
        })
        if (approveToTakeSharesOnBehalf) {
          transactions = [
            approveToTakeSharesOnBehalf,
            withdrawTransaction,
            unstakeAndWithdrawTransaction,
          ]
        } else {
          transactions = [withdrawTransaction, unstakeAndWithdrawTransaction]
        }
      }
    } else {
      // No. Unstake and withdraw everything from stakedShares.
      LoggingService.debug('>>> fleet shares is 0, take all from staked shares')

      const unstakeWithdrawMulticallArgs: HexData[] = []
      const unstakeWithdrawMulticallOperations: string[] = []

      const withdrawalData = await this._calculateWithdrawalDataForStakedShares({
        vaultId: params.vaultId,
        shares: calculatedSharesToWithdraw,
        stakedShares: beforeStakedShares,
        amount: withdrawAmount,
      })

      // withdraw all from staked tokens
      const [unstakeAndWithdrawCall, priceImpact] = await Promise.all([
        this._getUnstakeAndWithdrawCall({
          vaultId: params.vaultId,
          sharesValue: withdrawalData.unstakeWithdrawSharesAmount,
        }),
        swapToAmount &&
          this._utils.getPriceImpact({
            fromAmount: withdrawAmount,
            toAmount: swapToAmount,
          }),
      ])
      unstakeWithdrawMulticallArgs.push(unstakeAndWithdrawCall.calldata)
      unstakeWithdrawMulticallOperations.push(
        'unstakeAndWithdraw ' + withdrawalData.unstakeWithdrawSharesAmount,
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
          toAmount: swapToAmount,
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
      swapCall = await this._utils.getSwapCall({
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
    multicallOperations.push('exitFleet ' + fromAmount.token.toString() + ' (all)')

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
    multicallOperations.push('withdrawTokens' + withdrawAll.token.toString() + ' (all)')

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
        throw new Error(`Invalid direction: ${direction}. Must be 'up' or 'down'.`)
    }

    return TokenAmount.createFromBaseUnit({
      token: amount.token,
      amount: new BigNumber(amount.toSolidityValue().toString())
        .times(multiplier)
        .toFixed(0, BigNumber.ROUND_DOWN),
    })
  }

  private async _calculateWithdrawalDataForStakedShares(params: {
    vaultId: IArmadaVaultId
    amount: ITokenAmount
    shares: ITokenAmount
    stakedShares: ITokenAmount
  }): Promise<{
    shouldWithdrawAll: boolean
    approvedDepositAmount: ITokenAmount
    unstakeWithdrawSharesAmount: bigint
  }> {
    // if the requested amount is close to all staked shares, we make assumption to withdraw all
    // withdraw all assumption threshold is set to 0.9999
    const withdrawAllThreshold = 0.9999

    const shouldWithdrawAll = new BigNumber(params.shares.toSolidityValue().toString())
      .div(params.stakedShares.toSolidityValue().toString())
      .gte(withdrawAllThreshold)
    const unstakeWithdrawSharesAmount = shouldWithdrawAll ? 0n : params.shares.toSolidityValue()

    let approvedDepositAmount: ITokenAmount | undefined
    if (shouldWithdrawAll) {
      // if we are withdrawing all, we need to calculate full amount
      const calculatedFullAmount = await this._previewRedeem({
        vaultId: params.vaultId,
        shares: params.shares,
      })

      approvedDepositAmount = calculatedFullAmount
      // approvedDepositAmount = this._compensateAmount(calculatedFullAmount, 'increase')
    } else {
      // if we are not withdrawing all, we need to approve the transfer amount
      approvedDepositAmount = params.amount
    }

    LoggingService.debug('_calculateWithdrawalDataForStakedShares', {
      shouldWithdrawAll,
      unstakeWithdrawSharesAmount: unstakeWithdrawSharesAmount.toString(),
      transferAmount: params.amount.toString(),
      approvedDepositAmount: approvedDepositAmount.toString(),
    })

    return {
      shouldWithdrawAll,
      approvedDepositAmount,
      unstakeWithdrawSharesAmount,
    }
  }

  private async _getApprovalBasedOnWithdrawalData(params: {
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
}
