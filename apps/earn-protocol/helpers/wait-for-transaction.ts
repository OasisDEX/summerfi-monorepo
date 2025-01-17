import { type useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'

type WaitForTransactionParams = {
  publicClient: ReturnType<typeof useNetworkAlignedClient>['publicClient']
  hash: `0x${string}`
}

export const waitForTransaction = async ({ publicClient, hash }: WaitForTransactionParams) => {
  return await publicClient.waitForTransactionReceipt({
    hash,
    confirmations: 2,
  })
}
