import { Icon, Tooltip } from '@summerfi/app-earn-ui'
import { formatFiatBalance, formatShorthandNumber } from '@summerfi/app-utils'

export const rebalanceActivityHeading = {
  title: 'Lazy Summer Global Rebalance Activity',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam quis risus eget.',
}

export const getRebalanceActivityHeadingCards = ({
  totalItems,
  savedTimeInHours,
  savedGasCost,
}: {
  totalItems: number
  savedTimeInHours: number
  savedGasCost: number
}) => [
  {
    title: 'Rebalance actions',
    value: formatShorthandNumber(totalItems, { precision: 0 }),
    description:
      'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
  },
  {
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
        User saved time
        <Tooltip
          tooltip="Time users have saved by relying on our AI-Powered keeper network to optimize positions"
          tooltipWrapperStyles={{ minWidth: '230px' }}
        >
          <Icon iconName="info" size={18} />
        </Tooltip>
      </div>
    ),
    value: `${formatShorthandNumber(savedTimeInHours, { precision: 1 })} hours`,
    description:
      'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
  },
  {
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
        Gas cost savings
        <Tooltip
          tooltip="Gas cost savings achieved by users relying on our AI-Powered keeper network to optimize their positions, instead of manual management."
          tooltipWrapperStyles={{ minWidth: '230px' }}
        >
          <Icon iconName="info" size={18} />
        </Tooltip>
      </div>
    ),
    value: `$${formatFiatBalance(savedGasCost)}`,
    description:
      'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
  },
]
