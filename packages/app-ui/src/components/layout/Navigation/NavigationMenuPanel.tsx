import classNames from 'classnames'
import Link from 'next/link'

import { ProxyLinkComponent } from '@/components/atoms/ProxyLinkComponent/ProxyLinkComponent'
import { Text } from '@/components/atoms/Text/Text'
import { NavigationMenuPanelProps } from '@/components/layout/Navigation/Navigation.types'

import navigationMenuStyles from '@/components/layout/Navigation/NavigationMenu.module.scss'

function NavigationMenuPanelLabel({
  currentPanel,
  label,
  isPanelOpen,
}: Pick<NavigationMenuPanelProps, 'currentPanel' | 'label' | 'isPanelOpen'>) {
  return (
    <Text
      as="span"
      variant="p3semi"
      className={classNames(navigationMenuStyles.navigationMenuPanelLabel, {
        [navigationMenuStyles.navigationMenuPanelLabelActive]:
          isPanelOpen && currentPanel === label,
      })}
    >
      {label}
    </Text>
  )
}

export function NavigationMenuPanel({
  currentPanel,
  label,
  url,
  isPanelOpen,
  onMouseEnter,
}: NavigationMenuPanelProps) {
  return (
    <li
      className={navigationMenuStyles.navigationMenuPanel}
      onMouseEnter={(e) => {
        const target = e.target as HTMLDivElement
        const halfOffsetWidth = target.offsetWidth / 2

        onMouseEnter(target.offsetLeft + halfOffsetWidth)
      }}
    >
      {url ? (
        <Link href={url} passHref legacyBehavior prefetch={false}>
          <ProxyLinkComponent>
            <NavigationMenuPanelLabel
              currentPanel={currentPanel}
              label={label}
              isPanelOpen={isPanelOpen}
            />
          </ProxyLinkComponent>
        </Link>
      ) : (
        <NavigationMenuPanelLabel
          currentPanel={currentPanel}
          label={label}
          isPanelOpen={isPanelOpen}
        />
      )}
    </li>
  )
}
