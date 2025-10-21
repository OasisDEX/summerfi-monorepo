import { SupportedSDKNetworks } from '@summerfi/app-types'

type SafeTransactionDataType = {
  safe: string
  to: string
  value: string
  data: unknown
  operation: number
  gasToken: string
  safeTxGas: number
  baseGas: number
  gasPrice: string
  refundReceiver: string
  nonce: number
  executionDate: unknown
  submissionDate: string
  modified: string
  blockNumber: unknown
  transactionHash?: `0x${string}`
  safeTxHash: string
  proposer: string
  executor: unknown
  isExecuted: boolean
  isSuccessful: unknown
  ethGasPrice: unknown
  maxFeePerGas: unknown
  maxPriorityFeePerGas: unknown
  gasUsed: unknown
  fee: unknown
  origin: string
  dataDecoded: unknown
  confirmationsRequired: 2
  confirmations: {
    owner: string
    submissionDate: string
    transactionHash: unknown
    signature: string
    signatureType: string
  }[]
  trusted: boolean
  signatures: unknown
}

const subgraphNetworkToSafeSDKAPI = (network: SupportedSDKNetworks) => {
  return {
    [SupportedSDKNetworks.Mainnet.toLowerCase()]: 'https://safe-transaction-mainnet.safe.global',
    [SupportedSDKNetworks.ArbitrumOne.toLowerCase()]:
      'https://safe-transaction-arbitrum.safe.global',
    [SupportedSDKNetworks.Base.toLowerCase()]: 'https://safe-transaction-base.safe.global',
  }[network.toLowerCase()]
}

export const getSafeTxHash = async (
  safeTxHash: string,
  network: SupportedSDKNetworks,
): Promise<SafeTransactionDataType> => {
  let safeTransactionData: SafeTransactionDataType
  let retries = 0

  await new Promise((resolve) => {
    setTimeout(resolve, 3000)
  })

  do {
    safeTransactionData = (await fetch(
      `${subgraphNetworkToSafeSDKAPI(network)}/api/v1/multisig-transactions/${safeTxHash}/`,
    ).then((res) => res.json())) as SafeTransactionDataType

    if (!safeTransactionData.transactionHash) {
      retries++
      const waitTime = retries > 10 ? 10000 : 3000

      await new Promise((resolve) => {
        setTimeout(resolve, waitTime)
      })
    }
  } while (!safeTransactionData.transactionHash)

  return safeTransactionData
}
