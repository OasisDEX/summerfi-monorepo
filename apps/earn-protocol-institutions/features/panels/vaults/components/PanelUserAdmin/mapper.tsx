import { Button, Icon, TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'

import { getRevokeWhitelistId } from '@/helpers/get-transaction-id'
import { type SDKTransactionItem } from '@/hooks/useSDKTransactionQueue'

import styles from './PanelUser.module.css'

type UserMapperParams = {
  whitelistedWallets: string[]
  transactionQueue: SDKTransactionItem[]
  onRevokeWhitelist: (params: { address: string }) => void
  chainId: number
}

export const userAdminMapper = ({
  whitelistedWallets,
  transactionQueue,
  onRevokeWhitelist,
  chainId,
}: UserMapperParams) => {
  return whitelistedWallets.map((address) => {
    const revokeId = getRevokeWhitelistId({ address, chainId })
    const idDisabled = transactionQueue.some((tx) => tx.id === revokeId)

    return {
      content: {
        address: <TableCellNodes className={styles.tableCellAddress}>{address}</TableCellNodes>,
        action: (
          <TableCellText style={{ marginLeft: '40px', gap: 'var(--spacing-space-small)' }}>
            <Button
              variant="unstyled"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              onClick={() => onRevokeWhitelist({ address })}
              disabled={idDisabled}
            >
              <Icon
                iconName="trash"
                size={16}
                className={styles.trashButton}
                style={{
                  opacity: idDisabled ? 0.5 : 1,
                }}
              />
            </Button>
          </TableCellText>
        ),
      },
    }
  })
}
