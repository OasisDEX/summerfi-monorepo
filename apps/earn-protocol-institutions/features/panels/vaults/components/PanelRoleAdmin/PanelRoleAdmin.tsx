'use client'

import { type FC, useCallback, useMemo, useState } from 'react'
import { Card, Table, Text } from '@summerfi/app-earn-ui'
import { type Address, UiSimpleFlowSteps } from '@summerfi/app-types'

import { EditSummary } from '@/components/molecules/EditSummary/EditSummary'
import { usePanelAdmin } from '@/providers/PanelAdminProvider/PanelAdminProvider'
import { type InstitutionVaultRole } from '@/types/institution-data'

import { roleAdminColumns } from './columns'
import { roleAdminMapper } from './mapper'

import styles from './PanelRoleAdmin.module.css'

interface PanelRoleAdminProps {
  roles: InstitutionVaultRole[]
}

export const PanelRoleAdmin: FC<PanelRoleAdminProps> = ({ roles }) => {
  const { state, dispatch } = usePanelAdmin()

  const [updatingRole, setUpdatingRole] = useState<InstitutionVaultRole | null>(null)
  const [updatingRoleAddress, setUpdatingRoleAddress] = useState('')

  const onChange = useCallback((value: string) => {
    setUpdatingRoleAddress(value)
  }, [])

  const onEdit = useCallback((item: InstitutionVaultRole) => {
    setUpdatingRole(item)
  }, [])

  const onRowEditCancel = useCallback(() => {
    setUpdatingRole(null)
    setUpdatingRoleAddress('')
  }, [])

  const onCancel = useCallback(() => {
    dispatch({ type: 'reset' })
    setUpdatingRole(null)
    setUpdatingRoleAddress('')
  }, [dispatch])

  const onConfirm = useCallback(() => {
    dispatch({ type: 'update-step', payload: UiSimpleFlowSteps.PENDING })
    // TODO: Implement confirm handler
    // eslint-disable-next-line no-console
    console.log('confirm')
  }, [dispatch])

  const onSave = useCallback(
    (item: InstitutionVaultRole) => {
      setUpdatingRole(null)
      if (updatingRoleAddress.length > 0 && updatingRoleAddress !== item.address) {
        dispatch({
          type: 'edit-item',
          payload: { ...item, address: updatingRoleAddress as Address },
        })
      }
      setUpdatingRoleAddress('')
    },
    [updatingRoleAddress, dispatch],
  )

  const rows = useMemo(
    () =>
      roleAdminMapper({
        roles,
        onEdit,
        onSave,
        updatingRole,
        onRowEditCancel,
        onChange,
        updatingRoleAddress,
      }),
    [roles, onEdit, onSave, updatingRole, onRowEditCancel, onChange, updatingRoleAddress],
  )

  const change = useMemo(
    () =>
      state.items.map(({ role }) => {
        const from = roles[role]?.address ?? 'n/a'

        return {
          title: item.role,
          from,
          to: item.address,
        }
      }),
    [state.items, roles],
  )

  return (
    <Card variant="cardSecondary" className={styles.panelRoleAdminWrapper}>
      <Text as="h5" variant="h5">
        Roles
      </Text>
      <Card>
        <Table
          rows={rows}
          columns={roleAdminColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
      </Card>
      <EditSummary title="Summary" change={change} onCancel={onCancel} onConfirm={onConfirm} />
    </Card>
  )
}
