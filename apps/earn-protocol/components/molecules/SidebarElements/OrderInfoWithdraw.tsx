import { Icon, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

import orderInfoDepositWithdrawStyles from './OrderInfoDepositWithdraw.module.scss'

type OrderInfoWithdrawProps = {
  vault: SDKVaultType | SDKVaultishType
  amountParsed: BigNumber
  amountDisplayUSD: string
}

export const OrderInfoWithdraw = ({
  vault,
  amountParsed,
  amountDisplayUSD,
}: OrderInfoWithdrawProps) => {
  return (
    <div className={orderInfoDepositWithdrawStyles.depositViewWrapper}>
      <Icon tokenName={vault.inputToken.symbol as TokenSymbolsList} size={64} />
      <Text variant="h2">{formatCryptoBalance(amountParsed)}</Text>
      <Text variant="p2semi">{amountDisplayUSD}</Text>
    </div>
  )
}
