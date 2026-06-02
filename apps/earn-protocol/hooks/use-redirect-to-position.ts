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
}: {
  position?: IArmadaPosition
  vault: SDKVaultishType
}) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const { address: userWalletAddress } = useEarnProtocolWallet()

  useEffect(() => {
    if (!position || !userWalletAddress) {
      return
    }
    const positionUsdValue =
      vault.inputTokenPriceUSD &&
      new BigNumber(position.amount.amount).times(vault.inputTokenPriceUSD)
    const emptyPosition = positionUsdValue ? positionUsdValue.lt(minAmount) : true

    const vaultUrl = getVaultUrl(vault)
    const vaultPositionUrl = getVaultPositionUrl({
      network: supportedSDKNetwork(vault.protocol.network),
      vaultId: vault.customFields?.slug ?? vault.id,
      walletAddress: userWalletAddress,
    })

    // RWA (rounds-based) vaults: a user with only receipts (no Fleet shares) is shown the deposit
    // view on BOTH urls, so the position page must never be bounced back to the open page. We still
    // forward the open page to the position page once the user actually holds shares (a Fleet
    // position read via the RWA SDK), so claimed holders land on their manage view.
    if (vault.isRwaVault) {
      if (pathname === vaultUrl && !emptyPosition) {
        replace(vaultPositionUrl)
      }

      return
    }

    if (pathname === vaultUrl && !emptyPosition) {
      replace(vaultPositionUrl)
    } else if (pathname === vaultPositionUrl && emptyPosition) {
      replace(vaultUrl)
    }
  }, [pathname, position, replace, userWalletAddress, vault])
}
