import { Text } from '@summerfi/app-ui'
import BigNumber from 'bignumber.js'

import { formatAddress, formatCryptoBalance } from '@/helpers/formatters'
import { RaysApiResponse } from '@/server-handlers/rays'

interface ClaimRaysTitleProps {
  userAddress?: string
  pointsEarnedPerYear?: number
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

export const ClaimRaysTitle = ({
  userAddress,
  userRays,
  pointsEarnedPerYear,
}: ClaimRaysTitleProps) => {
  if (!userAddress || typeof userRays?.rays?.allPossiblePoints === 'undefined') {
    return (
      <Text as="h1" variant="h1" style={{ marginTop: 'var(--space-xxl)' }}>
        Claim your $RAYS
      </Text>
    )
  }

  return (
    <>
      <Text as="h2" variant="h2">
        Wallet {formatAddress(userAddress)} is eligible for{' '}
        {userRays.rays.allPossiblePoints > 0 ? `up to` : ''}{' '}
        {formatCryptoBalance(new BigNumber(userRays.rays.allPossiblePoints))} $RAYS
      </Text>
      {!!pointsEarnedPerYear && (
        <Text
          as="h3"
          variant="h3colorful"
          style={{
            marginTop: 'var(--space-m)',
            marginBottom: 'var(--space-m)',
          }}
        >
          + earning {formatCryptoBalance(new BigNumber(pointsEarnedPerYear))} $RAYS a year
        </Text>
      )}
    </>
  )
}
