import { LiveApyInfo } from '@/components/molecules/LiveApyInfo/LiveApyInfo'
import { TableHeadWithTooltip } from '@/components/molecules/TableHeadWithTooltip/TableHeadWithTooltip'
import { type TableColumn } from '@/components/organisms/Table/Table'

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
}): TableColumn<string>[] => [
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

export const vaultExposureColumnsHiddenOnMobile: string[] = [
  'allocated',
  'liveApy',
  'allocationCap',
  'avgApy30d',
  'avgApy1y',
  'yearlyLow',
  'yearlyHigh',
]
