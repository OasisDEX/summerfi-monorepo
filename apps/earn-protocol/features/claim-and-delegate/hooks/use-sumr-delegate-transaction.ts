import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { accountType } from '@summerfi/app-earn-ui'
import { Address, User, Wallet } from '@summerfi/sdk-common'

import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { useAppSDK } from '@/hooks/use-app-sdk'

/**
 * Hook to handle delegating SUMR voting power through a user operation transaction
 * @param {Object} params - Hook parameters
 * @param {() => void} params.onSuccess - Callback function called when the delegation transaction succeeds
 * @param {() => void} params.onError - Callback function called when the delegation transaction fails
 * @returns {Object} Object containing the delegate transaction function, loading state, and error state
 * @returns {(delegateTo?: string) => Promise<unknown>} returns.sumrDelegateTransaction - Function to execute the delegate transaction
 * @returns {boolean} returns.isLoading - Whether the transaction is currently being processed
 * @returns {Error | null} returns.error - Error object if the transaction failed, null otherwise
 */
export const useSumrDelegateTransaction = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: () => void
}): {
  sumrDelegateTransaction: (delegateTo?: string) => Promise<unknown>
  isLoading: boolean
  error: Error | null
} => {
  const { getDelegateTx, getChainInfo } = useAppSDK()
  const { client } = useSmartAccountClient({ type: accountType })

  const { sendUserOperationAsync, error, isSendingUserOperation } = useSendUserOperation({
    client,
    waitForTxn: true,
    onSuccess,
    onError,
  })

  const sumrDelegateTransaction = async (delegateTo?: string) => {
    if (!delegateTo) {
      throw new Error('Delegate to address is required')
    }

    const chainInfo = getChainInfo()

    const delegateUser = User.createFrom({
      chainInfo,
      wallet: Wallet.createFrom({
        address: Address.createFromEthereum({
          value: delegateTo,
        }),
      }),
    })

    const tx = await getDelegateTx({ user: delegateUser })

    if (tx === undefined) {
      throw new Error('Sumr delegate tx is undefined')
    }

    const txParams = {
      target: tx[0].transaction.target.value,
      data: tx[0].transaction.calldata,
      value: BigInt(tx[0].transaction.value),
    }

    const resolvedOverrides = await getGasSponsorshipOverride({
      smartAccountClient: client,
      txParams,
    })

    return await sendUserOperationAsync({
      uo: txParams,
      overrides: resolvedOverrides,
    })
  }

  return {
    sumrDelegateTransaction,
    isLoading: isSendingUserOperation,
    error,
  }
}
