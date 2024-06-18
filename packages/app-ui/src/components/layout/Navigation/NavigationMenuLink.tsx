import classNames from 'classnames'
import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'
import { NavigationMenuPanelLinkProps } from '@/components/layout/Navigation/Navigation.types'
import { ProxyLinkComponent } from '@/components/layout/Navigation/ProxyLinkComponent'

import navigationMenuStyles from '@/components/layout/Navigation/NavigationMenu.module.scss'

export function NavigationMenuLink({
  label,
  link,
  onClick,
  onMouseEnter,
  currentPath,
}: NavigationMenuPanelLinkProps) {
  return (
    <li className={navigationMenuStyles.navigationMenuLink} onMouseEnter={onMouseEnter}>
      {link && (
        <Link passHref legacyBehavior href={link}>
          <ProxyLinkComponent
            className={classNames(navigationMenuStyles.navigationMenuLinkElement, {
              [navigationMenuStyles.navigationMenuLinkElementActive]: currentPath === link,
            })}
          >
            <Text as="span" variant="p3semi">
              {label}
            </Text>
          </ProxyLinkComponent>
        </Link>
      )}
      {onClick && (
        <Text
          as="span"
          variant="p3semi"
          onClick={onClick}
          className={navigationMenuStyles.navigationMenuLinkElementOnClick}
        >
          {label}
        </Text>
      )}
    </li>
  )
}
