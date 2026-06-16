import { type AddressValue, type ChainId } from '@summerfi/sdk-common'

import { backendInstiSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

/**
 * Server-side, JSON-safe view of a wallet's total RWA exposure to a fleet, split into the settlement
 * buckets the rounds-vault model exposes. Amounts are decimal strings (denominated in the fleet
 * input asset) so the result survives `unstable_cache` (JSON.stringify can't serialise the SDK's
 * ITokenAmount/IFiatCurrencyAmount instances) and crosses to the client.
 *
 * `total = settledPosition + pendingDeposits + claimableDeposits + pendingWithdrawals`.
 */
export type RwaUserExposure = {
  total: string
  totalUsd: string
  settledPosition: string
  pendingDeposits: string
  claimableDeposits: string
  pendingWithdrawals: string
  // Denomination of the amounts above (the fleet input asset, e.g. USDC).
  tokenSymbol: string
  tokenDecimals: number
}

/**
 * Reads the wallet's RWA vault exposure through {@link backendInstiSDK} (institutional subgraph +
 * Client-Id/Insti-Version headers). Additive to the page, so it degrades to `null` rather than
 * throwing — a missing exposure simply means the manage view falls back to the deposit view.
 */
export async function getRwaUserVaultExposure({
  chainId,
  fleetAddress,
  walletAddress,
}: {
  chainId: number
  fleetAddress: string
  walletAddress: string
}): Promise<RwaUserExposure | null> {
  try {
    const exposure = await backendInstiSDK.rwa.getUserVaultExposure({
      chainId: chainId as ChainId,
      fleetAddress: fleetAddress.toLowerCase() as AddressValue,
      userAddress: walletAddress.toLowerCase() as AddressValue,
    })

    return {
      total: exposure.total.amount,
      totalUsd: exposure.totalUsd.amount,
      settledPosition: exposure.settledPosition.amount,
      pendingDeposits: exposure.pendingDeposits.amount,
      claimableDeposits: exposure.claimableDeposits.amount,
      pendingWithdrawals: exposure.pendingWithdrawals.amount,
      tokenSymbol: exposure.total.token.symbol,
      tokenDecimals: exposure.total.token.decimals,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getRwaUserVaultExposure failed', error)

    return null
  }
}
