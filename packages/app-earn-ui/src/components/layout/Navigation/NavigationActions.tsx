import { type ReactNode } from 'react'
import clsx from 'clsx'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'

import navigationActionsStyles from '@/components/layout/Navigation/NavigationActions.module.css'

interface NavigationActionsProps {
  extraComponents?: ReactNode
  signUpComponent?: ReactNode
  walletConnectionComponent?: ReactNode
  configComponent?: ReactNode
  toggleMobileMenu: () => void
}

export const NavigationActions = ({
  walletConnectionComponent,
  extraComponents,
  signUpComponent,
  toggleMobileMenu,
  configComponent,
}: NavigationActionsProps): React.ReactNode => {
  return (
    <div>
      <div className={navigationActionsStyles.navigationActionsWrapper}>
        {extraComponents}
        {signUpComponent}
        {walletConnectionComponent}
        {configComponent}
      </div>
      <div className={navigationActionsStyles.mobileMenuButton}>
        <Button
          variant="secondaryMedium"
          onClick={toggleMobileMenu}
          className={clsx(
            navigationActionsStyles.gradientOuterCircle,
            navigationActionsStyles.gradientInnerCircle,
          )}
        >
          <Icon
            iconName="menu"
            size={26}
            color="var(--earn-protocol-secondary-70)"
            style={{ zIndex: 1 }}
          />
        </Button>
        {configComponent}
      </div>
    </div>
  )
}
