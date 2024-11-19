import { Box, Icon, SimpleGrid, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultType, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

import orderInfoDepositWithdrawStyles from './OrderInfoDepositWithdraw.module.scss'

type OrderInfoDepositProps = {
  vault: SDKVaultType
  amountParsed: BigNumber
  amountDisplayUSD: string
}

export const OrderInfoDeposit = ({
  vault,
  amountParsed,
  amountDisplayUSD,
}: OrderInfoDepositProps) => {
  return (
    <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
      <Icon tokenName={vault.inputToken.symbol as TokenSymbolsList} size={64} />
      <Text variant="h2">{formatCryptoBalance(amountParsed)}</Text>
      <Text variant="p2semi">{amountDisplayUSD}</Text>
      <Box className={orderInfoDepositWithdrawStyles.depositDetails}>
        <Text variant="p3semi" className={orderInfoDepositWithdrawStyles.depositDetailsTitle}>
          Liquidity & Fees
        </Text>
        <SimpleGrid columns={2} gap={2}>
          <Text variant="p3semi">Liquidity</Text>
          <Text variant="p3semi" className={orderInfoDepositWithdrawStyles.depositDetailsValue}>
            TBD
          </Text>
          <Text variant="p3semi">Fees</Text>
          <Text variant="p3semi" className={orderInfoDepositWithdrawStyles.depositDetailsValue}>
            TBD
          </Text>
        </SimpleGrid>
      </Box>
    </div>
  )
}
