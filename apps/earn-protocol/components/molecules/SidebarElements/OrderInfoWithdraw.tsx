import { Icon, OrderInformation, Text } from '@summerfi/app-earn-ui'
import { SDKChainId, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance, formatPercent } from '@summerfi/app-utils'
import { type ExtendedTransactionInfo, type IToken, TransactionType } from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'

import orderInfoDepositWithdrawStyles from './OrderInfoDepositWithdraw.module.scss'

type OrderInfoWithdrawProps = {
  transaction: ExtendedTransactionInfo
  amountParsed: BigNumber
  amountDisplayUSD: string
  transactionFee?: string
  chainId: SDKChainId
  transactionFeeLoading: boolean
}

export const OrderInfoWithdraw = ({
  transaction,
  amountParsed,
  amountDisplayUSD,
  transactionFee,
  chainId,
  transactionFeeLoading,
}: OrderInfoWithdrawProps) => {
  if (transaction.type !== TransactionType.Withdraw) {
    throw new Error('Invalid transaction type')
  }

  const { fromAmount, slippage, priceImpact, toAmount } = transaction.metadata

  return (
    <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
      <Icon tokenName={fromAmount.token.symbol.toUpperCase() as TokenSymbolsList} size={64} />
      <Text variant="h2">{formatCryptoBalance(amountParsed)}</Text>
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
              label: 'Withdraw Amount',
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
                    value: `${formatCryptoBalance(priceImpact.price.value)} ${
                      (priceImpact.price.quote as IToken).symbol
                    }/${(priceImpact.price.base as IToken).symbol}`,
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
