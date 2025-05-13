import { type NavigationMenuPanelList, type WithNavigationModules } from '@summerfi/app-types'
import clsx from 'clsx'
import Link from 'next/link'

import { ProxyLinkComponent } from '@/components/atoms/ProxyLinkComponent/ProxyLinkComponent'
import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { NavigationMenuDropdownContentListItem } from '@/components/layout/Navigation/NavigationMenuDropdownContentListItem'

import navigationMenuDropdownContentListStyles from './NavigationMenuDropdownContentList.module.css'

type NavigationMenuDropdownContentListProps = NavigationMenuPanelList & {
  parentIndex?: number
  selected?: [number, number]
  onClick?: (selected: [number, number]) => void
  onSelect?: (selected: [number, number]) => void
} & WithNavigationModules

export const NavigationMenuDropdownContentList = ({
  header,
  items,
  link,
  parentIndex,
  selected,
  tight,
  navigationModules,
  onClick,
  onSelect,
}: NavigationMenuDropdownContentListProps): React.ReactNode => (
  <>
    {header && (
      <Text
        variant="p4semi"
        className={navigationMenuDropdownContentListStyles.navigationMenuDropdownContentListHeader}
      >
        {header}
      </Text>
    )}
    <ul
      className={navigationMenuDropdownContentListStyles.navigationMenuDropdownContentListWrapper}
    >
      {items.map(({ protocolName, url, navigationModule, ...item }, i) => (
        <li
          key={i}
          className={clsx(
            navigationMenuDropdownContentListStyles.navigationMenuDropdownContentListWrapperItem,
            {
              [navigationMenuDropdownContentListStyles.itemHoverEffectDefault]:
                selected?.[0] === parentIndex && selected?.[1] === i,
              [navigationMenuDropdownContentListStyles.itemHoverEffectHover]:
                url ?? onClick ?? navigationModule,
            },
          )}
          onClick={() => {
            if (onClick) {
              onClick([parentIndex ?? 0, i])
            }
          }}
          onMouseEnter={() => {
            if (parentIndex !== undefined && onSelect) {
              onSelect([parentIndex, i])
            }
          }}
        >
          {url ? (
            <Link passHref legacyBehavior prefetch={false} href={url}>
              <ProxyLinkComponent
                className={clsx(
                  navigationMenuDropdownContentListStyles.navigationMenuDropdownContentListWrapperItemLink,
                  {
                    [navigationMenuDropdownContentListStyles.navigationMenuDropdownContentListWrapperItemLinkTight]:
                      tight,
                  },
                )}
              >
                <NavigationMenuDropdownContentListItem protocolName={protocolName} {...item} />
              </ProxyLinkComponent>
            </Link>
          ) : (
            <div
              className={clsx(
                navigationMenuDropdownContentListStyles.navigationMenuDropdownContentListWrapperItemLink,
                {
                  [navigationMenuDropdownContentListStyles.navigationMenuDropdownContentListWrapperItemLinkTight]:
                    tight,
                },
              )}
            >
              {navigationModule && navigationModules ? (
                {
                  swap: navigationModules.NavigationModuleSwap,
                  bridge: navigationModules.NavigationModuleBridge,
                }[navigationModule]
              ) : (
                <NavigationMenuDropdownContentListItem protocolName={protocolName} {...item} />
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
    {link && (
      <Link passHref legacyBehavior prefetch={false} href={link.url}>
        <ProxyLinkComponent
          style={{
            marginLeft: 3,
            marginRight: 'auto',
            display: 'inline-block',
          }}
        >
          <WithArrow
            gap={1}
            style={{
              color: 'var(--color-interactive-100)',
            }}
          >
            <Text variant="p4">{link.label}</Text>
          </WithArrow>
        </ProxyLinkComponent>
      </Link>
    )}
  </>
)
