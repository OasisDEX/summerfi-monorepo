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
  // RWA withdraw: position data to convert user-entered USDC amount into fleet shares.
  // The SDK's getWithdrawTx expects shares, but the UI amount is in USDC.
  rwaPositionShares?: BigNumber
  rwaPositionAssets?: BigNumber
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
  rwaPositionShares,
  rwaPositionAssets,
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
    // The RWA handlers take a human-readable amount (string, in the vault token's decimals): the
    // deposit side as `assetsAmount`, the withdraw side as `sharesAmount`.
    const humanAmount = amount.toString()

    // For withdrawals the SDK expects fleet shares, but the user enters an amount in the
    // underlying asset (USDC). Convert using the position's current exchange rate:
    //   shares = USDCAmount * (positionShares / positionAssets)
    let sharesAmount = humanAmount

    if (
      action === TransactionAction.WITHDRAW &&
      rwaPositionShares &&
      rwaPositionAssets &&
      rwaPositionAssets.gt(0)
    ) {
      sharesAmount = amount.times(rwaPositionShares).div(rwaPositionAssets).toString()
    }

    const rwaTransactions =
      action === TransactionAction.DEPOSIT
        ? await getRwaDepositTx({
            fleetAddress: fleetAddress as AddressValue,
            chainId: vaultChainId as ChainId,
            userAddress: userWalletAddress as AddressValue,
            assetsAmount: humanAmount,
          })
        : await getRwaWithdrawTx({
            fleetAddress: fleetAddress as AddressValue,
            chainId: vaultChainId as ChainId,
            userAddress: userWalletAddress as AddressValue,
            sharesAmount,
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
