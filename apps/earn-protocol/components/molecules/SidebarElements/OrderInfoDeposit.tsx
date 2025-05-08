import { Icon, OrderInformation, Text } from '@summerfi/app-earn-ui'
import {
  type SDKChainId,
  type TokenSymbolsList,
  type TransactionWithStatus,
} from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance, formatPercent } from '@summerfi/app-utils'
import { type IToken, TransactionType } from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'

import orderInfoDepositWithdrawStyles from './OrderInfoDepositWithdraw.module.scss'

type OrderInfoDepositProps = {
  transaction: TransactionWithStatus
  amountParsed: BigNumber
  amountDisplayUSD: string
  transactionFee?: string
  chainId: SDKChainId
  transactionFeeLoading: boolean
}

export const OrderInfoDeposit = ({
  transaction,
  amountParsed,
  amountDisplayUSD,
  transactionFee,
  transactionFeeLoading,
}: OrderInfoDepositProps) => {
  if (transaction.type !== TransactionType.Deposit) {
    throw new Error('Invalid transaction type')
  }

  const { fromAmount, slippage, priceImpact, toAmount } = transaction.metadata

  return (
    <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
      <div className={orderInfoDepositWithdrawStyles.multipleTokensWrapper}>
        <Icon tokenName={fromAmount.token.symbol.toUpperCase() as TokenSymbolsList} size={64} />
        {toAmount && priceImpact && (
          <>
            {'->'}
            <Icon tokenName={toAmount.token.symbol.toUpperCase() as TokenSymbolsList} size={64} />
          </>
        )}
      </div>
      <Text variant="h2">
        {formatCryptoBalance(amountParsed)}&nbsp;{fromAmount.token.symbol}
      </Text>
      <Text variant="p2semi">{amountDisplayUSD}</Text>
      <div className={orderInfoDepositWithdrawStyles.depositDetails}>
        <Text variant="p3semi" className={orderInfoDepositWithdrawStyles.depositDetailsTitle}>
          Changes & Fees
        </Text>

        <OrderInformation
          wrapperStyles={{
            padding: 'var(--general-space-8)',
          }}
          items={[
            {
              label: 'Deposit Amount',
              value: `${formatCryptoBalance(fromAmount.amount)} ${fromAmount.token.symbol}`,
            },
            ...(toAmount && priceImpact
              ? [
                  {
                    label: 'Swap',
                    value: (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '4px',
                        }}
                      >
                        <Icon
                          tokenName={fromAmount.token.symbol.toUpperCase() as TokenSymbolsList}
                          size={20}
                        />
                        {formatCryptoBalance(fromAmount.amount)}&nbsp;{'->'}
                        <Icon
                          tokenName={toAmount.token.symbol.toUpperCase() as TokenSymbolsList}
                          size={20}
                        />
                        {formatCryptoBalance(toAmount.amount)}
                      </div>
                    ),
                  },
                  {
                    label: 'Price',
                    value: priceImpact.price
                      ? `${formatCryptoBalance(priceImpact.price.value)} ${
                          (priceImpact.price.quote as IToken).symbol
                        }/${(priceImpact.price.base as IToken).symbol}`
                      : 'n/a',
                  },
                  {
                    label: 'Price Impact',
                    value: priceImpact.impact?.value
                      ? formatPercent(priceImpact.impact.value, { precision: 2 })
                      : 'n/a',
                  },
                  {
                    label: 'Slippage',
                    value: formatPercent(slippage.value, { precision: 2 }),
                  },
                  {
                    label: 'Depositing into Strategy',
                    value: `${formatCryptoBalance(toAmount.amount)} ${toAmount.token.symbol}`,
                  },
                ]
              : []),
            {
              label: 'Transaction Fee',
              value: transactionFee ? `$${formatFiatBalance(transactionFee)}` : 'n/a',
              isLoading: transactionFeeLoading,
            },
          ]}
        />
      </div>
    </div>
  )
}
