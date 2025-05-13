import { type FC } from 'react'
import clsx from 'clsx'

import navigationStyles from '@/components/layout/Navigation/Navigation.module.css'

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
      className={clsx(navigationStyles.logoWrapper)}
      onClick={onLogoClick}
      style={{
        cursor: onLogoClick ? 'pointer' : 'default',
        position: 'relative',
        top: '-2px',
      }}
    >
      <img src={logo} alt="Summer.fi" className={navigationStyles.logo} />
      <img src={logoSmall} alt="Summer.fi" className={navigationStyles.logoSmall} />
    </div>
  )
}
