import classNames from 'classnames'

import { Button } from '@/components/atoms/Button/Button'
import { LoadingSpinner } from '@/components/molecules/Loader/Loader'

import navigationActionStyles from '@/components/layout/Navigation/NavigationActions.module.scss'

interface NavigationActionsProps {
  walletConnectionComponent?: React.ReactNode
  raysCountComponent?: React.ReactNode
}

export const NavigationActions = ({
  walletConnectionComponent,
  raysCountComponent,
}: NavigationActionsProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '8px' }}>
      {raysCountComponent}
      {walletConnectionComponent ?? (
        <div>
          <Button
            variant="secondarySmall"
            className={classNames(navigationActionStyles.walletButtonMock)}
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
        </div>
      )}
    </div>
  )
}
