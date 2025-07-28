import { type ReactNode } from 'react'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'

import navigationActionsStyles from '@/components/layout/Navigation/NavigationActions.module.css'

interface NavigationActionsProps {
  extraComponents?: ReactNode
  signUpComponent?: ReactNode
  walletConnectionComponent?: ReactNode
  configComponent?: ReactNode
  toggleMobileMenu: () => void
  startTheGame?: () => void
}

export const NavigationActions = ({
  walletConnectionComponent,
  extraComponents,
  signUpComponent,
  toggleMobileMenu,
  configComponent,
  startTheGame,
}: NavigationActionsProps): React.ReactNode => {
  return (
    <div>
      <div className={navigationActionsStyles.navigationActionsWrapper}>
        {startTheGame && (
          <div onClick={startTheGame} className={navigationActionsStyles.theGameButton}>
            <Icon iconName="gamepad" size={22} />
          </div>
        )}
        {extraComponents}
        {signUpComponent}
        {walletConnectionComponent}
        {configComponent}
      </div>
      <div className={navigationActionsStyles.mobileMenuButton}>
        {startTheGame && (
          <div onClick={startTheGame} className={navigationActionsStyles.theGameButton}>
            <Icon iconName="gamepad" size={22} />
          </div>
        )}
        <Button
          variant="secondaryMedium"
          onClick={toggleMobileMenu}
          className={navigationActionsStyles.gradientOuterCircle}
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
