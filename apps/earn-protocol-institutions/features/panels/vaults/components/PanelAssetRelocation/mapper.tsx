import { getProtocolLabel, Input, TableCellText } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'

import styles from './PanelAssetRelocation.module.css'

export const assetRelocationMapper = ({
  vault,
  onChange,
  balanceAddChange,
  balanceRemoveChange,
}: {
  vault: SDKVaultType
  onChange: ({
    id,
    balanceChange,
    type,
  }: {
    id: string
    balanceChange: string
    type: 'add' | 'remove'
  }) => void
  balanceAddChange: { [key: string]: string }
  balanceRemoveChange: { [key: string]: string }
}) => {
  return vault.arks
    .sort((a, b) => Number(b.inputTokenBalance) - Number(a.inputTokenBalance))
    .map((ark) => {
      const protocol = ark.name?.split('-') ?? ['n/a']
      const protocolLabel = getProtocolLabel(protocol)

      return {
        content: {
          market: <TableCellText>{protocolLabel}</TableCellText>,
          balance: <TableCellText>{formatCryptoBalance(ark.inputTokenBalance)}</TableCellText>,
          'remove-from-market': (
            <Input
              variant="withBorder"
              wrapperClassName={styles.inputContainer}
              inputWrapperClassName={styles.inputWrapper}
              onChange={(e) =>
                onChange({ id: ark.id, balanceChange: e.target.value, type: 'remove' })
              }
              value={balanceRemoveChange[ark.id]}
              type="number"
            />
          ),
          'add-to-market': (
            <Input
              variant="withBorder"
              wrapperClassName={styles.inputContainer}
              inputWrapperClassName={styles.inputWrapper}
              onChange={(e) => onChange({ id: ark.id, balanceChange: e.target.value, type: 'add' })}
              value={balanceAddChange[ark.id]}
              type="number"
            />
          ),
          'new-balance': (
            <TableCellText>{formatCryptoBalance(ark.inputTokenBalance)}</TableCellText>
          ),
        },
      }
    })
}
