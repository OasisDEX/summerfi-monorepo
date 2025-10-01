import clsx from 'clsx'

import { Button } from '@/components/atoms/Button/Button'
import { Icon } from '@/components/atoms/Icon/Icon'
import { LoadingSpinner } from '@/components/molecules/Loader/Loader'

import navigationActionStyles from '@/components/layout/Navigation/NavigationActions.module.css'

interface NavigationActionsProps {
  walletConnectionComponent?: React.ReactNode
  toggleMobileMenu: () => void
}

export const NavigationActions = ({
  walletConnectionComponent,
  toggleMobileMenu,
}: NavigationActionsProps): React.ReactNode => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '8px' }}>
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
