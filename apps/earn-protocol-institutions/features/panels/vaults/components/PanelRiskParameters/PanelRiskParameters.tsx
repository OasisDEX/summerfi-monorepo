'use client'

import { Card, Table, Text } from '@summerfi/app-earn-ui'

import { marketRiskParametersColumns } from './market-risk-parameters-table/columns'
import { marketRiskParametersMapper } from './market-risk-parameters-table/mapper'
import { type MarketRiskParameters } from './market-risk-parameters-table/types'
import { vaultRiskParametersColumns } from './vault-risk-parameters-table/columns'
import { vaultRiskParametersMapper } from './vault-risk-parameters-table/mapper'
import { type VaultRiskParameters } from './vault-risk-parameters-table/types'

import styles from './PanelRiskParameters.module.css'

const dummyRows: MarketRiskParameters[] = [
  {
    id: '1',
    market: 'Aave V3',
    marketCap: 1000000000,
    maxPercentage: 0.65,
    impliedCap: 800000000,
  },
  {
    id: '2',
    market: 'Origin USDC',
    marketCap: 3000000000,
    maxPercentage: 0.65,
    impliedCap: 800000000,
  },
  {
    id: '3',
    market: 'Spark USDC',
    marketCap: 3000000000,
    maxPercentage: 0.65,
    impliedCap: 800000000,
  },
  {
    id: '4',
    market: 'Compound V3 USDC',
    marketCap: 3000000000,
    maxPercentage: 0.65,
    impliedCap: 800000000,
  },
  {
    id: '5',
    market: 'Euler Prime USDC',
    marketCap: 0,
    maxPercentage: 0,
    impliedCap: 800000000,
  },
  {
    id: '6',
    market: 'Fluid USDC',
    marketCap: 3000000000,
    maxPercentage: 0.65,
    impliedCap: 800000000,
  },
]

const vaultRiskParametersDummyRows: VaultRiskParameters[] = [
  {
    id: '1',
    parameter: 'Vault Cap',
    value: 1000000000,
  },
  {
    id: '2',
    parameter: 'Buffer',
    value: 100,
  },
]

export const PanelRiskParameters = () => {
  const marketEditHandler = (item: MarketRiskParameters) => {
    // TODO: Implement edit handler
    // eslint-disable-next-line no-console
    console.log(item)
  }

  const vaultEditHandler = (item: VaultRiskParameters) => {
    // TODO: Implement edit handler
    // eslint-disable-next-line no-console
    console.log(item)
  }

  const marketRows = marketRiskParametersMapper({ rawData: dummyRows, onEdit: marketEditHandler })
  const vaultRows = vaultRiskParametersMapper({
    rawData: vaultRiskParametersDummyRows,
    onEdit: vaultEditHandler,
  })

  return (
    <Card variant="cardSecondary" className={styles.panelRiskParametersWrapper}>
      <Text as="h5" variant="h5">
        Vault Risk Parameters
      </Text>
      <Card>
        <Table
          rows={vaultRows}
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
          rows={marketRows}
          columns={marketRiskParametersColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
      </Card>
    </Card>
  )
}
