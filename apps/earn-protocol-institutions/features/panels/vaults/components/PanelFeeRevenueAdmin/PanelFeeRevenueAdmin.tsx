'use client'
import { type FC, useCallback, useMemo } from 'react'
import { Card, Table, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, UiSimpleFlowSteps } from '@summerfi/app-types'

import { EditSummary } from '@/components/molecules/EditSummary/EditSummary'
import { usePanelFeeRevenueAdmin } from '@/providers/PanelFeeRevenueAdminProvider/PanelFeeRevenueAdminProvider'
import { type InstitutionVaultFeeRevenueData } from '@/types/institution-data'

import { getFeeRevenueAdminChanges } from './helpers/get-fee-revenue-admin-changes'
import { useFeeRevenueData } from './hooks/use-fee-revenue-data'
import { useThirdPartyCostsData } from './hooks/use-third-party-costs-data'
import { feeRevenueColumns } from './tables/fee-revenue/columns'
import { feeRevenueHistoryColumns } from './tables/history/columns'
import { feeRevenueHistoryMapper } from './tables/history/mapper'
import { thirdPartyCostsColumns } from './tables/third-party-costs/columns'

import classNames from './PanelFeeRevenueAdmin.module.css'

interface PanelFeeRevenueAdminProps {
  vaultData: SDKVaultishType
  feeRevenueData: InstitutionVaultFeeRevenueData
}

export const PanelFeeRevenueAdmin: FC<PanelFeeRevenueAdminProps> = ({
  vaultData: _vaultData,
  feeRevenueData,
}) => {
  const { state, dispatch } = usePanelFeeRevenueAdmin()
  const { rows: thirdPartyCostsRows, onCancel: thirdPartyCostsOnCancel } = useThirdPartyCostsData({
    dispatch,
    rawData: feeRevenueData.thirdPartyCosts,
  })

  const { rows: feeRevenueRows, onCancel: feeRevenueOnCancel } = useFeeRevenueData({
    dispatch,
    rawData: feeRevenueData.feeRevenue,
  })

  const feeRevenueHistoryRows = feeRevenueHistoryMapper({
    feeRevenueHistory: feeRevenueData.feeRevenueHistory,
  })

  const change = useMemo(
    () =>
      getFeeRevenueAdminChanges({
        state,
        feeRevenueData: feeRevenueData.feeRevenue,
        thirdPartyCostsData: feeRevenueData.thirdPartyCosts,
      }),
    [state, feeRevenueData.feeRevenue, feeRevenueData.thirdPartyCosts],
  )

  const onCancel = useCallback(() => {
    dispatch({ type: 'reset' })
    thirdPartyCostsOnCancel()
    feeRevenueOnCancel()
  }, [dispatch, thirdPartyCostsOnCancel, feeRevenueOnCancel])

  const onConfirm = useCallback(() => {
    dispatch({ type: 'update-step', payload: UiSimpleFlowSteps.PENDING })
    // TODO: Implement confirm handler
    // eslint-disable-next-line no-console
    console.log('confirm')
  }, [dispatch])

  return (
    <Card variant="cardSecondary" className={classNames.panelFeeRevenueAdminWrapper}>
      <Text as="h5" variant="h5">
        Fee & revenue admin
      </Text>
      <Card variant="cardPrimary" className={classNames.panelFeeRevenueAdminCard}>
        <Text as="p" variant="p3semi">
          Fee Revenue
        </Text>
        <Table
          rows={feeRevenueRows}
          columns={feeRevenueColumns}
          wrapperClassName={classNames.tableWrapper}
          tableClassName={classNames.table}
        />
      </Card>
      <Card variant="cardPrimary" className={classNames.panelFeeRevenueAdminCard}>
        <Text as="p" variant="p3semi">
          3rd Party Costs
        </Text>
        <Table
          rows={thirdPartyCostsRows}
          columns={thirdPartyCostsColumns}
          wrapperClassName={classNames.tableWrapper}
          tableClassName={classNames.table}
        />
      </Card>
      <Card className={classNames.panelFeeRevenueAdminCard} style={{ background: 'unset' }}>
        <Text as="p" variant="p1semi">
          History
        </Text>
        <Table
          rows={feeRevenueHistoryRows}
          columns={feeRevenueHistoryColumns}
          wrapperClassName={classNames.tableWrapper}
          tableClassName={classNames.table}
        />
      </Card>
      <EditSummary title="Summary" change={change} onCancel={onCancel} onConfirm={onConfirm} />
    </Card>
  )
}
