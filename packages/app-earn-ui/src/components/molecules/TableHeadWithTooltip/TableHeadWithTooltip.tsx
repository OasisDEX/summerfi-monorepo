import { type FC, type ReactNode } from 'react'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

interface HoverableIconWithTextProps {
  tooltipOpen: boolean
  title: string
}

const HoverableIconWithText: FC<HoverableIconWithTextProps> = ({ title, tooltipOpen }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-2x-small)' }}>
      <Text
        as="p"
        variant="p4semi"
        style={{
          color: `var(${tooltipOpen ? '--earn-protocol-secondary-100' : '--earn-protocol-secondary-40'})`,
        }}
      >
        {title}{' '}
      </Text>
      <Icon
        iconName="question_o"
        color={tooltipOpen ? 'rgba(255, 251, 253, 1)' : 'rgba(119, 117, 118, 1)'}
        variant="xs"
      />
    </div>
  )
}

interface TableHeadWithTooltipProps {
  title: string
  tooltip: ReactNode
  minWidth: string
}

export const TableHeadWithTooltip: FC<TableHeadWithTooltipProps> = ({
  title,
  tooltip,
  minWidth,
}) => {
  return (
    <Tooltip tooltipWrapperStyles={{ minWidth }} tooltip={tooltip}>
      {(tooltipOpen) => <HoverableIconWithText title={title} tooltipOpen={tooltipOpen} />}
    </Tooltip>
  )
}
