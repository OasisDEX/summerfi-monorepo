import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'

import { accountType } from '@/account-kit/config'

import { useAppSDK } from './use-app-sdk'

export const useUnstakeSumrTransaction = ({
  amount,
  onSuccess,
  onError,
}: {
  amount: number
  onSuccess: () => void
  onError: () => void
}): {
  unstakeSumrTransaction: () => Promise<unknown>
  isLoading: boolean
  error: Error | null
} => {
  const { getUnstakeTx } = useAppSDK()
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const { sendUserOperationAsync, error, isSendingUserOperation } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess,
    onError,
  })

  const unstakeSumrTransaction = async () => {
    const tx = await getUnstakeTx({ amount: BigInt(amount) })

    if (tx === undefined) {
      throw new Error('unstake tx is undefined')
    }

    return await sendUserOperationAsync({
      uo: {
        target: tx[0].transaction.target.value,
        data: tx[0].transaction.calldata,
        value: BigInt(tx[0].transaction.value),
      },
    })
  }

  return {
    unstakeSumrTransaction,
    isLoading: isSendingUserOperation,
    error,
  }
}
