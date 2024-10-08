import clsx from 'clsx'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { LoadingSpinner } from '@/components/molecules/Loader/Loader'

import navigationActionsStyles from '@/components/layout/Navigation/NavigationActions.module.scss'

interface NavigationActionsProps {
  walletConnectionComponent?: React.ReactNode
  toggleMobileMenu: () => void
}

export const NavigationActions = ({
  walletConnectionComponent,
  toggleMobileMenu,
}: NavigationActionsProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '8px' }}>
      <Link href="/">
        <Text as="p" variant="p3semi" className={clsx(navigationActionsStyles.summerProButton)}>
          Summer.fi Pro
        </Text>
      </Link>
      <div className={navigationActionsStyles.mobileMenuButton}>
        <Button
          variant="secondarySmall"
          className={clsx(navigationActionsStyles.buttonWhite)}
          onClick={toggleMobileMenu}
          style={{ padding: '10px', width: '40px', height: '40px' }}
        >
          <Icon iconName="menu" size={20} />
        </Button>
      </div>
      <Button variant="primarySmall">Sign up</Button>
      {walletConnectionComponent}
    </div>
  )
}
