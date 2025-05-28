import { type ReactNode } from 'react'
import { type EarnAppConfigType } from '@summerfi/app-types'
import clsx from 'clsx'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { INTERNAL_LINKS } from '@/helpers/application-links.ts'

import navigationActionsStyles from '@/components/layout/Navigation/NavigationActions.module.css'

interface NavigationActionsProps {
  signUpComponent?: ReactNode
  walletConnectionComponent?: ReactNode
  configComponent?: ReactNode
  toggleMobileMenu: () => void
  startTheGame?: () => void
  featuresConfig?: EarnAppConfigType['features']
}

export const NavigationActions = ({
  walletConnectionComponent,
  signUpComponent,
  toggleMobileMenu,
  configComponent,
  startTheGame,
  featuresConfig,
}: NavigationActionsProps): React.ReactNode => {
  const beachClubEnabled = !!featuresConfig?.BeachClub

  return (
    <div>
      <div className={navigationActionsStyles.navigationActionsWrapper}>
        {startTheGame && (
          <div onClick={startTheGame} className={navigationActionsStyles.theGameButton}>
            <Icon iconName="gamepad" size={22} />
          </div>
        )}
        {beachClubEnabled && (
          <Link href={INTERNAL_LINKS.beachClub} target="_blank">
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
        {signUpComponent}
        {walletConnectionComponent}
        {configComponent}
      </div>
      <div className={navigationActionsStyles.mobileMenuButton}>
        <Button
          variant="secondaryMedium"
          onClick={toggleMobileMenu}
          className={navigationActionsStyles.gradientOuterCircle}
        >
          <div className={navigationActionsStyles.gradientInnerCircle} />
          <Icon iconName="menu" size={28} color="var(--earn-protocol-secondary-70)" />
        </Button>
        {configComponent}
      </div>
    </div>
  )
}
