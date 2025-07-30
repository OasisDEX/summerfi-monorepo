import { Card, Table, Text } from '@summerfi/app-earn-ui'

import { riskParametersColumns } from './columns'
import { riskParametersMapper } from './mapper'
import { type RiskParameters } from './types'

import styles from './PanelRiskParameters.module.css'

const dummyRows: RiskParameters[] = [
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

export const PanelRiskParameters = () => {
  const editHandler = (item: RiskParameters) => {
    // TODO: Implement edit handler
    // eslint-disable-next-line no-console
    console.log(item)
  }

  const rows = riskParametersMapper({ rawData: dummyRows, onEdit: editHandler })

  return (
    <Card variant="cardSecondary" className={styles.panelRiskParametersWrapper}>
      <Text as="h5" variant="h5">
        Risk Parameters
      </Text>
      <Card>
        <Table rows={rows} columns={riskParametersColumns} />
      </Card>
    </Card>
  )
}
