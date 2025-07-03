import { type CSSProperties, type FC, type ReactNode } from 'react'

import { Icon } from '@/components/atoms/Icon/Icon'
import { List } from '@/components/atoms/List/List'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

interface SidebarFootnoteProps {
  title: ReactNode
  list: ReactNode[]
  tooltip: {
    style?: CSSProperties
    showAbove?: boolean
  }
}

export const SidebarFootnote: FC<SidebarFootnoteProps> = ({ title, list, tooltip }) => {
  return (
    <Tooltip
      tooltip={
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text
            as="p"
            variant="p2semi"
            style={{
              marginBottom: 'var(--spacing-space-medium)',
              color: 'var(--color-text-primary)',
            }}
          >
            {title}
          </Text>
          <List list={list} itemIcon="checkmark" />
        </div>
      }
      tooltipWrapperStyles={tooltip.style}
      showAbove={tooltip.showAbove}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon iconName="question_o" variant="xs" color="rgba(255, 73, 164, 1)" />
        <Text
          as="p"
          variant="p4semi"
          style={{
            color: 'var(--earn-protocol-primary-100)',
            marginLeft: 'var(--spacing-space-2x-small)',
          }}
        >
          {title}
        </Text>
      </div>
    </Tooltip>
  )
}
