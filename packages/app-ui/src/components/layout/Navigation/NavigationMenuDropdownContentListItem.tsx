import { IconStar } from '@tabler/icons-react'
import classNames from 'classNames'

import { Text } from '@/components/atoms/Text/Text'
import { NavigationMenuPanelList } from '@/components/layout/Navigation/Navigation.types'
import { NavigationMenuDropdownContentIcon } from '@/components/layout/Navigation/NavigationMenuDropdownContentIcon'

import navigationMenuDropdownContentListItemStyles from './NavigationMenuDropdownContentListItem.module.scss'

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
}: NavigationMenuDropdownContentListItemProps) {
  const textHoverEffect = {
    content: 'attr(data-value)',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    transition: 'opacity 200ms',
    WebkitBackgroundClip: 'text',
  }

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
            className={classNames(
              navigationMenuDropdownContentListItemStyles.navigationMenuDropdownContentListItemTitle,
              navigationMenuDropdownContentListItemStyles[
                `navigationMenuDropdownContentListItemTitle${protocolName}` as keyof typeof navigationMenuDropdownContentListItemStyles
              ],
              {
                'heading-with-effect': protocolName,
              },
            )}
          >
            {promoted && (
              <span
                className={classNames(
                  'star-with-effect',
                  navigationMenuDropdownContentListItemStyles.starTransition,
                )}
              >
                <IconStar size={16} />
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
        {/* {tags && (
          <Flex as="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
            {tags.map((tag, i) => (
              <Box
                key={i}
                as="li"
                variant="text.paragraph4"
                {...(Array.isArray(tag) && {
                  'data-value': tag[0],
                  className: 'tag-with-effect',
                })}
                sx={
                  {
                    color: 'neutral80',
                    ...(i > 0 && {
                      ml: 3,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 2,
                        left: '-10px',
                        width: 1,
                        height: 1,
                        backgroundColor: 'neutral80',
                        borderRadius: 'ellipse',
                      },
                    }),
                    ...(Array.isArray(tag) && {
                      position: 'relative',
                      transition: 'color 200ms',
                      '&::after': {
                        ...textHoverEffect,
                        backgroundImage: tag[1],
                      },
                    }),
                  } as ThemeUIStyleObject
                }
              >
                {Array.isArray(tag) ? tag[0] : tag}
              </Box>
            ))}
          </Flex>
        )} */}
      </div>
    </div>
  )
}
