import clsx from 'clsx'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { LoadingSpinner } from '@/components/molecules/Loader/Loader'

import navigationActionsStyles from '@/components/layout/Navigation/NavigationActions.module.scss'

interface NavigationActionsProps {
  walletConnectionComponent?: React.ReactNode
  raysCountComponent?: React.ReactNode
  toggleMobileMenu: () => void
}

export const NavigationActions = ({
  walletConnectionComponent,
  raysCountComponent,
  toggleMobileMenu,
}: NavigationActionsProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '8px' }}>
      {raysCountComponent}
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
      <div className={navigationActionsStyles.buttonMockWrapper}>
        {walletConnectionComponent ?? (
          <Button
            variant="secondarySmall"
            className={clsx(
              navigationActionsStyles.walletButtonMock,
              navigationActionsStyles.buttonWhite,
            )}
          >
            <LoadingSpinner
              size={24}
              color="var(--color-interactive-50)"
              style={{
                marginRight: 'var(--general-space-64)',
                marginLeft: 'var(--general-space-64)',
              }}
            />
          </Button>
        )}
      </div>
    </div>
  )
}
