import { Fragment } from 'react/jsx-runtime'
import clsx from 'clsx'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'
import { NavigationItems } from '@/components/layout/Navigation/NavigationItems'

import navigationStyles from '@/components/layout/Navigation/Navigation.module.scss'
import navigationMenuMobileStyles from '@/components/layout/Navigation/NavigationMenuMobile.module.scss'

type NavigationMobileMenuType = {
  links: EarnNavigationProps['links']
  currentPath?: string
  mobileMenuOpened?: boolean
  toggleMobileMenu: () => void
  logo: string
}

export const NavigationMenuMobile = ({
  links,
  currentPath,
  mobileMenuOpened,
  toggleMobileMenu,
  logo,
}: NavigationMobileMenuType) => {
  return (
    <div
      className={clsx(navigationMenuMobileStyles.menuMobileOverflow, {
        [navigationMenuMobileStyles.overflowActive]: mobileMenuOpened,
      })}
    >
      <div
        className={clsx(navigationMenuMobileStyles.menuMobileWrapper, {
          [navigationMenuMobileStyles.active]: mobileMenuOpened,
        })}
      >
        <div className={navigationMenuMobileStyles.topBar}>
          <img src={logo} alt="Summer.fi" className={navigationStyles.logo} />
          <div onClick={toggleMobileMenu} className={navigationMenuMobileStyles.closeIcon}>
            <Icon iconName="close" color="white" size={24} />
          </div>
        </div>
        <div className={navigationMenuMobileStyles.linksList}>
          {links?.map((link) =>
            link.link ? (
              <Link
                key={`Mobile_${link.id}`}
                href={link.link}
                className={clsx({
                  [navigationMenuMobileStyles.activeLink]: currentPath === link.link,
                })}
              >
                <Text as="p" variant="h5">
                  {link.label}
                </Text>
              </Link>
            ) : (
              <Fragment key={`Mobile_${link.id}`}>
                <Text as="p" variant="h5">
                  {link.label}
                </Text>
                {link.itemsList && (
                  <NavigationItems currentPath={currentPath} items={link.itemsList} />
                )}
                {link.dropdownContent}
              </Fragment>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
