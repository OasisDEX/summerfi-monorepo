import { Button, Card, Icon, Table, Text } from '@summerfi/app-earn-ui'
import dayjs from 'dayjs'

import { CHART_TIMESTAMP_FORMAT_SHORT } from '@/features/charts/helpers'
import {
  type ActivityTableColumns,
  InstitutionVaultActivityType,
} from '@/features/panels/vaults/components/PanelActivity/types'

import { activityColumns } from './columns'

import styles from './PanelActivity.module.css'

const filters = [
  {
    label: 'Rebalances',
    value: InstitutionVaultActivityType.REBALANCE,
  },
  {
    label: 'Deposits',
    value: InstitutionVaultActivityType.DEPOSIT,
  },
  {
    label: 'Withdrawals',
    value: InstitutionVaultActivityType.WITHDRAWAL,
  },
  {
    label: 'Risk',
    value: InstitutionVaultActivityType.RISK_CHANGE,
  },
  {
    label: 'Role',
    value: InstitutionVaultActivityType.ROLE_CHANGE,
  },
]

export const PanelActivityLoading = () => {
  return (
    <Card variant="cardSecondary" className={styles.panelActivityWrapper}>
      <Text as="h5" variant="h5">
        Activity -{' '}
        {`${dayjs().format(CHART_TIMESTAMP_FORMAT_SHORT)} - ${dayjs()
          .subtract(1, 'weeks')
          .format(CHART_TIMESTAMP_FORMAT_SHORT)}`}
        <div style={{ display: 'inline-block', cursor: 'pointer' }}>
          <Icon iconName="refresh" size={16} style={{ margin: '0 10px' }} />
        </div>
      </Text>
      <div className={styles.headingWrapper}>
        <div className={styles.filters}>
          {filters.map((filter) => (
            <Button key={filter.value} variant="primarySmall" className={styles.button}>
              {filter.label}
            </Button>
          ))}
        </div>
        <Button variant="secondarySmall" className={styles.button}>
          Export as CSV
        </Button>
      </div>
      <Card className={styles.tableCard}>
        <Table<ActivityTableColumns>
          isLoading
          skeletonLines={15}
          rows={[]}
          columns={activityColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <Button variant="secondarySmall" disabled>
            Load one more week
          </Button>
        </div>
      </Card>
    </Card>
  )
}
