import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { LiveApyInfo } from '@/components/molecules/LiveApyInfo/LiveApyInfo'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-2x-small)' }}>
        <Text
          as="p"
          variant="p4semi"
          style={{
            color: 'var(--earn-protocol-secondary-40',
          }}
        >
          Live&nbsp;APY{' '}
        </Text>
        <Tooltip
          tooltipWrapperStyles={{ minWidth: '247px' }}
          tooltip={
            <LiveApyInfo
              apyCurrent={apyCurrent}
              apyUpdatedAt={apyUpdatedAt}
              isAltPressed={isAltPressed}
            />
          }
        >
          <Icon iconName="question_o" color="rgba(119, 117, 118, 1)" variant="xs" />
        </Tooltip>
      </div>
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
