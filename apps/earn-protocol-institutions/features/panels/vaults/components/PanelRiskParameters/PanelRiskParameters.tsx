'use client'

import { useCallback, useMemo } from 'react'
import { Card, Table, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, UiSimpleFlowSteps } from '@summerfi/app-types'

import { EditSummary } from '@/components/molecules/EditSummary/EditSummary'
import { usePanelRiskParameters } from '@/providers/PanekRiskParametersProvider/PanelRiskParametersProvider'

import { getPanelRiskChanges } from './helpers/get-panel-risk-changes'
import { useMarketRiskParameters } from './hooks/use-market-risk-parameters'
import { useVaultRiskParameters } from './hooks/use-vault-risk-parameters'
import { marketRiskParametersColumns } from './market-risk-parameters-table/columns'
import { type MarketRiskParameters } from './market-risk-parameters-table/types'
import { vaultRiskParametersColumns } from './vault-risk-parameters-table/columns'
import { type VaultRiskParameters } from './vault-risk-parameters-table/types'

import styles from './PanelRiskParameters.module.css'

const marketRiskParametersDummyRows: MarketRiskParameters[] = [
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

export const PanelRiskParameters = ({ vault }: { vault: SDKVaultishType }) => {
  const { state, dispatch } = usePanelRiskParameters()

  const { rows: marketRows, onCancel: marketOnCancel } = useMarketRiskParameters({
    dispatch,
    rawData: marketRiskParametersDummyRows,
  })

  const { rows: vaultRows, onCancel: vaultOnCancel } = useVaultRiskParameters({
    dispatch,
    rawData: vaultRiskParametersDummyRows,
  })

  const change = useMemo(
    () =>
      getPanelRiskChanges({
        state,
        vaultRiskRawData: vaultRiskParametersDummyRows,
        marketRiskRawData: marketRiskParametersDummyRows,
      }),
    [state],
  )

  const onCancel = useCallback(() => {
    dispatch({ type: 'reset' })
    vaultOnCancel()
    marketOnCancel()
  }, [dispatch, vaultOnCancel, marketOnCancel])

  const onConfirm = useCallback(() => {
    dispatch({ type: 'update-step', payload: UiSimpleFlowSteps.PENDING })
    // TODO: Implement confirm handler
    // eslint-disable-next-line no-console
    console.log('confirm')
  }, [dispatch])

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
      <EditSummary title="Summary" change={change} onCancel={onCancel} onConfirm={onConfirm} />
    </Card>
  )
}
