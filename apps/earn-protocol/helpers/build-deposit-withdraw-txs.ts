import {
  type SupportedNetworkIds,
  TransactionAction,
  type TransactionWithStatus,
} from '@summerfi/app-types'
import { type SdkClient } from '@summerfi/sdk-client-react'
import {
  Address,
  type AddressValue,
  type ChainId,
  getChainInfoByChainId,
  type IToken,
  TokenAmount,
} from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'

import { buildRwaTransactions } from '@/helpers/build-rwa-transactions'

type BuildDepositWithdrawParams = {
  action: TransactionAction.DEPOSIT | TransactionAction.WITHDRAW
  isRwaVault: boolean
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
  getRwaDepositTx: SdkClient['getRwaDepositTx']
  getRwaWithdrawTx: SdkClient['getRwaWithdrawTx']
}

/**
 * Builds the deposit/withdraw transaction list as the typed TransactionWithStatus[]
 * the executor consumes. RWA (rounds-based) vaults route through the dedicated
 * handlers (no swap/slippage) and are adapted from the bare TransactionInfo[];
 * standard ERC-4626 vaults use the swap-capable handlers.
 */
export const buildDepositWithdrawTransactions = async ({
  action,
  isRwaVault,
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
  getRwaDepositTx,
  getRwaWithdrawTx,
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

  if (isRwaVault) {
    const rwaTransactions = await {
      [TransactionAction.DEPOSIT]: getRwaDepositTx,
      [TransactionAction.WITHDRAW]: getRwaWithdrawTx,
    }[action]({
      fleetAddress: fleetAddress as AddressValue,
      chainId: vaultChainId as ChainId,
      userAddress: userWalletAddress as AddressValue,
      amount: fromAmount,
    })

    return buildRwaTransactions({
      transactions: rwaTransactions,
      action,
      fromAmount,
    })
  }

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
