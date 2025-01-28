import { type PublicClient } from 'viem'

/**
 * Validate a signature against a message using an EIP-1271 compatible contract.
 *
 * @param client - The PublicClient instance used to interact with the blockchain.
 * @param address - The address of the contract that implements the EIP-1271 standard.
 * @param message - The message that was signed.
 * @param signature - The signature to be validated.
 * @returns A promise that resolves to a boolean indicating whether the signature is valid.
 *
 * @remarks
 * This function uses the `isValidSignature` method from the EIP-1271 compatible contract to verify
 * if a provided signature is valid for a given message.
 */
export async function isValidSignature({
  client,
  address,
  message,
  signature,
}: {
  client: PublicClient
  address: `0x${string}`
  message: string
  signature: `0x${string}`
}): Promise<boolean> {
  try {
    await client.verifyMessage({
      address,
      message,
      signature,
    })

    return true
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error validating signature:', err)

    return false
  }
}
