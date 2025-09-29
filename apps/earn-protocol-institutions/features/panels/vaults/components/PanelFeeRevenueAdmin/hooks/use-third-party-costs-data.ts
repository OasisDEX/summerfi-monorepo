'use client'
import { type Dispatch, useCallback, useState } from 'react'

import { thirdPartyCostsMapper } from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/tables/third-party-costs/mapper'
import { type PanelFeeRevenueAdminAction } from '@/providers/PanelFeeRevenueAdminProvider/PanelFeeRevenueAdminProvider'
import { type InstitutionVaultThirdPartyCost } from '@/types/institution-data'

/**
 * Hook to manage thrid party costs data
 * @param dispatch - Dispatch function to update the state
 * @param rawData - Raw data for the thrid party costs
 * @returns {Object} thrid party costs data management utilities:
 *   - rows: Array of thrid party costs
 *   - onCancel: Function to cancel the editing of the thrid party costs
 */
export const useThirdPartyCostsData = ({
  dispatch,
  rawData,
}: {
  dispatch: Dispatch<PanelFeeRevenueAdminAction>
  rawData: InstitutionVaultThirdPartyCost[]
}) => {
  const [updatingThirdPartyCostsItem, setUpdatingThirdPartyCostsItem] =
    useState<InstitutionVaultThirdPartyCost | null>(null)

  const [updatingThirdPartyCostsFee, setUpdatingThirdPartyCostsFee] = useState<string>('')
  const [updatingThirdPartyCostsAddress, setUpdatingThirdPartyCostsAddress] = useState<string>('')

  const onEdit = (item: InstitutionVaultThirdPartyCost) => {
    setUpdatingThirdPartyCostsItem(item)
  }

  const onRowEditCancel = () => {
    setUpdatingThirdPartyCostsItem(null)
    setUpdatingThirdPartyCostsFee('')
    setUpdatingThirdPartyCostsAddress('')
  }

  const onSave = useCallback(
    (item: InstitutionVaultThirdPartyCost) => {
      setUpdatingThirdPartyCostsItem(null)
      if (
        (updatingThirdPartyCostsFee.length > 0 &&
          updatingThirdPartyCostsFee !== item.fee.toString() &&
          Number.isFinite(Number(updatingThirdPartyCostsFee))) ||
        (updatingThirdPartyCostsAddress.length > 0 &&
          updatingThirdPartyCostsAddress !== item.address.toString() &&
          Number.isFinite(Number(updatingThirdPartyCostsAddress)))
      ) {
        dispatch({
          type: 'edit-third-party-costs-item',
          payload: {
            ...item,
            fee: updatingThirdPartyCostsFee ? Number(updatingThirdPartyCostsFee) : item.fee,
            address: updatingThirdPartyCostsAddress ? updatingThirdPartyCostsAddress : item.address,
          },
        })
      }
      setUpdatingThirdPartyCostsAddress('')
      setUpdatingThirdPartyCostsFee('')
    },
    [dispatch, updatingThirdPartyCostsFee, updatingThirdPartyCostsAddress],
  )

  const onChangeCosts = useCallback((value: string) => {
    setUpdatingThirdPartyCostsFee(value)
  }, [])

  const onChangeAddress = useCallback((value: string) => {
    setUpdatingThirdPartyCostsAddress(value)
  }, [])

  const onCancel = useCallback(() => {
    setUpdatingThirdPartyCostsItem(null)
    setUpdatingThirdPartyCostsFee('')
    setUpdatingThirdPartyCostsAddress('')
  }, [])

  const thirdPartyCostsRows = thirdPartyCostsMapper({
    rawData,
    onEdit,
    onSave,
    onRowEditCancel,
    updatingThirdPartyCostsItem,
    updatingThirdPartyCostsFee,
    updatingThirdPartyCostsAddress,
    onChangeCosts,
    onChangeAddress,
  })

  return {
    rows: thirdPartyCostsRows,
    onCancel,
  }
}
