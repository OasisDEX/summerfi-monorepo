import type { AddressValue, ChainId } from '@summerfi/sdk-common/index'

// Contract addresses for Merkl distributor on supported chains
export const MERKL_DISTRIBUTOR_ADDRESSES: Partial<Record<ChainId, AddressValue>> = {
  1: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Ethereum
  10: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Optimism
  8453: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Base
  42161: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Arbitrum
  146: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae', // Sonic
}
