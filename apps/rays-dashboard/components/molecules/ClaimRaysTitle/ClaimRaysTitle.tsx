import { type RaysApiResponse } from '@summerfi/app-types'
import { Text } from '@summerfi/app-ui'
import { formatAddress, formatCryptoBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import claimRaysTitleStyles from './ClaimRaysTitle.module.css'

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
      <Text as="h1" variant="h1" className={claimRaysTitleStyles.notConnectedHeader}>
        Claim your $RAYS
      </Text>
    )
  }

  return (
    <>
      <Text as="h1" variant="h1" className={claimRaysTitleStyles.connectedTitle}>
        Wallet {formatAddress(userAddress)} is&nbsp;eligible <br />
        for {userRays.rays.allPossiblePoints > 0 ? `up to` : ''}{' '}
        {formatCryptoBalance(new BigNumber(userRays.rays.allPossiblePoints))}&nbsp;$RAYS
      </Text>
      {!!pointsEarnedPerYear && (
        <Text as="h3" variant="h3colorful" className={claimRaysTitleStyles.earning}>
          +&nbsp;earning {formatCryptoBalance(new BigNumber(pointsEarnedPerYear))}
          &nbsp;$RAYS&nbsp;a&nbsp;year
        </Text>
      )}
    </>
  )
}
