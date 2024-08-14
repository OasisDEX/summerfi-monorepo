import { type Address } from '@summerfi/serverless-shared'
import type { PublicClient } from 'viem'

const walletDetectorABI = [
  {
    inputs: [{ internalType: 'address', name: '_wallet', type: 'address' }],
    name: 'isArgentWallet',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const WALLET_DETECTOR_ADDRESS: { [key: number]: Address } = {
  1: '0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8',
}

/**
 * Check if a given wallet address is an Argent wallet.
 *
 * @param client - The PublicClient instance used to interact with the blockchain.
 * @param address - The wallet address to be checked, formatted as a hexadecimal string.
 * @returns A promise that resolves to a boolean indicating whether the wallet is an Argent wallet.
 *
 * @remarks
 * This function uses the `readContract` method from the viem library to call the `isArgentWallet` function
 * on the wallet detector contract. The contract address is predefined for the Ethereum mainnet (chain ID 1).
 *
 */
export async function checkIfArgentWallet(
  client: PublicClient,
  address: Address,
): Promise<boolean> {
  return await client.readContract({
    abi: walletDetectorABI,
    functionName: 'isArgentWallet',
    address: WALLET_DETECTOR_ADDRESS[1],
    args: [address],
  })
}
