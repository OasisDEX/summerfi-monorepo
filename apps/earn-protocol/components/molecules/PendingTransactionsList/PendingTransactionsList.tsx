import { Expander, getDisplayToken, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import {
  type ExtendedTransactionInfo,
  TransactionType,
  type VaultSwitchTransactionInfo,
} from '@summerfi/sdk-common'

import pendingTransactionsListStyles from './PendingTransactionsList.module.scss'

const getHumanReadableDescription = (tx: ExtendedTransactionInfo | VaultSwitchTransactionInfo) => {
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
      return `Transaction not mapped - (${(tx as ExtendedTransactionInfo | VaultSwitchTransactionInfo).type})`
  }
}

export const PendingTransactionsList = ({
  transactions,
}: {
  transactions?: (ExtendedTransactionInfo | VaultSwitchTransactionInfo)[]
}) => {
  const transactionCount = transactions?.length ?? 0

  return transactionCount ? (
    <div style={{ marginTop: '16px' }}>
      <Expander title={`${transactionCount} pending transactions`}>
        <div className={pendingTransactionsListStyles.transactionList}>
          {transactions?.map((tx) => (
            <Text
              key={tx.description}
              variant="p4"
              className={pendingTransactionsListStyles.transactionitem}
            >
              {getHumanReadableDescription(tx)}
            </Text>
          ))}
        </div>
      </Expander>
    </div>
  ) : null
}
