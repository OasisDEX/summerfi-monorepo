import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'

import navigationMenuMobileStyles from '@/components/layout/Navigation/NavigationMenuMobile.module.scss'

type NavigationMobileMenuType = {
  links: EarnNavigationProps['links']
  currentPath?: string
}

export const NavigationMenuMobile = ({ links, currentPath }: NavigationMobileMenuType) => {
  return (
    <div className={navigationMenuMobileStyles.menuMobileWrapper}>
      <pre>{JSON.stringify({ currentPath }, null, 2)}</pre>
    </div>
  )
}
