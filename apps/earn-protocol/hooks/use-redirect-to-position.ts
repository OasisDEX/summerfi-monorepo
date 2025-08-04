'use client'

import { useEffect } from 'react'
import { getVaultPositionUrl, getVaultUrl, useUserWallet } from '@summerfi/app-earn-ui'
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
  const { userWalletAddress } = useUserWallet()

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

    if (pathname === vaultUrl && !emptyPosition) {
      replace(vaultPositionUrl)
    } else if (pathname === vaultPositionUrl && emptyPosition) {
      replace(vaultUrl)
    }
  }, [pathname, position, replace, userWalletAddress, vault])
}
