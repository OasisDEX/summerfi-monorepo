import classNames from 'classnames'
import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'
import { NavigationMenuPanelLinkProps } from '@/components/layout/Navigation/Navigation.types'

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
        <Link
          href={link}
          className={classNames(navigationMenuStyles.navigationMenuLinkElement, {
            [navigationMenuStyles.navigationMenuLinkElementActive]: currentPath === link,
          })}
        >
          <Text as="span" variant="p3semi">
            {label}
          </Text>
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
