import { Expander, getDisplayToken, getScannerUrl, Icon, Text } from '@summerfi/app-earn-ui'
import { type TransactionWithStatus } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { TransactionType } from '@summerfi/sdk-common'
import Link from 'next/link'

import pendingTransactionsListStyles from './PendingTransactionsList.module.css'

const getHumanReadableDescription = (tx: TransactionWithStatus) => {
  switch (tx.type) {
    case TransactionType.Approve:
      return (
        <>
          Approve spending&nbsp;
          <b>
            {formatCryptoBalance(tx.metadata.approvalAmount.amount)}&nbsp;
            {getDisplayToken(tx.metadata.approvalAmount.token.symbol)}
          </b>
        </>
      )
    case TransactionType.Deposit:
      return (
        <>
          Deposit&nbsp;
          <b>
            {formatCryptoBalance(tx.metadata.fromAmount.amount)}&nbsp;
            {getDisplayToken(tx.metadata.fromAmount.token.symbol)}
          </b>
        </>
      )
    case TransactionType.Withdraw:
      return (
        <>
          Withdraw&nbsp;
          <b>
            {formatCryptoBalance(tx.metadata.fromAmount.amount)}&nbsp;
            {getDisplayToken(tx.metadata.fromAmount.token.symbol)}
          </b>
        </>
      )
    case TransactionType.VaultSwitch:
      return (
        <>
          Vault switch&nbsp;
          <b>{getDisplayToken(tx.metadata.fromAmount.token.symbol)}</b>&nbsp;to&nbsp;
          <b>{getDisplayToken(tx.metadata.toAmount?.token.symbol ?? 'n/a')}</b>
        </>
      )
    default:
      return `Transaction not mapped - (${(tx as TransactionWithStatus).type})`
  }
}

export const PendingTransactionsList = ({
  transactions,
  chainId,
}: {
  transactions?: TransactionWithStatus[]
  chainId: number
}) => {
  const transactionCount = transactions?.length ?? 0
  const pendingTransactions = transactions?.filter((tx) => !tx.executed).length ?? 0
  const executedTransactions = transactions?.filter((tx) => tx.executed).length ?? 0

  return transactionCount && pendingTransactions ? (
    <div style={{ marginTop: '16px' }}>
      <Expander
        title={
          <span>
            {transactionCount} {transactionCount > 1 ? 'transactions' : 'transaction'}
            {executedTransactions ? (
              <small style={{ color: 'var(--color-text-success)' }}>
                &nbsp;({executedTransactions} executed)
              </small>
            ) : (
              ''
            )}
          </span>
        }
      >
        <div className={pendingTransactionsListStyles.transactionList}>
          {transactions?.map((tx) => (
            <Text
              key={tx.description}
              variant="p4"
              className={pendingTransactionsListStyles.transactionitem}
            >
              <div style={{ display: 'flex', alignContent: 'center' }}>
                <Icon
                  iconName="checkmark_colorful_slim"
                  style={{
                    opacity: tx.executed ? 1 : 0,
                    color: 'green',
                    marginRight: '4px',
                  }}
                  size={20}
                />
                {getHumanReadableDescription(tx)}
              </div>
              {tx.txHash && (
                <Link href={getScannerUrl(chainId, tx.txHash)} target="_blank">
                  <Text
                    variant="p4semi"
                    style={{
                      color: 'var(--color-text-link)',
                    }}
                  >
                    view transaction
                  </Text>
                </Link>
              )}
            </Text>
          ))}
        </div>
      </Expander>
    </div>
  ) : null
}
