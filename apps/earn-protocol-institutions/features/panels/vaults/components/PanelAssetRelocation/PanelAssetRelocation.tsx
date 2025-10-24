'use client'

import { type FC, useCallback, useMemo, useState } from 'react'
import { AllocationBar, Button, Card, Table, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'
import { formatWithSeparators } from '@summerfi/app-utils'

import { getArksAllocation } from '@/features/panels/vaults/components/PanelVaultExposure/get-arks-allocation'

import { assetRelocationColumns } from './columns'
import { getAssetRelocationInitialBalanceState, getAssetRelocationModifiedVault } from './helpers'
import { assetRelocationMapper } from './mapper'

import styles from './PanelAssetRelocation.module.css'

interface PanelAssetRelocationProps {
  vault: SDKVaultType
}

export const PanelAssetRelocation: FC<PanelAssetRelocationProps> = ({ vault }) => {
  const [balanceAddChange, setBalanceAddChange] = useState(
    getAssetRelocationInitialBalanceState(vault),
  )
  const [balanceRemoveChange, setBalanceRemoveChange] = useState(
    getAssetRelocationInitialBalanceState(vault),
  )

  const onChange = useCallback(
    ({
      id,
      balanceChange,
      type,
    }: {
      id: string
      balanceChange: string
      type: 'add' | 'remove'
    }) => {
      // Only allow positive numbers (greater than 0) or empty string
      const sanitizedValue =
        balanceChange === '' || parseFloat(balanceChange) > 0 ? balanceChange : ''

      if (type === 'add') {
        setBalanceAddChange((prev) => ({ ...prev, [id]: sanitizedValue }))
      } else {
        setBalanceRemoveChange((prev) => ({ ...prev, [id]: sanitizedValue }))
      }
    },
    [],
  )

  const onCancel = useCallback(() => {
    setBalanceAddChange(getAssetRelocationInitialBalanceState(vault))
    setBalanceRemoveChange(getAssetRelocationInitialBalanceState(vault))
  }, [vault])

  const onConfirm = useCallback(() => {
    // TODO: Implement the confirm logic
    // eslint-disable-next-line no-console
    console.log('confirm')
  }, [])

  const totalBalance = useMemo(
    () =>
      vault.arks.reduce(
        (acc, ark) =>
          // eslint-disable-next-line no-mixed-operators
          acc + Number(ark.inputTokenBalance) / 10 ** vault.inputToken.decimals,
        0,
      ),
    [vault.arks, vault.inputToken.decimals],
  )

  const netBalanceChange = vault.arks.reduce((acc, ark) => {
    const arkBalanceChange = Number(balanceAddChange[ark.id]) - Number(balanceRemoveChange[ark.id])

    return acc + arkBalanceChange
  }, 0)

  const rows = assetRelocationMapper({
    vault,
    onChange,
    balanceAddChange,
    balanceRemoveChange,
  })

  const buttonsDisabled = netBalanceChange === 0

  const beforeAllocation = getArksAllocation(vault)

  // Create a modified vault with user input changes applied
  const modifiedVault = useMemo(
    () => getAssetRelocationModifiedVault(vault, balanceAddChange, balanceRemoveChange),
    [vault, balanceAddChange, balanceRemoveChange],
  )

  const afterAllocation = getArksAllocation(modifiedVault)

  return (
    <Card variant="cardSecondary" className={styles.panelAssetRelocationWrapper}>
      <Text as="h5" variant="h5">
        Asset relocation
      </Text>
      <Card className={styles.contentWrapper}>
        <Table
          rows={rows}
          columns={assetRelocationColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
        <div className={styles.summary}>
          <Text as="p" variant="p3semi">
            Total Balance
          </Text>
          <Text as="p" variant="p3semi">
            {formatWithSeparators(totalBalance, { precision: 2 })}
          </Text>
        </div>
        <div className={styles.summary}>
          <Text as="p" variant="p3semi">
            Net Balance Change
          </Text>
          <Text
            as="p"
            variant="p3semi"
            style={{
              color:
                netBalanceChange >= 0 ? 'var(--color-text-primary)' : 'var(--color-text-critical)',
            }}
          >
            {formatWithSeparators(netBalanceChange, { precision: 2, cutOffNegative: false })}
          </Text>
        </div>
        <div className={styles.buttons}>
          <Button variant="secondarySmall" disabled={buttonsDisabled} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primarySmall" disabled={buttonsDisabled} onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </Card>
      <div className={styles.allocationBar}>
        <Text as="p" variant="p4semi" className={styles.allocationHeader}>
          Before asset relocation
        </Text>
        <AllocationBar items={beforeAllocation} variant="large" />
      </div>
      <div className={styles.allocationBar}>
        <Text as="p" variant="p4semi" className={styles.allocationHeader}>
          After asset relocation
        </Text>
        <AllocationBar items={afterAllocation} variant="large" />
      </div>
    </Card>
  )
}
