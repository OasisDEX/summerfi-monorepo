/* eslint-disable no-magic-numbers */
import classNames from 'classNames'
import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { NavigationMenuPanelList } from '@/components/layout/Navigation/Navigation.types'
import { NavigationMenuDropdownContentListItem } from '@/components/layout/Navigation/NavigationMenuDropdownContentListItem'

import navigationMenuDropdownContentListStyles from './NavigationMenuDropdownContentList.module.scss'

type NavigationMenuDropdownContentListProps = NavigationMenuPanelList & {
  parentIndex?: number
  selected?: [number, number]
  onClick?: (selected: [number, number]) => void
  onSelect?: (selected: [number, number]) => void
}

export const NavigationMenuDropdownContentList = ({
  header,
  items,
  link,
  onClick,
  onSelect,
  parentIndex,
  selected,
  tight,
}: NavigationMenuDropdownContentListProps) => {
  return (
    <>
      {header && (
        <Text
          variant="p4"
          className={
            navigationMenuDropdownContentListStyles.navigationMenuDropdownContentListHeader
          }
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
            className={classNames(
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
              <Link
                href={url}
                className={classNames(
                  navigationMenuDropdownContentListStyles.navigationMenuDropdownContentListWrapperItemLink,
                  {
                    [navigationMenuDropdownContentListStyles.navigationMenuDropdownContentListWrapperItemLinkTight]:
                      tight,
                  },
                )}
              >
                <NavigationMenuDropdownContentListItem protocolName={protocolName} {...item} />
              </Link>
            ) : (
              <div
                className={classNames(
                  navigationMenuDropdownContentListStyles.navigationMenuDropdownContentListWrapperItemLink,
                  {
                    [navigationMenuDropdownContentListStyles.navigationMenuDropdownContentListWrapperItemLinkTight]:
                      tight,
                  },
                )}
              >
                <NavigationMenuDropdownContentListItem protocolName={protocolName} {...item} />
                {/* {navigationModule ? (
                  <>
                    {
                      {
                        swap: <NavigationModuleSwap />,
                        bridge: <NavigationModuleBridge />,
                      }[navigationModule]
                    }
                  </>
                ) : (
                  <NavigationMenuDropdownContentListItem protocolName={protocolName} {...item} />
                )} */}
              </div>
            )}
          </li>
        ))}
      </ul>
      {link && (
        <Link
          href={link.url}
          style={{
            marginLeft: 3,
            marginRight: 'auto',
            display: 'inline-block',
          }}
        >
          <WithArrow
            gap={1}
            style={{
              fontSize: 1,
              color: 'var(--color-primary-100)',
            }}
          >
            {link.label}
          </WithArrow>
        </Link>
      )}
    </>
  )
}
