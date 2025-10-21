import { useMemo, useState } from 'react'
import { Button, Dropdown, Input, Text } from '@summerfi/app-earn-ui'
import { type DropdownRawOption } from '@summerfi/app-types'
import { ContractSpecificRoleName } from '@summerfi/sdk-common'

import { vaultSpecificRolesList } from '@/constants/vaults'
import { isValidAddress } from '@/helpers/is-valid-address'
import { contractSpecificRolesToHuman } from '@/helpers/wallet-roles'
import { type InstitutionVaultRoleType } from '@/types/institution-data'

import styles from './PanelRoleAdmin.module.css'

export const AddNewRoleForm = ({
  onAddRole,
}: {
  onAddRole: ({ address, role }: { address: string; role: InstitutionVaultRoleType }) => void
}) => {
  const [isAddressValid, setIsAddressValid] = useState(true)
  const [newRoleAddress, setNewRoleAddress] = useState('')
  const [newRoleName, setNewRoleName] = useState<InstitutionVaultRoleType>('CURATOR_ROLE')

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value

    setNewRoleAddress(address)
    setIsAddressValid(isValidAddress(address))
  }

  const handleRoleChange = (option: DropdownRawOption) => {
    const selectedRole = vaultSpecificRolesList.find(
      ({ role }) => String(role) === (option.value as keyof typeof ContractSpecificRoleName),
    )

    if (selectedRole) {
      setNewRoleName(selectedRole.roleName)
    }
  }

  const handleAddRole = () => {
    onAddRole({
      address: newRoleAddress,
      role: newRoleName,
    })
    setNewRoleAddress('')
    setNewRoleName('CURATOR_ROLE')
  }

  const dropdownOptions = useMemo(() => {
    return vaultSpecificRolesList.map(({ role, roleName }) => ({
      content: (
        <Text as="p" variant="p3">
          {contractSpecificRolesToHuman(roleName)}
        </Text>
      ),
      value: String(role),
    }))
  }, [])

  return (
    <div className={styles.addRoleForm}>
      <div style={{ display: 'flex', gap: 'var(--general-space-12)' }}>
        <Input
          variant="withBorder"
          placeholder="0x..."
          value={newRoleAddress}
          onChange={handleAddressChange}
          wrapperStyles={{ width: '405px' }}
          inputWrapperStyles={{
            fontFamily: 'monospace',
            fontSize: '14px',
            border: newRoleAddress && !isAddressValid ? '1px solid red' : undefined,
          }}
        />
        <Dropdown
          options={dropdownOptions}
          dropdownValue={{
            content: (
              <Text as="p" variant="p3">
                {newRoleName}
              </Text>
            ),
            value: String(
              ContractSpecificRoleName[newRoleName as keyof typeof ContractSpecificRoleName],
            ),
          }}
          dropdownChildrenStyle={{
            padding: 'var(--general-space-12) var(--general-space-16)',
            minWidth: '150px',
          }}
          dropdownOptionsStyle={{
            minWidth: '150px',
          }}
          dropdownWrapperStyle={{
            minWidth: '150px',
          }}
          asPill
          onChange={handleRoleChange}
        >
          <Text as="p" variant="p3">
            {contractSpecificRolesToHuman(newRoleName)}
          </Text>
        </Dropdown>
      </div>
      <Button
        variant="primaryLarge"
        disabled={!isAddressValid}
        onClick={handleAddRole}
        style={{ minWidth: 'fit-content' }}
      >
        <Text variant="p4">Add&nbsp;Role</Text>
      </Button>
    </div>
  )
}
