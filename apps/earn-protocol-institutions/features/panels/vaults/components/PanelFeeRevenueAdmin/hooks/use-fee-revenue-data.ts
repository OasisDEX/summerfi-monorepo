'use client'
import { type Dispatch, useCallback, useState } from 'react'

import { feeRevenueMapper } from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/tables/fee-revenue/mapper'
import { type PanelFeeRevenueAdminAction } from '@/providers/PanelFeeRevenueAdminProvider/PanelFeeRevenueAdminProvider'
import { type InstitutionVaultFeeRevenueItem } from '@/types/institution-data'

/**
 * Hook to manage fee revenue data
 * @param dispatch - Dispatch function to update the state
 * @param rawData - Raw data for the fee revenue
 * @returns {Object} Fee revenue data management utilities:
 *   - rows: Array of fee revenue
 *   - onCancel: Function to cancel the editing of the fee revenue
 */
export const useFeeRevenueData = ({
  dispatch,
  rawData,
}: {
  dispatch: Dispatch<PanelFeeRevenueAdminAction>
  rawData: InstitutionVaultFeeRevenueItem[]
}) => {
  const [updatingFeeRevenueItem, setUpdatingFeeRevenueItem] =
    useState<InstitutionVaultFeeRevenueItem | null>(null)

  const [updatingFeeRevenueItemValue, setUpdatingFeeRevenueItemValue] = useState<string>('')

  const onEdit = useCallback((item: InstitutionVaultFeeRevenueItem) => {
    setUpdatingFeeRevenueItem(item)
  }, [])

  const onRowEditCancel = useCallback(() => {
    setUpdatingFeeRevenueItem(null)
    setUpdatingFeeRevenueItemValue('')
  }, [])

  const onSave = useCallback(
    (item: InstitutionVaultFeeRevenueItem) => {
      setUpdatingFeeRevenueItem(null)
      if (
        updatingFeeRevenueItemValue.length > 0 &&
        updatingFeeRevenueItemValue !== item.aumFee.toString() &&
        Number.isFinite(Number(updatingFeeRevenueItemValue))
      ) {
        dispatch({
          type: 'edit-fee-revenue-item',
          payload: { ...item, aumFee: Number(updatingFeeRevenueItemValue) },
        })
      }
      setUpdatingFeeRevenueItemValue('')
    },
    [dispatch, updatingFeeRevenueItemValue],
  )

  const onChange = useCallback((value: string) => {
    setUpdatingFeeRevenueItemValue(value)
  }, [])

  const feeRevenueRows = feeRevenueMapper({
    rawData,
    onEdit,
    onSave,
    onRowEditCancel,
    updatingFeeRevenueItem,
    updatingFeeRevenueItemValue,
    onChange,
  })

  const onCancel = useCallback(() => {
    setUpdatingFeeRevenueItem(null)
    setUpdatingFeeRevenueItemValue('')
  }, [])

  return {
    rows: feeRevenueRows,
    onCancel,
  }
}
