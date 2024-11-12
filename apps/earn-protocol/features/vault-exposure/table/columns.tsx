import { Fragment } from 'react'
import { TableHeadWithTooltip, Text } from '@summerfi/app-earn-ui'

const vaultTypeTooltipContent = [
  { title: 'Isolated Lending', description: 'Text for what isolated lending is' },
  { title: 'Basic Trading', description: 'Text for what isolated lending is' },
  { title: 'Fixed Yield', description: 'Text for what isolated lending is' },
  { title: 'Lending', description: 'Text for what isolated lending is' },
]

export const vaultExposureColumns = [
  {
    title: 'Strategy',
    key: 'strategy',
    sortable: false,
  },
  {
    title: '% Allocation',
    key: 'allocation',
    sortable: true,
  },
  {
    title: 'Current APY',
    key: 'currentApy',
    sortable: true,
  },
  {
    title: 'Liquidity',
    key: 'liquidity',
    sortable: true,
  },
  {
    title: (
      <TableHeadWithTooltip
        minWidth="261px"
        title="Type"
        tooltip={
          <div style={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
            {vaultTypeTooltipContent.map((item, idx) => (
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
                      vaultTypeTooltipContent.length - 1 === idx
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
      />
    ),
    key: 'type',
    sortable: false,
  },
]

export const vaultExposureColumnsHiddenOnMobile = ['liquidity', 'type', 'currentApy']
