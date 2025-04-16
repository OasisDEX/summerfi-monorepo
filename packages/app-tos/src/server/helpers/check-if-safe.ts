import { type JWTChallenge } from '@summerfi/app-types'
import { type PublicClient } from 'viem'

const safeAbi = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'isOwner',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

/**
 * Check if a given address is an owner of a Safe contract.
 *
 * @param client - The PublicClient instance used to interact with the blockchain.
 * @param challenge - An object containing the JWT challenge details, including the Safe contract address.
 * @param signedAddress - The address to be checked, formatted as a string.
 * @returns A promise that resolves to a boolean indicating whether the given address is an owner of the Safe contract.
 *
 * @remarks
 * This function uses the `readContract` method from the viem library to call the `isOwner` function
 * on the Safe contract. The contract address is obtained from the challenge object.
 */
export async function checkIfSafeOwner(
  client: PublicClient,
  challenge: JWTChallenge,
  signedAddress: `0x${string}`,
): Promise<boolean> {
  return await client.readContract({
    abi: safeAbi,
    functionName: 'isOwner',
    address: challenge.address,
    args: [signedAddress],
  })
}
