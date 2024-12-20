'use client'

import clsx from 'clsx'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'
import { NavigationItems } from '@/components/layout/Navigation/NavigationItems'

import navigationMenuStyles from '@/components/layout/Navigation/NavigationMenu.module.scss'

type NavigationMenuType = {
  links: EarnNavigationProps['links']
  currentPath?: string
}

export const NavigationMenu = ({ links, currentPath }: NavigationMenuType) => {
  return (
    <div className={navigationMenuStyles.navigationMenu}>
      <ul className={navigationMenuStyles.navigationMenuLinks}>
        {links?.map((link) => (
          <li key={`MenuLinkLabel-${link.id}`}>
            {link.itemsList ?? link.dropdownContent ? (
              <span
                className={clsx({
                  [navigationMenuStyles.active]: link.link === currentPath,
                })}
              >
                {link.label}{' '}
                <Icon
                  style={{ marginLeft: '6px', display: 'inline' }}
                  color="white"
                  iconName="chevron_down"
                  size={13}
                />
              </span>
            ) : (
              <Link
                href={link.link ?? '/'}
                className={clsx({
                  [navigationMenuStyles.active]: link.link === currentPath,
                })}
                prefetch
              >
                {link.label}
              </Link>
            )}
            {(link.itemsList ?? link.dropdownContent) && (
              <div className={navigationMenuStyles.dropdownContentWrapper}>
                <div className={navigationMenuStyles.dropdownContent}>
                  {link.itemsList && (
                    <NavigationItems items={link.itemsList} currentPath={currentPath} />
                  )}
                  {link.dropdownContent}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
