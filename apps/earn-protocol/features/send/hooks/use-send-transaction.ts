import { useCallback } from 'react'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { type IToken } from '@summerfi/sdk-common'
import { encodeFunctionData } from 'viem' //

import { accountType } from '@/account-kit/config'

export const useSendTransaction = ({
  onSuccess,
  onError,
  amount,
  token,
  recipient,
}: {
  onSuccess: () => void
  onError: () => void
  amount: string | undefined
  token: IToken | undefined
  recipient: string | undefined
}) => {
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const { sendUserOperationAsync, isSendingUserOperation } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess,
    onError,
  })

  const sendTransaction = useCallback(async () => {
    if (!token || !amount || !recipient) {
      return
    }

    const transferData = encodeFunctionData({
      abi: [
        {
          name: 'transfer',
          type: 'function',
          inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ type: 'bool' }],
        },
      ],
      // eslint-disable-next-line no-mixed-operators
      args: [recipient, BigInt(Number(amount) * 10 ** token.decimals)],
    })

    await sendUserOperationAsync({
      uo: {
        target: token.address.value,
        data: transferData,
        value: 0n,
      },
    })
  }, [token, amount, recipient, sendUserOperationAsync])

  return {
    isLoading: isSendingUserOperation,
    sendTransaction,
  }
}
