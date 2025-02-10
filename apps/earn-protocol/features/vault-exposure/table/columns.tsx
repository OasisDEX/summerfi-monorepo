import { TableHeadWithTooltip } from '@summerfi/app-earn-ui'

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
        minWidth="247px"
        title="Cap"
        tooltip="This is the maximum allocation the pool or market can be exposed to, managed by the Risk Manager."
      />
    ),
    key: 'cap',
    sortable: true,
  },
]

export const vaultExposureColumnsHiddenOnMobile = ['liquidity', 'cap', 'currentApy']
