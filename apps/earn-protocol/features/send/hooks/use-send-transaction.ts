import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { accountType, useIsIframe } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds, type TransactionHash } from '@summerfi/app-types'
import { chainIdToSDKNetwork } from '@summerfi/app-utils'
import { Address, type IToken, TransactionType } from '@summerfi/sdk-common'
import { encodeFunctionData, type PublicClient } from 'viem'

import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { getSafeTxHash } from '@/helpers/get-safe-tx-hash'
import { isValidAddress } from '@/helpers/is-valid-address'
import { waitForTransaction } from '@/helpers/wait-for-transaction'

export const useSendTransaction = ({
  onSuccess,
  onError,
  amount,
  token,
  recipient,
  chainId,
  publicClient,
}: {
  onSuccess: () => void
  onError: () => void
  amount: string | undefined
  token: IToken | undefined
  recipient: string | undefined
  chainId: SupportedNetworkIds
  publicClient: PublicClient
}) => {
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })
  const isIframe = useIsIframe()
  const [waitingForTx, setWaitingForTx] = useState<TransactionHash>()
  const [txHashes, setTxHashes] = useState<
    { type: TransactionType; hash?: string; custom?: string }[]
  >([])

  const removeTxHash = useCallback(
    (txHash: string) => {
      setTxHashes((prev) => prev.filter((tx) => tx.hash !== txHash))
    },
    [setTxHashes],
  )

  const onSuccessHandler = useCallback(
    ({
      hash,
      type,
      message,
    }: {
      hash: TransactionHash
      type: TransactionType
      message: string
    }) => {
      if (isIframe) {
        getSafeTxHash(hash, chainIdToSDKNetwork(chainId))
          .then((safeTransactionData) => {
            if (safeTransactionData.transactionHash) {
              setWaitingForTx(safeTransactionData.transactionHash)
            }

            setTxHashes((prev) => [
              ...prev,
              {
                type,
                hash: safeTransactionData.transactionHash,
              },
            ])

            if (
              safeTransactionData.confirmations.length > safeTransactionData.confirmationsRequired
            ) {
              setTxHashes((prev) => [
                ...prev,
                {
                  type,
                  custom: message,
                },
              ])
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('Error getting the safe tx hash:', err)
          })
      } else {
        setWaitingForTx(hash)
        setTxHashes((prev) => [
          ...prev,
          {
            type,
            hash,
          },
        ])
      }
    },
    [isIframe, chainId],
  )

  const { sendUserOperationAsync, isSendingUserOperation } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: ({ hash }) => {
      onSuccessHandler({
        hash,
        type: TransactionType.Send,
        message:
          'Multisig transaction detected. After all approval confirmations are done, the position will be ready for migration.',
      })
    },
    onError,
  })

  const transactionData = useMemo(() => {
    if (!token || !amount || !isValidAddress(recipient)) {
      return undefined
    }

    // eslint-disable-next-line no-mixed-operators
    const resolvedAmount = BigInt(Number(amount) * 10 ** token.decimals)

    const isNativeToken =
      token.address.value.toLowerCase() ===
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase()

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
      args: [recipient, resolvedAmount],
    })

    if (isNativeToken) {
      return {
        transaction: {
          target: Address.createFromEthereum({ value: recipient }),
          calldata: '0x' as `0x${string}`, // empty calldata for ETH transfer
          value: resolvedAmount.toString(),
        },
        description: 'Send',
      }
    }

    return {
      transaction: {
        target: Address.createFromEthereum({ value: token.address.value }),
        calldata: transferData,
        value: '0',
      },
      description: 'Send',
    }
  }, [token, amount, recipient])

  const sendTransaction = useCallback(async () => {
    if (!transactionData) {
      return
    }

    const txParams = {
      target: transactionData.transaction.target.value,
      data: transactionData.transaction.calldata,
      value: BigInt(transactionData.transaction.value),
    }

    const resolvedOverrides = await getGasSponsorshipOverride({
      smartAccountClient,
      txParams,
    })

    await sendUserOperationAsync({
      uo: txParams,
      overrides: resolvedOverrides,
    })
  }, [transactionData, sendUserOperationAsync, smartAccountClient])

  useEffect(() => {
    if (waitingForTx) {
      waitForTransaction({ publicClient, hash: waitingForTx })
        .then(() => {
          onSuccess()
        })
        .catch((err) => {
          onError()
          // eslint-disable-next-line no-console
          console.error('Error waiting for transaction:', err)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitingForTx, publicClient])

  return {
    isLoading: isSendingUserOperation,
    sendTransaction,
    transactionData,
    txHashes,
    removeTxHash,
  }
}
