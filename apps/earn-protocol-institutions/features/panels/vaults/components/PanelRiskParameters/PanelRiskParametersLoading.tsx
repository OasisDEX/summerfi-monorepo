import { Card, Icon, Table, Text } from '@summerfi/app-earn-ui'

import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'

import { marketRiskParametersColumns } from './market-risk-parameters-table/columns'
import { vaultRiskParametersColumns } from './vault-risk-parameters-table/columns'

import styles from './PanelRiskParameters.module.css'

export const PanelRiskParametersLoading = () => {
  return (
    <Card variant="cardSecondary" className={styles.panelRiskParametersWrapper}>
      <Text as="h5" variant="h5">
        Vault Risk Parameters
        <div style={{ display: 'inline-block', cursor: 'pointer' }}>
          <Icon iconName="refresh" size={16} style={{ margin: '0 10px' }} />
        </div>
      </Text>
      <Card>
        <Table
          isLoading
          skeletonLines={2}
          rows={[]}
          columns={vaultRiskParametersColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
      </Card>
      <Text as="h5" variant="h5">
        Market Risk Parameters
      </Text>
      <Card>
        <Table
          isLoading
          skeletonLines={6}
          rows={[]}
          columns={marketRiskParametersColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
      </Card>
      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue transactionQueue={[]} chainId={1} isLoading />
    </Card>
  )
}
