import { useEffect } from 'react'
import { useUser } from '@account-kit/react'
import { getVaultPositionUrl } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/navigation'

// Minimum amount to consider a position to be "open"
const minAmount = new BigNumber(0.01)

// to use on the open pages
// automatically redirects to the manage page if the user has a position
export const useRedirectToPosition = ({
  position,
  vault,
}: {
  position?: IArmadaPosition
  vault: SDKVaultishType
}) => {
  const { replace } = useRouter()
  const user = useUser()

  useEffect(() => {
    const noData = !position || !user
    const positionWithNoAmount = position && new BigNumber(position.amount.amount).lt(minAmount)

    if (noData || positionWithNoAmount) return
    replace(
      getVaultPositionUrl({
        network: vault.protocol.network,
        vaultId: vault.customFields?.slug ?? vault.id,
        walletAddress: user.address,
      }),
    )
  }, [position, replace, user, vault])
}
