import clsx from 'clsx'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { INTERNAL_LINKS } from '@/helpers/application-links.ts'

import navigationActionsStyles from '@/components/layout/Navigation/NavigationActions.module.scss'

interface NavigationActionsProps {
  signUpComponent?: React.ReactNode
  walletConnectionComponent?: React.ReactNode
  toggleMobileMenu: () => void
}

export const NavigationActions = ({
  walletConnectionComponent,
  signUpComponent,
  toggleMobileMenu,
}: NavigationActionsProps) => {
  return (
    <div>
      <div className={navigationActionsStyles.navigationActionsWrapper}>
        <Link href={INTERNAL_LINKS.summerPro}>
          <Text as="p" variant="p3semi" className={clsx(navigationActionsStyles.summerProButton)}>
            Summer.fi Pro
          </Text>
        </Link>
        {signUpComponent}
        {walletConnectionComponent}
      </div>
      <div className={navigationActionsStyles.mobileMenuButton}>
        <Button
          variant="secondarySmall"
          onClick={toggleMobileMenu}
          className={navigationActionsStyles.gradientOuterCircle}
        >
          <div className={navigationActionsStyles.gradientInnerCircle} />
          <Icon iconName="menu" size={24} color="var(--earn-protocol-secondary-70)" />
        </Button>
      </div>
    </div>
  )
}
