import { Box, Icon, SimpleGrid, Text } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { type ExtendedTransactionInfo, TransactionType } from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'

import orderInfoDepositWithdrawStyles from './OrderInfoDepositWithdraw.module.scss'

type OrderInfoDepositProps = {
  transaction: ExtendedTransactionInfo
  amountParsed: BigNumber
  amountDisplayUSD: string
  transactionFee?: string
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
      <Icon tokenName={fromAmount.token.symbol.toUpperCase() as TokenSymbolsList} size={64} />
      <Text variant="h2">{formatCryptoBalance(amountParsed)}</Text>
      <Text variant="p2semi">{amountDisplayUSD}</Text>
      <Box className={orderInfoDepositWithdrawStyles.depositDetails}>
        <Text variant="p3semi" className={orderInfoDepositWithdrawStyles.depositDetailsTitle}>
          Changes & Fees
        </Text>
        <SimpleGrid columns={2} gap={2}>
          <Text variant="p3semi">Deposit Amount</Text>
          <Text variant="p3semi" className={orderInfoDepositWithdrawStyles.depositDetailsValue}>
            {fromAmount.toString()}
          </Text>
          {toAmount && priceImpact && (
            <>
              <Text variant="p3semi">Swap</Text>
              <Text variant="p3semi" className={orderInfoDepositWithdrawStyles.depositDetailsValue}>
                {fromAmount.toString()} {'->'} {toAmount.toString()}
              </Text>
              <Text variant="p3semi">Price Impact</Text>
              <Text variant="p3semi" className={orderInfoDepositWithdrawStyles.depositDetailsValue}>
                {priceImpact.price.toString()} ({priceImpact.impact.toString()})
              </Text>
              <Text variant="p3semi">Slippage</Text>
              <Text variant="p3semi" className={orderInfoDepositWithdrawStyles.depositDetailsValue}>
                {slippage.toString()}
              </Text>
            </>
          )}
          <Text variant="p3semi">Transaction Fee</Text>
          <Text variant="p3semi" className={orderInfoDepositWithdrawStyles.depositDetailsValue}>
            {transactionFeeLoading ? 'Loading...' : transactionFee}
          </Text>
        </SimpleGrid>
      </Box>
    </div>
  )
}
