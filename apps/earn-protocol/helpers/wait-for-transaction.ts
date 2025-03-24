import { type PublicClient } from 'viem'

type WaitForTransactionParams = {
  publicClient: PublicClient
  hash: `0x${string}`
}

export const waitForTransaction = async ({ publicClient, hash }: WaitForTransactionParams) => {
  return await publicClient.waitForTransactionReceipt({
    hash,
    confirmations: 2,
  })
}
