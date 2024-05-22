import { FC } from 'react'

import { NavigationBranding } from '@/components/layout/Navigation/NavigationBranding'

import navigationStyles from '@/components/layout/Navigation/Navigation.module.scss'

interface NavigationProps {
  logo: string
  logoSmall: string
}

export const Navigation: FC<NavigationProps> = ({ logo, logoSmall }) => {
  return (
    <div className={navigationStyles.wrapper}>
      <header className={navigationStyles.container}>
        <NavigationBranding logo={logo} logoSmall={logoSmall} />
        <div>qwe</div>
        <div>zxc</div>
      </header>
    </div>
  )
}
