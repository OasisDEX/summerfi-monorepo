import { type SDKVaultishType, SupportedNetworkIds } from '@summerfi/app-types'
import { subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'

/**
 * Vaults that must always be shown on the vaults list, bypassing the standard visibility filters
 * (zero deposit cap, zero input token balance, DAO-managed feature flag). These are the pre-incident
 * fleets kept visible in withdrawal-only mode; when a vault here is paused on-chain it renders
 * faded with a "Paused" overlay instead of being hidden.
 *
 * Keyed as `<chainId>-<vaultAddressLowercase>`.
 */
export const alwaysVisibleVaults: string[] = [
  // Arbitrum
  // LazyVault_LowerRisk_USDC_2
  `${SupportedNetworkIds.ArbitrumOne}-0x71d77c39db0eb5d086611a2e950198e3077cf58a`,
  // LazyVault_LowerRisk_USDT
  `${SupportedNetworkIds.ArbitrumOne}-0x98c49e13bf99d7cad8069faa2a370933ec9ecf17`,
  // Base
  // LazyVault_LowerRisk_WETH
  `${SupportedNetworkIds.Base}-0x2bb9ad69feba5547b7cd57aafe8457d40bf834af`,
  // LazyVault_LowerRisk_EURC
  `${SupportedNetworkIds.Base}-0x64db8f51f1bf7064bb5a361a7265f602d348e0f0`,
  // LazyVault_LowerRisk_USDC
  `${SupportedNetworkIds.Base}-0x98c49e13bf99d7cad8069faa2a370933ec9ecf17`,
  // Hyperliquid
  // LazyVault_LowerRisk_USDC
  `${SupportedNetworkIds.Hyperliquid}-0x252e5aa42c1804b85b2ce6712cd418a0561232ba`,
  // LazyVault_LowerRisk_USDT
  `${SupportedNetworkIds.Hyperliquid}-0x2cc190fb654141dfbeac4c0f718f4d511674d346`,
  // Mainnet
  // LazyVault_HigherRisk_USDC
  `${SupportedNetworkIds.Mainnet}-0xe9cda459bed6dcfb8ac61cd8ce08e2d52370cb06`,
  // DAO_LazyVault_WETH_1
  `${SupportedNetworkIds.Mainnet}-0x0c1fbccc019320032d9acd193447560c8c632114`,
  // LazyVault_LowerRisk_USDT
  `${SupportedNetworkIds.Mainnet}-0x17ee2d03e88b55e762c66c76ec99c3a28a54ad8d`,
  // LazyVault_HigherRisk_WETH
  `${SupportedNetworkIds.Mainnet}-0x2e6abcbcced9af05bc3b8a4908e0c98c29a88e10`,
  // LazyVault_LowerRisk_WETH
  `${SupportedNetworkIds.Mainnet}-0x67e536797570b3d8919df052484273815a0ab506`,
  // DAO_LazyVault_USDC_1
  `${SupportedNetworkIds.Mainnet}-0xd77f9a9f2b0c160db3e9dc2cce370c1a740c76fc`,
  // Sonic
  // LazyVault_LowerRisk_USDCe
  `${SupportedNetworkIds.SonicMainnet}-0x507a2d9e87dbd3076e65992049c41270b47964f8`,
]

export const getVaultVisibilityKey = (chainId: number | string, vaultAddress: string): string =>
  `${chainId}-${vaultAddress.toLowerCase()}`

export const isAlwaysVisibleVault = (vault: SDKVaultishType): boolean =>
  alwaysVisibleVaults.includes(
    getVaultVisibilityKey(
      subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network)),
      vault.id,
    ),
  )
