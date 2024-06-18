import { Text } from '@summerfi/app-ui'

import { formatAddress } from '@/helpers/formatters'
import { RaysApiResponse } from '@/server-handlers/rays'

interface ClaimRaysTitleProps {
  userAddress?: string
  userRays:
    | {
        rays: RaysApiResponse
        error?: undefined
      }
    | {
        error: unknown
        rays?: undefined
      }
    | null
}

export const ClaimRaysTitle = ({ userAddress, userRays }: ClaimRaysTitleProps) => {
  if (!userAddress || typeof userRays?.rays?.eligiblePoints === 'undefined') {
    return (
      <Text as="h1" variant="h1" style={{ marginTop: 'var(--space-xxl)' }}>
        Claim your $RAYS
      </Text>
    )
  }

  return (
    <Text as="h2" variant="h2">
      Wallet {formatAddress(userAddress)} is eligible for{' '}
      {userRays.rays.eligiblePoints > 0 ? `up to` : ''} {userRays.rays.eligiblePoints.toFixed(0)}{' '}
      $RAYS
    </Text>
  )
}
