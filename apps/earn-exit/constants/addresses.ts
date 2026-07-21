import { type Address } from 'viem'

interface CoreAddresses {
  harborCommand: Address
  admiralsQuarters: Address
}

// HarborCommand addresses come from `sdk/armada-protocol-common/src/deployments/sumr.json`
// (verified live 2026-07-16). AdmiralsQuarters addresses are NEWER than sumr.json: the
// sumr.json AQ deployments were verified on-chain (2026-07-16) to no longer hold
// ADMIRALS_QUARTERS_ROLE on any fleet's StakingRewardsManager — staked exits
// (unstakeAndWithdrawAssets) revert with CallerNotAdmiralsQuarters through them. The addresses
// below are the most recently role-granted AQ deployments per chain, verified via
// ProtocolAccessManager RoleGranted logs + hasAdmiralsQuartersRole() on every fleet's
// rewards manager + exit-path selectors present in deployed bytecode.
export const CORE_ADDRESSES: { [chainId: number]: CoreAddresses } = {
  // Ethereum
  1: {
    harborCommand: '0x09eb323dBFECB43fd746c607A9321dACdfB0140F',
    // role-granted at block 23074391; sumr.json's 0x09124a25756223Eb7A523A0377cc83Dc8D22e1bE is stale
    admiralsQuarters: '0xD03bD9Ef8c72Aee3DBb5b8DF83c479D847622Dba',
  },
  // Base
  8453: {
    harborCommand: '0x09eb323dBFECB43fd746c607A9321dACdfB0140F',
    // role-granted at block 33757352; sumr.json's 0x2e4AC08988c3a995A290Da2655664a8dEF92675F is stale
    admiralsQuarters: '0x4e92071F9BC94011419Dc03fEaCA32D11241313a',
  },
  // Arbitrum One
  42161: {
    harborCommand: '0x09eb323dBFECB43fd746c607A9321dACdfB0140F',
    // role-granted at block 365197748; sumr.json's 0x20aF9545eBb320c80C5736880bAA7a244a75868f is stale
    admiralsQuarters: '0x1db04f01386c6BE2d22b7947236d8ACc05901219',
  },
  // Sonic
  146: {
    harborCommand: '0xa8E4716a1e8Db9dD79f1812AF30e073d3f4Cf191',
    // role-granted at block 41718825; sumr.json's 0xAf755eD8D76Fdceab2B1cdC0d4C8C94f4e8eEe54 is stale
    admiralsQuarters: '0xa514a99b3584D152b2BE9cBe3e7B34Ad40954410',
  },
  // HyperEVM (Hyperliquid)
  999: {
    harborCommand: '0x5CD5D7e3A1b604E0EdeDc4A2343b312729e09E3F',
    // role-granted at block 20755465; sumr.json's 0x13c93bB39F8f6F08310522DD447d18683aB3ca51 is stale
    admiralsQuarters: '0x3D4AE5aefbE0F5471Eb33BCFcBBcf6d9234D32a5',
  },
}

/**
 * Escape hatch: fleets NOT returned by HarborCommand.getActiveFleetCommanders() that users may
 * still hold shares in (e.g. decommissioned during the wind-down). Merged into discovery.
 */
export const EXTRA_FLEETS: { [chainId: number]: Address[] } = {
  1: [],
  8453: [],
  42161: [],
  146: [],
  999: [],
}

/**
 * SUMR governance-token staking (V2 `SummerStaking`). Base only — the protocol deploys SUMR staking
 * on a single chain. Addresses come from `sdk/armada-protocol-common/src/deployments/sumr.json`
 * (`base.deployedContracts.govV2`). Unlike the AdmiralsQuarters addresses above these are read from
 * the SDK deployment config, not a role lookup, so they are not expected to be stale — but they are
 * re-verified live against the fork (see the SUMR verification note in the README).
 *
 * The stSUMR staked-receipt token is NOT hardcoded: it is resolved on-chain via
 * `STAKED_SUMMER_TOKEN()`, because that is the token the user must approve before unstaking.
 */
export const SUMR_STAKING = {
  chainId: 8453,
  summerStaking: '0xcA2e14c7C03C9961c296C89e2d2279F5F7DB15b4' as Address,
  sumrToken: '0x194f360D130F2393a5E9F3117A6a1B78aBEa1624' as Address,
  usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address,
} as const

/** Mainnet Chainlink feeds used for approximate USD display (verify on data.chain.link). */
export const CHAINLINK_FEEDS = {
  ETH_USD: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419' as Address,
  EUR_USD: '0xb49f677943BC038e9857d61E7d053CaA2C1734C1' as Address,
}
