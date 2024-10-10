import { Fragment } from 'react'
import { Icon, Text, Tooltip } from '@summerfi/app-earn-ui'

const strategyTypeTooltipContent = [
  { title: 'Isolated Lending', description: 'Text for what isolated lending is' },
  { title: 'Basic Trading', description: 'Text for what isolated lending is' },
  { title: 'Fixed Yield', description: 'Text for what isolated lending is' },
  { title: 'Lending', description: 'Text for what isolated lending is' },
]

export const strategyExposureColumns = [
  {
    title: 'Strategy',
    key: 'strategy',
    sortable: false,
  },
  {
    title: '% Allocation',
    key: 'allocation',
    sortable: false,
  },
  {
    title: 'Current APY',
    key: 'currentApy',
    sortable: false,
  },
  {
    title: 'Liquidity',
    key: 'liquidity',
    sortable: false,
  },
  {
    title: (
      <Tooltip
        tooltipWrapperStyles={{ minWidth: '261px' }}
        tooltip={
          <div style={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
            {strategyTypeTooltipContent.map((item, idx) => (
              <Fragment key={item.title}>
                <Text
                  as="p"
                  variant="p3semi"
                  style={{
                    color: 'var(--earn-protocol-secondary-100)',
                    marginBottom: 'var(--spacing-space-2x-small)',
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  as="p"
                  variant="p3"
                  style={{
                    color: 'var(--earn-protocol-secondary-60)',
                    marginBottom:
                      strategyTypeTooltipContent.length - 1 === idx
                        ? '0'
                        : 'var(--spacing-space-large)',
                  }}
                >
                  {item.description}
                </Text>
              </Fragment>
            ))}
          </div>
        }
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-2x-small)' }}
        >
          Type <Icon iconName="question_o" color="rgba(119, 117, 118, 1)" variant="xs" />
        </div>
      </Tooltip>
    ),
    key: 'type',
    sortable: false,
  },
]
