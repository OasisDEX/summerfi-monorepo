'use client'

import { useEffect } from 'react'
import { getVaultPositionUrl, getVaultUrl, useEarnProtocolWallet } from '@summerfi/app-earn-ui'
import { type IArmadaPosition, type SDKVaultishType } from '@summerfi/app-types'
import { supportedSDKNetwork } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import { usePathname, useRouter } from 'next/navigation'

// Minimum amount to consider a position to be "open"
const minAmount = new BigNumber(0.01)

// to use on the open pages
// automatically redirects to the manage page if the user has a position
// and back to the open page if the user has no position
export const useRedirectToPositionView = ({
  position,
  vault,
  // RWA-only: a pre-claim holder has no Fleet position but does have exposure (pending/claimable
  // receipts). When true, forward them from the open URL to their manage view (which renders a
  // "settling" position from that exposure).
  hasRwaExposure = false,
}: {
  position?: IArmadaPosition
  vault: SDKVaultishType
  hasRwaExposure?: boolean
}) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const { address: userWalletAddress } = useEarnProtocolWallet()

  useEffect(() => {
    if (!userWalletAddress) {
      return
    }
    const positionUsdValue =
      position && vault.inputTokenPriceUSD
        ? new BigNumber(position.amount.amount).times(vault.inputTokenPriceUSD)
        : undefined
    const emptyPosition = positionUsdValue ? positionUsdValue.lt(minAmount) : true

    const vaultUrl = getVaultUrl(vault)
    const vaultPositionUrl = getVaultPositionUrl({
      network: supportedSDKNetwork(vault.protocol.network),
      vaultId: vault.customFields?.slug ?? vault.id,
      walletAddress: userWalletAddress,
    })

    // RWA (rounds-based) vaults: a user with only receipts (no Fleet shares) is shown the deposit
    // view on BOTH urls, so the position page must never be bounced back to the open page. We
    // forward the open page → position page once the user has a settled Fleet position OR pending/
    // claimable exposure (the manage view renders a "settling" position from that exposure).
    if (vault.isRwaVault) {
      if (pathname === vaultUrl && (!emptyPosition || hasRwaExposure)) {
        replace(vaultPositionUrl)
      }

      return
    }

    // Non-RWA redirects both ways but needs a real position to evaluate.
    if (!position) {
      return
    }

    if (pathname === vaultUrl && !emptyPosition) {
      replace(vaultPositionUrl)
    } else if (pathname === vaultPositionUrl && emptyPosition) {
      replace(vaultUrl)
    }
  }, [pathname, position, replace, userWalletAddress, vault, hasRwaExposure])
}
