import { type FC } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { INTERNAL_LINKS } from '@/helpers/application-links'

import navigationActionsStyles from '@/components/layout/Navigation/NavigationActions.module.css'

interface NavigationExtraComponentsProps {
  beachClubEnabled?: boolean
  isEarnApp?: boolean
  userWalletAddress?: string
}

export const NavigationExtraComponents: FC<NavigationExtraComponentsProps> = ({
  beachClubEnabled,
  isEarnApp,
  userWalletAddress,
}) => {
  const host = typeof window !== 'undefined' ? window.location.origin : ''

  const resolvedBeachClubLink =
    isEarnApp && userWalletAddress
      ? `/portfolio/${userWalletAddress}?tab=beach-club`
      : `${host}${INTERNAL_LINKS.beachClub}`

  return (
    <>
      {beachClubEnabled && (
        <Link href={resolvedBeachClubLink}>
          <Text
            as="div"
            variant="p2semiColorfulBeachClub"
            className={clsx(navigationActionsStyles.summerProButton)}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
          >
            Beach club <Icon iconName="beach_club_icon" size={24} />
          </Text>
        </Link>
      )}
      <Link href={INTERNAL_LINKS.summerPro} target="_blank">
        <Text as="p" variant="p2semi" className={clsx(navigationActionsStyles.summerProButton)}>
          Summer.fi Pro
        </Text>
      </Link>
    </>
  )
}
