import { FC } from 'react'

import navigationStyles from '@/components/layout/Navigation/Navigation.module.scss'

type NavigationBrandingProps = {
  logo: string
  logoSmall: string
}

export const NavigationBranding: FC<NavigationBrandingProps> = ({ logo, logoSmall }) => {
  return (
    <div className={navigationStyles.logoWrapper}>
      <img src={logo} alt="Summer.fi" className={navigationStyles.logo} />
      <img src={logoSmall} alt="Summer.fi" className={navigationStyles.logoSmall} />
    </div>
  )
}
