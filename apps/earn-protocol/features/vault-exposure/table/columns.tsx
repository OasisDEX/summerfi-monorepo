import { LiveApyInfo, TableHeadWithTooltip } from '@summerfi/app-earn-ui'

export const vaultExposureColumns = ({
  apyCurrent,
  apyUpdatedAt,
  isAltPressed,
}: {
  apyCurrent: string
  apyUpdatedAt: {
    apyUpdatedAtLabel: string
    apyUpdatedAtAltLabel: string
  }
  isAltPressed: boolean
}) => [
  {
    title: 'Strategy',
    key: 'strategy',
    sortable: false,
  },
  {
    title: (
      <TableHeadWithTooltip
        minWidth="247px"
        title="Live APY"
        tooltip={
          <LiveApyInfo
            apyCurrent={apyCurrent}
            apyUpdatedAt={apyUpdatedAt}
            isAltPressed={isAltPressed}
          />
        }
      />
    ),
    key: 'liveApy',
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
    title: 'Allocated',
    key: 'allocated',
    sortable: true,
  },
  {
    title: 'Allocation Cap',
    key: 'allocationCap',
    sortable: true,
  },
]

export const vaultExposureColumnsHiddenOnMobile = [
  'allocated',
  'liveApy',
  'allocationCap',
  'avgApy30d',
  'avgApy1y',
  'yearlyLow',
  'yearlyHigh',
]
