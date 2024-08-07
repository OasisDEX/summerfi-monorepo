import { type Address } from '@summerfi/serverless-shared'
import { hashMessage, type PublicClient } from 'viem'

const eip1271CompatibleContract = [
  {
    inputs: [
      { internalType: 'bytes32', name: '_message', type: 'bytes32' },
      { internalType: 'bytes', name: '_signature', type: 'bytes' },
    ],
    name: 'isValidSignature',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

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
  address: Address
  message: string
  signature: Address
}): Promise<boolean> {
  const messageBytes32 = hashMessage(message)

  try {
    await client.readContract({
      abi: eip1271CompatibleContract,
      functionName: 'isValidSignature',
      address,
      args: [messageBytes32, signature],
    })

    return true
  } catch (err) {
    return false
  }
}
