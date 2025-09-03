import { type PublicClient } from 'viem'

type WaitForTransactionParams = {
  publicClient: PublicClient
  hash: `0x${string}`
}

export const waitForTransaction = async ({ publicClient, hash }: WaitForTransactionParams) => {
  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
    confirmations: 2,
  })

  if (receipt.status === 'reverted') {
    throw new Error(`Transaction reverted with hash ${hash}`)
  }

  return receipt
}
