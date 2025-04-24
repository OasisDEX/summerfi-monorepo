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
  Address,
  type DepositTransactionInfo,
  type ApproveTransactionInfo,
  type WithdrawTransactionInfo,
  type VaultSwitchTransactionInfo,
} from '@summerfi/sdk-common'
import type { ISwapManager } from '@summerfi/swap-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import { encodeFunctionData } from 'viem'
import BigNumber from 'bignumber.js'

// Define a small dust threshold for share amounts (e.g., $0.01)
// This helps decide if fleet shares are negligible
const fleetDustThreshold = 10n

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
   * @see IArmadaManagerVaults.getNewDepositTX
   */
  async getNewDepositTX(
    params: Parameters<IArmadaManagerVaults['getNewDepositTX']>[0],
  ): ReturnType<IArmadaManagerVaults['getNewDepositTX']> {
    return this._getDepositTX(params)
  }

  async getUpdateDepositTX(
    params: Parameters<IArmadaManagerVaults['getUpdateDepositTX']>[0],
  ): ReturnType<IArmadaManagerVaults['getUpdateDepositTX']> {
    // Call getNewDepositTX with user from positionId
    return this.getNewDepositTX({
      vaultId: params.vaultId,
      user: params.positionId.user,
      amount: params.amount,
      slippage: params.slippage,
      shouldStake: params.shouldStake,
    })
  }

  /**
   * @see IArmadaManagerVaults.getWithdrawTX
   */
  async getWithdrawTX(
    params: Parameters<IArmadaManagerVaults['getWithdrawTX']>[0],
  ): ReturnType<IArmadaManagerVaults['getWithdrawTX']> {
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
    const transferAmount = params.amount

    const sourceFleet = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.sourceVaultId.chainInfo,
      address: params.sourceVaultId.fleetAddress,
    })
    const sourceFleetToken = await sourceFleet.asErc4626().asset()
    // source token must be the same as the amount
    if (!sourceFleetToken.address.equals(transferAmount.token.address)) {
      throw new Error('Source fleet token must be the same as the amount token')
    }
    const fromEth = sourceFleetToken.symbol === 'ETH'

    const destinationFleet = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.destinationVaultId.chainInfo,
      address: params.destinationVaultId.fleetAddress,
    })
    const destinationFleetToken = await destinationFleet.asErc4626().asset()
    const toEth = destinationFleetToken.symbol === 'ETH'

    const shouldSwap = !destinationFleetToken.equals(sourceFleetToken)

    let swapToAmount: ITokenAmount | undefined
    let transactions:
      | [VaultSwitchTransactionInfo]
      | [ApproveTransactionInfo, VaultSwitchTransactionInfo]
      | [VaultSwitchTransactionInfo, VaultSwitchTransactionInfo]
      | [ApproveTransactionInfo, VaultSwitchTransactionInfo, VaultSwitchTransactionInfo]

    const [beforeFleetShares, beforeStakedShares, requestedWithdrawShares] = await Promise.all([
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
        assets: transferAmount,
      }),
    ])

    LoggingService.debug('getVaultSwitchTx', {
      sourceVaultId: params.sourceVaultId.fleetAddress.value,
      destinationVaultId: params.destinationVaultId.fleetAddress.value,
      beforeFleetShares: beforeFleetShares.toString(),
      beforeStakedShares: beforeStakedShares.toString(),
      requestedWithdrawShares: requestedWithdrawShares.toString(),
      sourceFleetToken,
      destinationFleetToken,
      fromEth,
      toEth,
      shouldSwap,
    })

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: params.sourceVaultId.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    let approveTransaction: ApproveTransactionInfo | undefined

    // Deposit logic
    const shouldStake = params.shouldStake ?? true

    const depositMulticallArgs: HexData[] = []
    const depositMulticallOperations: string[] = []
    const depositTokensCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'depositTokens',
      args: [transferAmount.token.address.value, transferAmount.toSolidityValue()],
    })
    depositMulticallArgs.push(depositTokensCalldata)
    depositMulticallOperations.push('depositTokens ' + transferAmount.toString())
    // If depositing a token that is not the fleet token,
    // we need to swap it to fleet asset
    if (shouldSwap) {
      const swapCall = await this._utils.getSwapCall({
        vaultId: params.sourceVaultId,
        fromAmount: transferAmount,
        toToken: destinationFleetToken,
        slippage: params.slippage,
      })
      depositMulticallArgs.push(swapCall.calldata)
      depositMulticallOperations.push(
        `swap ${transferAmount.toString()} to min ${swapCall.minAmount.toString()}`,
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
      // Yes. Are fleetShares sufficient to meet the requestedWithdrawShares?
      if (beforeFleetShares.toSolidityValue() >= requestedWithdrawShares.toSolidityValue()) {
        // Yes. Withdraw all from fleetShares
        LoggingService.debug('fleet shares is enough for requested amount', {
          fleetShares: beforeFleetShares.toString(),
        })

        // Approve the requested amount in shares
        const [approveToTakeSharesOnBehalf, exitWithdrawMulticall, priceImpact] = await Promise.all(
          [
            this._allowanceManager.getApproval({
              chainInfo: params.sourceVaultId.chainInfo,
              spender: admiralsQuartersAddress,
              amount: requestedWithdrawShares,
              owner: params.user.wallet.address,
            }),
            this._getExitWithdrawMulticall({
              vaultId: params.sourceVaultId,
              slippage: params.slippage,
              amount: transferAmount,
              // if withdraw is WETH and unwrapping to ETH,
              // we need to withdraw WETH for later deposit & unwrap operation
              swapToToken:
                transferAmount.token.symbol === 'WETH' && toEth
                  ? transferAmount.token
                  : destinationFleetToken,
              shouldSwap,
              toEth,
            }),
            swapToAmount &&
              this._utils.getPriceImpact({
                fromAmount: transferAmount,
                toAmount: swapToAmount,
              }),
          ],
        )

        if (approveToTakeSharesOnBehalf) {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            sharesToWithdraw: requestedWithdrawShares.toString(),
          })
        } else {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            message: 'No approval needed',
          })
        }
        approveTransaction = approveToTakeSharesOnBehalf

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
            exitWithdrawMulticall.multicallOperations.join(', ') +
            depositMulticallOperations.join(', '),
          metadata: {
            fromAmount: transferAmount,
            toAmount: swapToAmount,
            fromVault: params.sourceVaultId,
            toVault: params.destinationVaultId,
            slippage: params.slippage,
            priceImpact,
          },
        })
        if (approveTransaction) {
          transactions = [approveTransaction, withdrawTransaction]
        } else {
          transactions = [withdrawTransaction]
        }
      } else {
        // No. Withdraw all from fleetShares and the reminder from stakedShares
        LoggingService.debug('fleet shares is not enough', {
          fleetShares: beforeFleetShares.toString(),
        })
        const [fleetAssetsWithdrawAmount, approveToTakeSharesOnBehalf] = await Promise.all([
          this._previewRedeem({
            vaultId: params.sourceVaultId,
            shares: beforeFleetShares,
          }),
          this._allowanceManager.getApproval({
            chainInfo: params.sourceVaultId.chainInfo,
            spender: admiralsQuartersAddress,
            amount: beforeFleetShares,
            owner: params.user.wallet.address,
          }),
        ])

        LoggingService.debug('- first take all fleet shares', {
          fleetAssetsWithdrawAmount: fleetAssetsWithdrawAmount.toString(),
        })

        if (approveToTakeSharesOnBehalf) {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            sharesToWithdraw: beforeFleetShares.toString(),
          })
        } else {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            message: 'No approval needed',
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
          params.sourceVaultId.chainInfo,
        )

        const [exitWithdrawMulticall, unstakeAndWithdrawCall, priceImpact] = await Promise.all([
          this._getExitWithdrawMulticall({
            vaultId: params.sourceVaultId,
            slippage: params.slippage,
            amount: fleetAssetsWithdrawAmount,
            exitAll: true,
            // if withdraw is WETH and unwrapping to ETH,
            // we need to withdraw WETH for later deposit & unwrap operation
            swapToToken:
              fleetAssetsWithdrawAmount.token.symbol === 'WETH' && toEth
                ? fleetAssetsWithdrawAmount.token
                : destinationFleetToken,
            shouldSwap,
            toEth,
          }),
          this._getUnstakeAndWithdrawCall({
            vaultId: params.sourceVaultId,
            shares: reminderShares,
            stakedShares: beforeStakedShares,
          }),
          swapToAmount &&
            this._utils.getPriceImpact({
              fromAmount: transferAmount,
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
        const withdrawTransaction = createVaultSwitchTransaction({
          target: admiralsQuartersAddress,
          calldata: multicallCalldata,
          description: 'Vault Switch Operations: ' + multicallOperations.join(', '),
          metadata: {
            fromAmount: transferAmount,
            toAmount: swapToAmount,
            fromVault: params.sourceVaultId,
            toVault: params.destinationVaultId,
            slippage: params.slippage,
            priceImpact,
          },
        })

        const unstakeAndWithdrawCalldata = encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [[...unstakeMulticallArgs, ...depositMulticallArgs]],
        })
        const unstakeAndWithdrawTransaction = createVaultSwitchTransaction({
          target: unstakeAdmiralsQuartersAddress,
          calldata: unstakeAndWithdrawCalldata,
          description:
            'Unstake and Withdraw Operations: ' +
            unstakeMulticallOperations.join(', ') +
            depositMulticallOperations.join(', '),
          metadata: {
            fromAmount: transferAmount,
            toAmount: swapToAmount,
            fromVault: params.sourceVaultId,
            toVault: params.destinationVaultId,
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
      const multicallArgs: HexData[] = []
      const multicallOperations: string[] = []

      LoggingService.debug('fleet shares is 0, take all from staked shares', {
        outShares: requestedWithdrawShares.toString(),
      })

      // Get the chain-specific address for unstakeAndWithdraw
      const unstakeAdmiralsQuartersAddress = this._getUnstakeAdmiralsQuartersAddress(
        params.sourceVaultId.chainInfo,
      )

      // withdraw all from staked tokens
      const [unstakeAndWithdrawCall, priceImpact] = await Promise.all([
        this._getUnstakeAndWithdrawCall({
          vaultId: params.sourceVaultId,
          shares: requestedWithdrawShares,
          stakedShares: beforeStakedShares,
        }),
        swapToAmount &&
          this._utils.getPriceImpact({
            fromAmount: transferAmount,
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
        args: [[...multicallArgs, ...depositMulticallArgs]],
      })

      const vaultSwitchTransaction = createVaultSwitchTransaction({
        target: unstakeAdmiralsQuartersAddress, // Use the chain-specific address for transactions with unstakeAndWithdraw
        calldata: multicallCalldata,
        description:
          'Vault Switch Operations: ' +
          multicallOperations.join(', ') +
          depositMulticallOperations.join(', '),
        metadata: {
          fromAmount: transferAmount,
          toAmount: swapToAmount,
          fromVault: params.sourceVaultId,
          toVault: params.destinationVaultId,
          slippage: params.slippage,
          priceImpact,
        },
      })
      transactions = [vaultSwitchTransaction]
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
  }): ReturnType<IArmadaManagerVaults['getNewDepositTX']> {
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
          amount: approveTransaction.metadata.approvalAmount.toString(),
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
  }): ReturnType<IArmadaManagerVaults['getWithdrawTX']> {
    const withdrawAmount = params.amount
    const toEth = params.toToken.symbol === 'ETH'
    const swapToToken = params.toToken
    const shouldSwap = !swapToToken.equals(withdrawAmount.token)

    // let swapMinAmount: ITokenAmount | undefined
    let swapToAmount: ITokenAmount | undefined
    let transactions:
      | [WithdrawTransactionInfo]
      | [ApproveTransactionInfo, WithdrawTransactionInfo]
      | [WithdrawTransactionInfo, WithdrawTransactionInfo]
      | [ApproveTransactionInfo, WithdrawTransactionInfo, WithdrawTransactionInfo]

    const [beforeFleetShares, beforeStakedShares, requestedWithdrawShares] = await Promise.all([
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

    // Are fleetShares available at all? (should be greater than dust)
    if (beforeFleetShares.toSolidityValue() > 0) {
      // Yes. Are fleetShares sufficient to meet the requestedWithdrawShares?
      if (beforeFleetShares.toSolidityValue() >= requestedWithdrawShares.toSolidityValue()) {
        // Yes. Withdraw all from fleetShares
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
              this._utils.getPriceImpact({
                fromAmount: withdrawAmount,
                toAmount: swapToAmount,
              }),
          ],
        )

        if (approveToTakeSharesOnBehalf) {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            sharesToWithdraw: requestedWithdrawShares.toString(),
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
        if (approveToTakeSharesOnBehalf) {
          transactions = [approveToTakeSharesOnBehalf, withdrawTransaction]
        } else {
          transactions = [withdrawTransaction]
        }
      } else {
        // No. Withdraw all from fleetShares and the reminder from stakedShares
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
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            sharesToWithdraw: beforeFleetShares.toString(),
          })
        } else {
          LoggingService.debug('approveToTakeSharesOnBehalf', {
            message: 'No approval needed',
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
            this._utils.getPriceImpact({
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
        const withdrawTransaction = createWithdrawTransaction({
          target: admiralsQuartersAddress,
          calldata: multicallCalldata,
          description: 'Withdraw Operations: ' + multicallOperations.join(', '),
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
          args: [unstakeMulticallArgs],
        })
        const unstakeAndWithdrawTransaction = createWithdrawTransaction({
          target: unstakeAdmiralsQuartersAddress,
          calldata: unstakeAndWithdrawCalldata,
          description: 'Unstake and withdraw: ' + unstakeMulticallOperations.join(', '),
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
          this._utils.getPriceImpact({
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

      const withdrawTransaction = createWithdrawTransaction({
        target: unstakeAdmiralsQuartersAddress, // Use the chain-specific address for transactions with unstakeAndWithdraw
        calldata: multicallCalldata,
        description: 'Withdraw Operations: ' + multicallOperations.join(', '),
        metadata: {
          fromAmount: withdrawAmount,
          toAmount: swapToAmount,
          slippage: params.slippage,
          priceImpact,
        },
      })
      transactions = [withdrawTransaction]
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
   * FIXME: This is some kind of a hack to use different AQ for withdrawals
   * Returns the chain-specific Admirals Quarters address for unstake operations
   * @param chainInfo The chain information
   * @returns The appropriate Admirals Quarters address for the chain
   */
  private _getUnstakeAdmiralsQuartersAddress(chainInfo: IChainInfo): IAddress {
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
}
