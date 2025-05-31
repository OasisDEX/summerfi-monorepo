import { Icon, Tooltip } from '@summerfi/app-earn-ui'
import { formatFiatBalance, formatShorthandNumber } from '@summerfi/app-utils'

export const rebalanceActivityHeading = {
  title: 'Lazy Summer Global Rebalance Activity',
  description:
    'Summer.fi delivers sustainably higher yields, optimized with AI, to help you earn more, save time, and reduce costs. Below are the strategy optimizations performed by our AI-powered keeper network. This network requires a majority of AI agents to agree on a single strategy before automatically rebalancing a portfolio. It continuously optimizes by rebalancing strategies to maximize long-term yields.',
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
    value: formatFiatBalance(totalItems).split('.')[0],
    description:
      'The total number of rebalance actions performed by our AI-Powered keeper network to optimize user positions across all strategies.',
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
      'Total time users have saved by relying on our AI-Powered keeper network to optimize positions across strategies, instead of doing it manually.',
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
      'Total gas cost savings achieved by users relying on our AI-Powered keeper network to optimize their positions, instead of manual management.',
  },
]
