import { type Dispatch, useCallback, useState } from 'react'

import { vaultRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/mapper'
import { type VaultRiskParameters } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/types'
import { type PanelRiskParametersAction } from '@/providers/PanekRiskParametersProvider/PanelRiskParametersProvider'

/**
 * Hook to manage vault risk parameters
 * @param dispatch - Dispatch function to update the state
 * @param rawData - Raw data for the vault risk parameters
 * @returns {Object} Vault risk parameters management utilities:
 *   - rows: Array of vault risk parameters
 *   - onCancel: Function to cancel the editing of the vault risk parameters
 */
export const useVaultRiskParameters = ({
  dispatch,
  rawData,
}: {
  dispatch: Dispatch<PanelRiskParametersAction>
  rawData: VaultRiskParameters[]
}) => {
  const [updatingVaultRiskItem, setUpdatingVaultRiskItem] = useState<VaultRiskParameters | null>(
    null,
  )

  const [updatingVaultRiskItemValue, setUpdatingVaultRiskItemValue] = useState<string>('')

  const vaultEditHandler = useCallback((item: VaultRiskParameters) => {
    setUpdatingVaultRiskItem(item)
  }, [])

  const vaultEditCancel = useCallback(() => {
    setUpdatingVaultRiskItem(null)
    setUpdatingVaultRiskItemValue('')
  }, [])

  const vaultSaveHandler = useCallback(
    (item: VaultRiskParameters) => {
      setUpdatingVaultRiskItem(null)
      if (
        updatingVaultRiskItemValue.length > 0 &&
        updatingVaultRiskItemValue !== item.value.toString()
      ) {
        dispatch({
          type: 'edit-vault-risk-item',
          payload: {
            ...item,
            value: Number(updatingVaultRiskItemValue),
          },
        })
        setUpdatingVaultRiskItemValue('')
      }
    },
    [dispatch, updatingVaultRiskItemValue],
  )
  const vaultOnChange = useCallback((value: string) => {
    setUpdatingVaultRiskItemValue(value)
  }, [])

  const onCancel = useCallback(() => {
    setUpdatingVaultRiskItem(null)
    setUpdatingVaultRiskItemValue('')
  }, [])

  const rows = vaultRiskParametersMapper({
    rawData,
    onEdit: vaultEditHandler,
    onSave: vaultSaveHandler,
    onRowEditCancel: vaultEditCancel,
    updatingVaultRiskItem,
    updatingVaultRiskItemValue,
    onChange: vaultOnChange,
  })

  return {
    rows,
    onCancel,
  }
}
