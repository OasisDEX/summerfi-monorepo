import type { AddressValue, ChainId } from '@summerfi/sdk-common'

// Contract addresses for Merkl distributor on supported chains
export const MERKL_DISTRIBUTOR_ADDRESSES: Partial<Record<ChainId, AddressValue>> = {
  1: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Ethereum
  // 10: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Optimism
  8453: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Base
  42161: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Arbitrum
  146: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Sonic
}

/**
 * @name getMerklDistributorContractAddress
 * @description Gets the Merkl distributor contract address for a given chain
 * @param chainId The chain ID to get the distributor address for
 * @returns The distributor contract address
 * @throws Error if the chain ID is not supported
 */
export function getMerklDistributorContractAddress(chainId: ChainId): AddressValue {
  const distributorAddress = MERKL_DISTRIBUTOR_ADDRESSES[chainId]
  if (!distributorAddress) {
    throw new Error(`Unsupported chain ID for Merkl operations: ${chainId}`)
  }
  return distributorAddress
}
