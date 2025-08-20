'use client'

import { type FC, useCallback, useMemo, useState } from 'react'
import { Button, Card, Table, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'
import { formatCryptoBalance, formatWithSeparators } from '@summerfi/app-utils'

import { assetRelocationColumns } from './columns'
import { assetRelocationMapper } from './mapper'

import styles from './PanelAssetRelocation.module.css'

const initialBalanceState = (vault: SDKVaultType) => {
  return vault.arks.reduce<{ [key: string]: string }>((acc, ark) => {
    if (ark.id) {
      acc[ark.id] = ''
    }

    return acc
  }, {})
}

interface PanelAssetRelocationProps {
  vault: SDKVaultType
}

export const PanelAssetRelocation: FC<PanelAssetRelocationProps> = ({ vault }) => {
  const [balanceAddChange, setBalanceAddChange] = useState(initialBalanceState(vault))
  const [balanceRemoveChange, setBalanceRemoveChange] = useState(initialBalanceState(vault))

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
    setBalanceAddChange(initialBalanceState(vault))
    setBalanceRemoveChange(initialBalanceState(vault))
  }, [vault])

  const onConfirm = useCallback(() => {
    // TODO: Implement the confirm logic
    // eslint-disable-next-line no-console
    console.log('confirm')
  }, [])

  const totalBalance = useMemo(
    () => vault.arks.reduce((acc, ark) => acc + Number(ark.inputTokenBalance), 0),
    [vault.arks],
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

  return (
    <Card variant="cardSecondary" className={styles.panelAssetRelocationWrapper}>
      <Text as="h5" variant="h5">
        Asset rellocation
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
            {formatCryptoBalance(totalBalance)}
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
            {formatWithSeparators(netBalanceChange, { cutOffNegative: false })}
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
    </Card>
  )
}
