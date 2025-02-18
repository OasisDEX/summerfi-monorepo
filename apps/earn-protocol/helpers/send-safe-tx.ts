import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk'

/**
 * Sends a Safe transaction and monitors its status
 * To be used only within safes UI (iframe) since safe sdk doesn't work outside of iframe
 * @param {Object} params
 * @param {Array<{to: string, data: string, value: string}>} params.txs - Array of transactions to send
 * @param {() => void} params.onSuccess - Callback function called when transaction succeeds
 * @param {() => void} params.onError - Callback function called when transaction fails
 * @returns {Promise<void>}
 */
export const sendSafeTx = async ({
  txs,
  onSuccess,
  onError,
}: {
  txs: {
    to: string
    data: string
    value: string
  }[]
  onSuccess: (txHash: string) => void
  onError: () => void
}) => {
  const sdk = new SafeAppsSDK()

  const { safeTxHash } = await sdk.txs.send({
    txs,
  })

  const MAX_ATTEMPTS = 120 // 10 minutes maximum (60 * 10 seconds)
  let attempts = 0

  const checkTxStatus = async () => {
    try {
      const txInfo = await sdk.txs.getBySafeTxHash(safeTxHash)

      // eslint-disable-next-line no-console
      console.log('txInfo', txInfo)

      if (txInfo.txStatus === TransactionStatus.SUCCESS) {
        onSuccess(txInfo.txHash ?? '')

        return
      }
      if (txInfo.txStatus === TransactionStatus.FAILED) {
        onError()

        return
      }

      attempts++
      if (attempts >= MAX_ATTEMPTS) {
        onError()

        return
      }

      setTimeout(checkTxStatus, 5000)
    } catch (error) {
      onError()
    }
  }

  await checkTxStatus()
}
