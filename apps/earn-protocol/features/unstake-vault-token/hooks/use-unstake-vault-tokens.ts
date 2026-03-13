'use client'
import { useMemo } from 'react'
import { useEarnProtocolSendUserOperation, useIsIframe } from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, User, Wallet } from '@summerfi/sdk-common'
import { useQuery } from '@tanstack/react-query'
import { type PublicClient } from 'viem'

import { type UnstakeVaultTokenBalance } from '@/features/unstake-vault-token/types'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useSafeTransaction } from '@/hooks/use-safe-transaction'

/**
 * Hook to handle unstaking vault tokens
 * @param {Object} params - Hook parameters
 * @param {() => void} params.onSuccess - Callback function called when the transaction succeeds
 * @param {() => void} params.onError - Callback function called when the transaction fails
 * @param {SupportedSDKNetworks} params.network - The network to use
 * @param {PublicClient} params.publicClient - The public client to use
 * @param {string} params.fleetAddress - The fleet address to use
 * @param {string} params.walletAddress - The wallet address to use
 */
export const useUnstakeVaultTokens = ({
  onSuccess,
  onError,
  network,
  publicClient,
  fleetAddress,
  walletAddress,
}: {
  onSuccess: () => void
  onError: () => void
  network: SupportedSDKNetworks
  publicClient?: PublicClient
  fleetAddress: string
  walletAddress: string
}): {
  unstakeVaultTokensTransaction: () => Promise<unknown>
  isLoading: boolean
  error: Error | null
  balance: UnstakeVaultTokenBalance
} => {
  const { getUnstakeFleetTokensTx, getStakedBalance, getTargetChainInfo } = useAppSDK()

  const { sendSafeWalletTransaction, waitingForTx } = useSafeTransaction({
    network,
    onSuccess,
    onError,
    publicClient,
  })

  const user = useMemo(
    () =>
      User.createFrom({
        chainInfo: getTargetChainInfo(subgraphNetworkToId(network)),
        wallet: Wallet.createFrom({
          address: Address.createFromEthereum({ value: walletAddress }),
        }),
      }),
    [walletAddress, network, getTargetChainInfo],
  )

  const chainInfo = getTargetChainInfo(subgraphNetworkToId(network))

  const {
    data: balance,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
  } = useQuery({
    queryKey: ['unstake-vault-tokens-balance', fleetAddress, walletAddress, network],
    queryFn: () =>
      getStakedBalance({
        user,
        fleetAddress,
        chainInfo,
      }),
  })

  const isIframe = useIsIframe()

  const {
    sendUserOperationAsync,
    error: sendUserOperationError,
    isSendingUserOperation,
  } = useEarnProtocolSendUserOperation({
    waitForTxn: true,
    onSuccess,
    onError,
  })

  const unstakeVaultTokensTransaction = async () => {
    const tx = await getUnstakeFleetTokensTx({
      user,
      fleetAddress,
      chainInfo,
    })

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (tx === undefined) {
      throw new Error('unstake fleet tokens tx is undefined')
    }

    const txParams = {
      target: tx.transaction.target.value,
      data: tx.transaction.calldata,
      value: BigInt(tx.transaction.value),
    }

    if (isIframe) {
      return sendSafeWalletTransaction(txParams)
    }

    return await sendUserOperationAsync(txParams)
  }

  return {
    unstakeVaultTokensTransaction,
    isLoading: isSendingUserOperation || !!waitingForTx,
    error: sendUserOperationError,
    balance: {
      amount: balance?.shares.amount,
      isLoading: isLoadingBalance,
      isError: isErrorBalance,
      token: balance?.shares.token,
    },
  }
}
