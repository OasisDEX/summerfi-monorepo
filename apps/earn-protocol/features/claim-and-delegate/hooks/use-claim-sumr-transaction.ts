'use client'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { getAccountType, useIsIframe, useUserWallet } from '@summerfi/app-earn-ui'
import { SupportedNetworkIds, type SupportedSDKNetworks } from '@summerfi/app-types'
import { sdkNetworkToChain } from '@summerfi/app-utils'
import { type ChainId } from '@summerfi/sdk-common'
import { type PublicClient } from 'viem'

import { AQ_BASE_ADDRESS } from '@/constants/addresses'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useSafeTransaction } from '@/hooks/use-safe-transaction'

/**
 * Hook to handle claiming SUMR tokens through a user operation transaction
 * @param {Object} params - Hook parameters
 * @param {() => void} params.onSuccess - Callback function called when the transaction succeeds
 * @param {() => void} params.onError - Callback function called when the transaction fails
 * @returns {Object} Object containing the claim transaction function, loading state, and error state
 * @returns {() => Promise<unknown>} returns.claimSumrTransaction - Function to execute the claim transaction
 * @returns {boolean} returns.isLoading - Whether the transaction is currently being processed
 * @returns {Error | null} returns.error - Error object if the transaction failed, null otherwise
 */
export const useClaimSumrTransaction = ({
  onSuccess,
  onError,
  network,
  publicClient,
}: {
  onSuccess: () => void
  onError: () => void
  network: SupportedSDKNetworks
  publicClient?: PublicClient
}): {
  claimSumrTransaction: () => Promise<unknown>
  isLoading: boolean
  error: Error | null
} => {
  const { getAggregatedClaimsForChainTx, getCurrentUser, getChainInfo } = useAppSDK()

  const { client: smartAccountClient } = useSmartAccountClient({
    type: getAccountType(sdkNetworkToChain(network).id),
  })

  const { sendSafeWalletTransaction, waitingForTx } = useSafeTransaction({
    network,
    onSuccess,
    onError,
    publicClient,
  })

  const isIframe = useIsIframe()

  const {
    sendUserOperationAsync,
    error: sendUserOperationError,
    isSendingUserOperation,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess,
    onError,
  })
  const chainId = publicClient?.chain?.id

  const includeMerkl = chainId === SupportedNetworkIds.Base

  const claimSumrTransaction = async () => {
    const user = getCurrentUser()
    const chainInfo = getChainInfo()

    const tx = await getAggregatedClaimsForChainTx({ user, chainInfo, includeMerkl })

    if (tx === undefined) {
      throw new Error('aggregated claims tx is undefined')
    }

    const txParams = {
      target: tx[0].transaction.target.value,
      data: tx[0].transaction.calldata,
      value: BigInt(tx[0].transaction.value),
    }

    const resolvedOverrides = await getGasSponsorshipOverride({
      smartAccountClient,
      txParams,
    })

    if (isIframe) {
      return sendSafeWalletTransaction(txParams)
    }

    return await sendUserOperationAsync({
      uo: txParams,
      overrides: resolvedOverrides,
    })
  }

  return {
    claimSumrTransaction,
    isLoading: isSendingUserOperation || !!waitingForTx,
    error: sendUserOperationError,
  }
}

/**
 * Hook to handle approving the staking rewards caller for SUMR tokens through a user operation transaction
 * @param {Object} params - Hook parameters
 * @param {() => void} params.onSuccess - Callback function called when the transaction succeeds
 * @param {() => void} params.onError - Callback function called when the transaction fails
 * @returns {Object} Object containing the approve transaction function, loading state, and error state
 * @returns {() => Promise<unknown>} returns.approveStakingRewardsCallerTransaction - Function to execute the approve transaction
 * @returns {boolean} returns.isLoading - Whether the transaction is currently being processed
 * @returns {Error | null} returns.error - Error object if the transaction failed, null otherwise
 */
export const useApproveStakingRewardsCallerTransaction = ({
  onSuccess,
  onError,
  network,
  publicClient,
}: {
  onSuccess: () => void
  onError: () => void
  network: SupportedSDKNetworks
  publicClient?: PublicClient
}): {
  approveStakingRewardsCallerTransaction: () => Promise<unknown>
  isLoading: boolean
  error: Error | null
} => {
  const { authorizeStakingRewardsCallerV2 } = useAppSDK()

  const sdkNetwork = sdkNetworkToChain(network)

  const { userWalletAddress } = useUserWallet()

  const { client: smartAccountClient } = useSmartAccountClient({
    type: getAccountType(sdkNetwork.id),
  })

  const { sendSafeWalletTransaction, waitingForTx } = useSafeTransaction({
    network,
    onSuccess,
    onError,
    publicClient,
  })

  const isIframe = useIsIframe()

  const {
    sendUserOperationAsync,
    error: sendUserOperationError,
    isSendingUserOperation,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess,
    onError,
  })

  const approveStakingRewardsCallerTransaction = async () => {
    if (!userWalletAddress) {
      throw new Error('User wallet address is undefined')
    }

    const tx = await authorizeStakingRewardsCallerV2({
      authorizedCallerAddress: AQ_BASE_ADDRESS,
      chainId: sdkNetwork.id as ChainId,
      isAuthorized: true,
      userAddress: userWalletAddress as `0x${string}`,
    })

    if (tx === undefined) {
      throw new Error('authorize staking rewards caller tx is undefined')
    }

    const txParams = {
      target: tx[0].transaction.target.value,
      data: tx[0].transaction.calldata,
      value: BigInt(tx[0].transaction.value),
    }

    const resolvedOverrides = await getGasSponsorshipOverride({
      smartAccountClient,
      txParams,
    })

    if (isIframe) {
      return sendSafeWalletTransaction(txParams)
    }

    return await sendUserOperationAsync({
      uo: txParams,
      overrides: resolvedOverrides,
    })
  }

  return {
    approveStakingRewardsCallerTransaction,
    isLoading: isSendingUserOperation || !!waitingForTx,
    error: sendUserOperationError,
  }
}
