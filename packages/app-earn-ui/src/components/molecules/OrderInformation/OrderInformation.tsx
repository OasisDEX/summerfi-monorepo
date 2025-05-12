import { type CSSProperties, type FC, isValidElement, type ReactNode } from 'react'
import clsx from 'clsx'

import { Card } from '@/components/atoms/Card/Card'
import { Expander } from '@/components/atoms/Expander/Expander'
import { Icon } from '@/components/atoms/Icon/Icon'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import classNames from './OrderInformation.module.css'

type OrderInformationItem = {
  label: string
  tooltip?: string
  value: ReactNode
  isLoading?: boolean
}

type OrderInformationItemGroup = {
  label: string
  tooltip?: string
  items: OrderInformationItem[]
}

interface OrderInformationProps {
  title?: ReactNode
  items: (OrderInformationItem | OrderInformationItemGroup)[]
  wrapperStyles?: CSSProperties
}

export const OrderInformation: FC<OrderInformationProps> = ({ title, items, wrapperStyles }) => {
  return (
    <Card className={classNames.orderInformationWrapper} style={wrapperStyles}>
      {title &&
        (typeof title === 'string' ? (
          <Text variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            {title}
          </Text>
        ) : isValidElement(title) ? (
          title
        ) : (
          <Text variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            {title}
          </Text>
        ))}

      <ul className={classNames.orderInformationList}>
        {items.map((item) => {
          if ('items' in item) {
            return (
              <li key={item.label} className={classNames.listItem}>
                <Expander
                  title={item.label}
                  expanderButtonStyles={{
                    justifyContent: 'flex-start',
                    fontSize: '14px',
                    color: 'var(--earn-protocol-secondary-60)',
                    fontWeight: 600,
                    padding: '0',
                  }}
                  expanderChevronStyles={{
                    marginLeft: 'var(--general-space-8)',
                  }}
                  iconVariant="xxs"
                >
                  <ul
                    className={clsx(
                      classNames.orderInformationList,
                      classNames.orderInformationListInExpander,
                    )}
                  >
                    {item.items.map((nestedItem) => (
                      <li key={nestedItem.label} className={classNames.listItem}>
                        <Text
                          variant="p3semi"
                          style={{ color: 'var(--earn-protocol-secondary-60)' }}
                          className={classNames.label}
                        >
                          {nestedItem.label}
                        </Text>
                        <Text
                          variant="p3semi"
                          style={{ color: 'var(--earn-protocol-secondary-100)' }}
                        >
                          {nestedItem.isLoading ? (
                            <SkeletonLine width="80px" height="14px" />
                          ) : (
                            nestedItem.value
                          )}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </Expander>
              </li>
            )
          }

          return (
            <li key={item.label} className={classNames.listItem}>
              <Text
                variant="p3semi"
                style={{ color: 'var(--earn-protocol-secondary-60)' }}
                className={classNames.label}
              >
                {item.label}
                {item.tooltip && (
                  <Tooltip tooltip={item.tooltip} tooltipWrapperStyles={{ minWidth: '200px' }}>
                    <Icon iconName="question_o" size={16} />
                  </Tooltip>
                )}
              </Text>
              <Text variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                {item.isLoading ? <SkeletonLine width="80px" height="14px" /> : item.value}
              </Text>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
