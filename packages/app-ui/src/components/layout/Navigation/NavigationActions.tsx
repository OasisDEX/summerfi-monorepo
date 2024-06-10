import classNames from 'classnames'

import { Button } from '@/components/atoms/Button/Button'
import { LoadingSpinner } from '@/components/molecules/Loader/Loader'

import navigationActionStyles from '@/components/layout/Navigation/NavigationActions.module.scss'

interface NavigationActionsProps {
  walletConnectionComponent?: React.ReactNode
}

export const NavigationActions = ({ walletConnectionComponent }: NavigationActionsProps) => {
  return (
    walletConnectionComponent ?? (
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
    )
  )
}
