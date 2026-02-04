'use client'
import { useState } from 'react'
import { Button, Input, Text } from '@summerfi/app-earn-ui'

import { isValidAddress } from '@/helpers/is-valid-address'

import styles from './PanelRoleAdmin.module.css'

export const AddWhitelistForm = ({
  onGrantWhitelist,
  disabled,
}: {
  onGrantWhitelist?: ({ address }: { address: `0x${string}` }) => void
  disabled: boolean
}) => {
  const [isAddressValid, setIsAddressValid] = useState(false)
  const [whitelistAddress, setWhitelistAddress] = useState<`0x${string}` | ''>('')

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value

    setWhitelistAddress(address as `0x${string}`)
    setIsAddressValid(isValidAddress(address))
  }

  const handleAddRole = () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!whitelistAddress || !isAddressValid) return
    onGrantWhitelist?.({
      address: whitelistAddress,
    })
    setWhitelistAddress('')
  }

  return (
    <div className={styles.addRoleForm}>
      <div style={{ display: 'flex', gap: 'var(--general-space-12)' }}>
        <Input
          variant="withBorder"
          placeholder="0x..."
          value={whitelistAddress}
          onChange={handleAddressChange}
          wrapperStyles={{ width: '405px' }}
          inputWrapperStyles={{
            fontFamily: 'monospace',
            fontSize: '14px',
            border: whitelistAddress && !isAddressValid ? '1px solid red' : undefined,
          }}
        />
      </div>
      <Button
        variant="primaryLarge"
        disabled={!whitelistAddress || !isAddressValid || disabled}
        onClick={handleAddRole}
        style={{ minWidth: 'fit-content' }}
      >
        <Text variant="p4">Add&nbsp;whitelist</Text>
      </Button>
    </div>
  )
}
