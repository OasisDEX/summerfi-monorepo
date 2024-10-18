import clsx from 'clsx'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

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
        <Link href="/">
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
          style={{ padding: '10px', width: '45px', height: '45px' }}
        >
          <Icon iconName="menu" size={24} color="rgb(255 73 164)" />
        </Button>
      </div>
    </div>
  )
}
