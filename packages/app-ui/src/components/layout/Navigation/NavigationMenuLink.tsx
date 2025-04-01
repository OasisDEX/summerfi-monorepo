'use client'
import { useEffect, useState } from 'react'
import { type NavigationMenuPanelLinkProps } from '@summerfi/app-types'
import clsx from 'clsx'
import Link from 'next/link'

import { ProxyLinkComponent } from '@/components/atoms/ProxyLinkComponent/ProxyLinkComponent'
import { Text } from '@/components/atoms/Text/Text'

import navigationMenuStyles from '@/components/layout/Navigation/NavigationMenu.module.scss'

export function NavigationMenuLink({
  label,
  link,
  onClick,
  onMouseEnter,
  currentPath,
}: NavigationMenuPanelLinkProps): React.ReactNode {
  // SSR hack
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }
  // SSR hack

  return (
    <li className={navigationMenuStyles.navigationMenuLink} onMouseEnter={onMouseEnter}>
      {link && (
        <Link passHref legacyBehavior prefetch={false} href={link}>
          <ProxyLinkComponent
            className={clsx(navigationMenuStyles.navigationMenuLinkElement, {
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
