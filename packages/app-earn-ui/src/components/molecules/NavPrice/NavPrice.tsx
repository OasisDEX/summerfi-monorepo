import { type ReactNode } from 'react'
import { formatCryptoBalance } from '@summerfi/app-utils'

import { getDisplayToken } from '@/helpers/get-display-token'

/**
 * Net Asset Value (NAV) price per share for a vault, rendered in the vault's underlying-asset terms
 * (e.g. "1.0596 USDT"). Used for RWA (rounds-based) vaults in place of "Live APY", since their value
 * accrues as a price per share rather than a yield. The source is `vault.pricePerShare` (amount of
 * underlying token per full share).
 *
 * Returns the bare value node so call sites supply their own "NAV Price" title/label. Guards
 * null/zero/NaN to 'n/a' rather than letting the formatter print "0.000"/"-".
 */
export const NavPrice = ({
  pricePerShare,
  inputTokenSymbol,
}: {
  pricePerShare: string | null | undefined
  inputTokenSymbol: string
}): ReactNode => {
  const parsed =
    pricePerShare !== null && pricePerShare !== undefined ? Number(pricePerShare) : Number.NaN

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 'n/a'
  }

  return `${formatCryptoBalance(pricePerShare as string)} ${getDisplayToken(inputTokenSymbol)}`
}
