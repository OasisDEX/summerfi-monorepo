import { FC } from 'react'
import classNames from 'classnames'

import navigationStyles from '@/components/layout/Navigation/Navigation.module.scss'

type NavigationBrandingProps = {
  logo: string
  logoSmall: string
  onLogoClick?: () => void
}

export const NavigationBranding: FC<NavigationBrandingProps> = ({
  logo,
  logoSmall,
  onLogoClick,
}) => {
  return (
    <div
      className={classNames(navigationStyles.logoWrapper)}
      onClick={onLogoClick}
      style={{
        cursor: onLogoClick ? 'pointer' : 'default',
      }}
    >
      <img src={logo} alt="Summer.fi" className={navigationStyles.logo} />
      <img src={logoSmall} alt="Summer.fi" className={navigationStyles.logoSmall} />
    </div>
  )
}
