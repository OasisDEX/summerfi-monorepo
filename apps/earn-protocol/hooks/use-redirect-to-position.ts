import { useEffect } from 'react'
import { useUser } from '@account-kit/react'
import { getVaultPositionUrl } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client-react'
import { useRouter } from 'next/navigation'

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
    if (!position || !user) return
    replace(getVaultPositionUrl(vault, user.address))
  }, [position, replace, user, vault])
}
