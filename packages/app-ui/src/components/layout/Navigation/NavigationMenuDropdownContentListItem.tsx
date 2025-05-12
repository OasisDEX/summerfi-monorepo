import { type NavigationMenuPanelList } from '@summerfi/app-types'
import { IconStarFilled } from '@tabler/icons-react'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'
import { NavigationMenuDropdownContentIcon } from '@/components/layout/Navigation/NavigationMenuDropdownContentIcon'

import navigationMenuDropdownContentListItemStyles from './NavigationMenuDropdownContentListItem.module.css'

type NavigationMenuDropdownContentListItemProps = {
  onClick?: () => void
} & (NavigationMenuPanelList['items'] extends readonly (infer ElementType)[] ? ElementType : never)

export function NavigationMenuDropdownContentListItem({
  description,
  protocolName,
  icon,
  onClick,
  promoted,
  tags,
  title,
}: NavigationMenuDropdownContentListItemProps): React.ReactNode {
  return (
    <div
      className={
        navigationMenuDropdownContentListItemStyles.navigationMenuDropdownContentListItemWrapper
      }
      {...(onClick && { onClick })}
    >
      {icon && icon.position === 'global' && <NavigationMenuDropdownContentIcon {...icon} />}
      <div>
        <div
          className={
            navigationMenuDropdownContentListItemStyles.navigationMenuDropdownContentListItem
          }
        >
          {icon && icon.position === 'title' && <NavigationMenuDropdownContentIcon {...icon} />}
          <Text
            as="h3"
            variant="p3semi"
            data-value={title}
            className={clsx(
              navigationMenuDropdownContentListItemStyles.navigationMenuDropdownContentListItemTitle,
              navigationMenuDropdownContentListItemStyles[
                `navigationMenuDropdownContentListItemTitleGradient${protocolName}` as keyof typeof navigationMenuDropdownContentListItemStyles
              ],
              {
                'heading-with-effect': protocolName,
              },
            )}
          >
            {promoted && (
              <span
                className={clsx(
                  'star-with-effect',
                  navigationMenuDropdownContentListItemStyles.starTransition,
                )}
              >
                <IconStarFilled size={16} />
              </span>
            )}
            {title}
          </Text>
        </div>
        {description && (
          <Text
            variant="p4"
            className={
              navigationMenuDropdownContentListItemStyles.navigationMenuDropdownContentListItemDescription
            }
          >
            {typeof description === 'string' ? (
              <span dangerouslySetInnerHTML={{ __html: description.replace(/\n/giu, '<br />') }} />
            ) : (
              description
            )}
          </Text>
        )}
        {tags && (
          <ul
            className={
              navigationMenuDropdownContentListItemStyles.navigationMenuDropdownContentListItemTags
            }
          >
            {tags.map((tag, i) => (
              <li
                key={i}
                className={clsx(
                  navigationMenuDropdownContentListItemStyles.navigationMenuDropdownContentListItemTagsLi,
                  {
                    [navigationMenuDropdownContentListItemStyles.navigationMenuDropdownContentListItemTagsLiNotFirst]:
                      i > 0,
                    [navigationMenuDropdownContentListItemStyles.navigationMenuDropdownContentListItemTagsLiArrayTag]:
                      Array.isArray(tag),
                  },
                )}
                data-value={Array.isArray(tag) ? tag[0] : tag}
              >
                <Text variant="p4">{Array.isArray(tag) ? tag[0] : tag}</Text>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
