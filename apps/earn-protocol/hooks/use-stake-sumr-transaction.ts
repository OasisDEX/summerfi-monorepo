import { useEffect, useState } from 'react'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'

import { accountType } from '@/account-kit/config'

import { useAppSDK } from './use-app-sdk'

export const useStakeSumrTransaction = ({
  amount,
  onStakeSuccess,
  onApproveSuccess,
  onStakeError,
  onApproveError,
}: {
  amount: number
  onStakeSuccess: () => void
  onApproveSuccess: () => void
  onStakeError: () => void
  onApproveError: () => void
}) => {
  const { getStakeTx, getCurrentUser } = useAppSDK()
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const [stakeSumrTransaction, setStakeSumrTransaction] = useState<() => Promise<unknown>>()
  const [approveSumrTransaction, setApproveSumrTransaction] = useState<() => Promise<unknown>>()

  const {
    sendUserOperationAsync: sendStakeSumrTransaction,
    error: sendStakeSumrTransactionError,
    isSendingUserOperation: isSendingStakeSumrTransaction,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: onStakeSuccess,
    onError: onStakeError,
  })

  const {
    sendUserOperationAsync: sendApproveSumrTransaction,
    error: sendApproveSumrTransactionError,
    isSendingUserOperation: isSendingApproveSumrTransaction,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: onApproveSuccess,
    onError: onApproveError,
  })

  useEffect(() => {
    const fetchStakeTx = async () => {
      const user = getCurrentUser()
      const tx = await getStakeTx({ user, amount: BigInt(amount * 10 ** 18) })

      if (tx === undefined) {
        throw new Error('stake tx is undefined')
      }

      if (tx.length === 2) {
        const _approveSumrTransaction = async () => {
          return await sendApproveSumrTransaction({
            uo: {
              target: tx[0].transaction.target.value,
              data: tx[0].transaction.calldata,
              value: BigInt(tx[0].transaction.value),
            },
          })
        }

        const _stakeSumrTransaction = async () => {
          return await sendStakeSumrTransaction({
            uo: {
              target: tx[1].transaction.target.value,
              data: tx[1].transaction.calldata,
              value: BigInt(tx[1].transaction.value),
            },
          })
        }

        setApproveSumrTransaction(() => _approveSumrTransaction)
        setStakeSumrTransaction(() => _stakeSumrTransaction)
      } else {
        const _stakeSumrTransaction = async () => {
          return await sendStakeSumrTransaction({
            uo: {
              target: tx[0].transaction.target.value,
              data: tx[0].transaction.calldata,
              value: BigInt(tx[0].transaction.value),
            },
          })
        }

        setStakeSumrTransaction(() => _stakeSumrTransaction)
      }
    }

    void fetchStakeTx()
  }, [amount])

  return {
    stakeSumrTransaction,
    approveSumrTransaction,
    isLoading: isSendingStakeSumrTransaction || isSendingApproveSumrTransaction,
    error: sendStakeSumrTransactionError ?? sendApproveSumrTransactionError,
  }
}
