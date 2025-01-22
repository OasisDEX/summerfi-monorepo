import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { Address, User, Wallet } from '@summerfi/sdk-common'

import { accountType } from '@/account-kit/config'

import { useAppSDK } from './use-app-sdk'

export const useSumrDelegateTransaction = ({
  onSuccess,
  onError,
  delegateTo,
}: {
  onSuccess: () => void
  onError: () => void
  delegateTo?: string
}): {
  sumrDelegateTransaction: () => Promise<unknown>
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

  const sumrDelegateTransaction = async () => {
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

    return await sendUserOperationAsync({
      uo: {
        target: tx[0].transaction.target.value,
        data: tx[0].transaction.calldata,
        value: BigInt(tx[0].transaction.value),
      },
    })
  }

  return {
    sumrDelegateTransaction,
    isLoading: isSendingUserOperation,
    error,
  }
}
