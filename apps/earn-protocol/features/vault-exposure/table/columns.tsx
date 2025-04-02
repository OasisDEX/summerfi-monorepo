import { TableHeadWithTooltip } from '@summerfi/app-earn-ui'

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
    title: '30d AVG. APY',
    key: 'avgApy30d',
    sortable: true,
  },
  {
    title: '1y AVG. APY',
    key: 'avgApy1y',
    sortable: true,
  },

  {
    title: '1y APY Low',
    key: 'yearlyLow',
    sortable: true,
  },
  {
    title: '1y APY High',
    key: 'yearlyHigh',
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

export const vaultExposureColumnsHiddenOnMobile = [
  'liquidity',
  'cap',
  'currentApy',
  'avgApy30d',
  'avgApy1y',
  'yearlyLow',
  'yearlyHigh',
]
