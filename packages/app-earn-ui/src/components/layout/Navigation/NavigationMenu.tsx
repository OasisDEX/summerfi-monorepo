'use client'

import clsx from 'clsx'
import Link from 'next/link'

import { Icon } from '@/components/atoms/Icon/Icon'
import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'
import { NavigationItems } from '@/components/layout/Navigation/NavigationItems'

import navigationMenuStyles from '@/components/layout/Navigation/NavigationMenu.module.css'

type NavigationMenuType = {
  links: EarnNavigationProps['links']
  currentPath?: string
}

export const NavigationMenu = ({ links, currentPath }: NavigationMenuType): React.ReactNode => {
  return (
    <div className={navigationMenuStyles.navigationMenu}>
      <ul className={navigationMenuStyles.navigationMenuLinks}>
        {links?.map((link) => (
          <li
            key={`MenuLinkLabel-${link.id}`}
            className={clsx({
              [navigationMenuStyles.disabled]: link.disabled,
            })}
          >
            {link.itemsList ?? link.dropdownContent ? (
              <span
                className={clsx({
                  [navigationMenuStyles.active]: link.link === currentPath,
                })}
              >
                {link.label}{' '}
                <Icon
                  style={{ marginLeft: '4px', display: 'inline' }}
                  iconName="chevron_down"
                  size={13}
                />
              </span>
            ) : (
              <Link
                href={link.disabled ? '' : link.link ?? '/'}
                className={clsx({
                  [navigationMenuStyles.active]: link.link === currentPath,
                })}
                prefetch={!(link.disabled ?? link.prefetchDisabled)}
                onClick={link.onClick}
                target={link.target}
              >
                {link.label}
              </Link>
            )}
            {!link.disabled
              ? (link.itemsList ?? link.dropdownContent) && (
                  <div className={navigationMenuStyles.dropdownContentWrapper}>
                    <div className={navigationMenuStyles.dropdownContent}>
                      {link.itemsList && (
                        <NavigationItems items={link.itemsList} currentPath={currentPath} />
                      )}
                      {link.dropdownContent}
                    </div>
                  </div>
                )
              : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
