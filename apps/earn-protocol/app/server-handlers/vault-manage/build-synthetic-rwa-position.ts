import { type IArmadaPosition, type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import { PositionType } from '@summerfi/sdk-common'

import { type RwaUserExposure } from '@/app/server-handlers/sdk/get-rwa-user-vault-exposure'

/**
 * Builds a synthetic {@link IArmadaPosition} from a pre-claim RWA user's vault exposure, so the
 * manage view can render a meaningful "settling" summary instead of bailing (no settled Fleet
 * position exists yet — the user only holds receipts).
 *
 * The manage subtree only ever READS plain fields off the position (it crosses a JSON boundary via
 * parseServerResponseToClient), so a plain object cast to IArmadaPosition is sufficient — no SDK
 * class instances/methods are needed. Mapping (everything denominated in the fleet input asset):
 *  - amount/assets/depositsAmount/netDeposits = exposure.total  → Market Value & Net Contribution
 *  - shares = 0  (forces the share-price fallback to vault.pricePerShare in the manage view)
 *  - withdrawalsAmount/earnings = 0  → Earned = 0 (nothing realised pre-settlement)
 * The per-bucket breakdown (pending vs claimable) lives in the Deposits/Withdrawals table, not here.
 */
export const buildSyntheticRwaPosition = ({
  exposure,
  vault,
}: {
  exposure: RwaUserExposure
  vault: SDKVaultType | SDKVaultishType
}): IArmadaPosition => {
  const token = vault.inputToken
  const { total, totalUsd } = exposure
  const priceUsd = String(vault.inputTokenPriceUSD ?? '0')

  const ta = (amount: string) => ({ token, amount })
  const fiat = (amount: string) => ({ amount, fiat: 'USD' })

  return {
    type: PositionType.Armada,
    // amount is the deprecated alias of assets; both drive Market Value (= total exposure).
    amount: ta(total),
    assets: ta(total),
    shares: ta('0'),
    depositsAmount: ta(total),
    withdrawalsAmount: ta('0'),
    netDeposits: ta(total),
    earnings: ta('0'),
    assetPriceUSD: fiat(priceUsd),
    assetsUSD: fiat(totalUsd),
    depositsAmountUSD: fiat(totalUsd),
    withdrawalsAmountUSD: fiat('0'),
    netDepositsUSD: fiat(totalUsd),
    earningsUSD: fiat('0'),
    claimedSummerToken: ta('0'),
    claimableSummerToken: ta('0'),
    rewards: [],
    deposits: [],
    withdrawals: [],
    // id/pool are not read by the manage subtree; minimal stubs keep the shape complete.
    id: { id: vault.id },
    pool: vault,
    // Plain object intentionally cast: the manage view reads fields only and the value crosses a
    // JSON boundary (the branded symbol / SDK instances are dropped there anyway).
  } as unknown as IArmadaPosition
}
