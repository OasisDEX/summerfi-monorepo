'use client'

import { useEffect } from 'react'
import { useUser } from '@account-kit/react'
import { getVaultPositionUrl, getVaultUrl } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client'
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
  const user = useUser()

  useEffect(() => {
    if (!position || !user) {
      return
    }
    const emptyPosition = new BigNumber(position.amount.amount).lt(minAmount)
    const vaultUrl = getVaultUrl(vault)
    const vaultPositionUrl = getVaultPositionUrl({
      network: vault.protocol.network,
      vaultId: vault.customFields?.slug ?? vault.id,
      walletAddress: user.address,
    })

    if (pathname === vaultUrl && !emptyPosition) {
      replace(vaultPositionUrl)
    } else if (pathname === vaultPositionUrl && emptyPosition) {
      replace(vaultUrl)
    }
  }, [pathname, position, replace, user, vault])
}
