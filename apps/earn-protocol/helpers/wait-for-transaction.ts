import { type useClient } from '@/hooks/use-client'

type WaitForTransactionParams = {
  publicClient: ReturnType<typeof useClient>['publicClient']
  hash: `0x${string}`
}

export const waitForTransaction = async ({ publicClient, hash }: WaitForTransactionParams) => {
  return await publicClient.waitForTransactionReceipt({
    hash,
    confirmations: 2,
  })
}
