import clsx from 'clsx'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { LoadingSpinner } from '@/components/molecules/Loader/Loader'

import navigationActionStyles from '@/components/layout/Navigation/NavigationActions.module.scss'

interface NavigationActionsProps {
  walletConnectionComponent?: React.ReactNode
  raysCountComponent?: React.ReactNode
  toggleMobileMenu: () => void
}

export const NavigationActions = ({
  walletConnectionComponent,
  raysCountComponent,
  toggleMobileMenu,
}: NavigationActionsProps): React.ReactNode => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '8px' }}>
      {raysCountComponent}
      <div className={navigationActionStyles.mobileMenuButton}>
        <Button
          variant="secondarySmall"
          className={clsx(navigationActionStyles.buttonWhite, navigationActionStyles.buttonShadow)}
          onClick={toggleMobileMenu}
          style={{ padding: '10px', width: '40px', height: '40px' }}
        >
          <Icon iconName="menu" size={20} />
        </Button>
      </div>
      <div className={navigationActionStyles.buttonMockWrapper}>
        {walletConnectionComponent ?? (
          <Button
            variant="secondarySmall"
            className={clsx(
              navigationActionStyles.walletButtonMock,
              navigationActionStyles.buttonWhite,
            )}
          >
            <LoadingSpinner
              size={24}
              color="var(--color-interactive-50)"
              style={{
                marginRight: 'var(--space-xxl)',
                marginLeft: 'var(--space-xxl)',
              }}
            />
          </Button>
        )}
      </div>
    </div>
  )
}
