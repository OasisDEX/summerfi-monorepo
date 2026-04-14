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
  // error case
  detail?: string
}

const subgraphNetworkToSafeSDKAPINetworkName = (network: SupportedSDKNetworks) => {
  return {
    [SupportedSDKNetworks.Mainnet.toLowerCase()]: 'eth',
    [SupportedSDKNetworks.ArbitrumOne.toLowerCase()]: 'arb1',
    [SupportedSDKNetworks.Base.toLowerCase()]: 'base',
    [SupportedSDKNetworks.SonicMainnet.toLowerCase()]: 'sonic',
  }[network.toLowerCase()]
}

export const getSafeTxHash = async (
  safeTxHash: string,
  network: SupportedSDKNetworks,
  maxRetries: number = 15,
): Promise<SafeTransactionDataType | false> => {
  let safeTransactionData: SafeTransactionDataType | undefined
  let retries = 0

  await new Promise((resolve) => {
    setTimeout(resolve, 3000)
  })

  do {
    const res = await fetch(
      `https://api.safe.global/tx-service/${subgraphNetworkToSafeSDKAPINetworkName(network)}api/v2/multisig-transactions/${safeTxHash}/`,
    )

    safeTransactionData = await res.json()

    // handle "not found" case
    if (safeTransactionData?.detail === 'No MultisigTransaction matches the given query.') {
      return false
    }

    if (!safeTransactionData?.transactionHash) {
      if (retries >= maxRetries) {
        return false
      }
      retries++

      const waitTime = retries > 10 ? 10000 : 3000

      await new Promise((resolve) => {
        setTimeout(resolve, waitTime)
      })
    }
  } while (!safeTransactionData?.transactionHash)

  return safeTransactionData as SafeTransactionDataType
}
