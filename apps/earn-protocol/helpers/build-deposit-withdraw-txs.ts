import {
  type SupportedNetworkIds,
  TransactionAction,
  type TransactionWithStatus,
} from '@summerfi/app-types'
import { type SdkClient } from '@summerfi/sdk-client-react'
import { Address, getChainInfoByChainId, type IToken, TokenAmount } from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'

type BuildDepositWithdrawParams = {
  action: TransactionAction.DEPOSIT | TransactionAction.WITHDRAW
  token: IToken
  vaultToken: IToken
  amount: BigNumber
  userWalletAddress: `0x${string}`
  fleetAddress: string
  vaultChainId: SupportedNetworkIds
  slippage: number
  referralCode?: string
  getDepositTx: SdkClient['getDepositTx']
  getWithdrawTx: SdkClient['getWithdrawTx']
}

/**
 * Builds the deposit/withdraw transaction list as the typed TransactionWithStatus[]
 * the executor consumes. Standard ERC-4626 vaults use the swap-capable handlers.
 */
export const buildDepositWithdrawTransactions = async ({
  action,
  token,
  vaultToken,
  amount,
  userWalletAddress,
  fleetAddress,
  vaultChainId,
  slippage,
  referralCode,
  getDepositTx,
  getWithdrawTx,
}: BuildDepositWithdrawParams): Promise<TransactionWithStatus[]> => {
  const fromToken = {
    [TransactionAction.DEPOSIT]: token,
    [TransactionAction.WITHDRAW]: vaultToken,
  }[action]
  const toToken = {
    [TransactionAction.DEPOSIT]: vaultToken,
    [TransactionAction.WITHDRAW]: token,
  }[action]

  const fromAmount = TokenAmount.createFrom({
    token: fromToken,
    amount: amount.toString(),
  })

  const standardTransactions = await {
    [TransactionAction.DEPOSIT]: getDepositTx,
    [TransactionAction.WITHDRAW]: getWithdrawTx,
  }[action]({
    walletAddress: Address.createFromEthereum({ value: userWalletAddress }),
    amount: fromAmount,
    toToken,
    fleetAddress,
    chainInfo: getChainInfoByChainId(vaultChainId),
    slippage,
    referralCode,
  })

  // Map to TransactionWithStatus and set executed to false
  return standardTransactions.map((tx) => ({ ...tx, executed: false }))
}
