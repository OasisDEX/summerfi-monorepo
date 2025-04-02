import { type ReactNode } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { INTERNAL_LINKS } from '@/helpers/application-links.ts'

import navigationActionsStyles from '@/components/layout/Navigation/NavigationActions.module.scss'

interface NavigationActionsProps {
  signUpComponent?: ReactNode
  walletConnectionComponent?: ReactNode
  configComponent?: ReactNode
  toggleMobileMenu: () => void
}

export const NavigationActions = ({
  walletConnectionComponent,
  signUpComponent,
  toggleMobileMenu,
  configComponent,
}: NavigationActionsProps): React.ReactNode => {
  return (
    <div>
      <div className={navigationActionsStyles.navigationActionsWrapper}>
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
