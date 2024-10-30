import { Box, getScannerUrl, Icon, Text } from '@summerfi/app-earn-ui'
import { type EarnTransactionTypes } from '@summerfi/app-types'
import Link from 'next/link'

import transactionsStyles from './TransactionHashPill.module.scss'

export const TransactionHashPill = ({
  transactionData,
  chainId,
  removeTxHash,
}: {
  transactionData: {
    type: EarnTransactionTypes
    hash: string
  }
  chainId: number
  removeTxHash: (txHash: string) => void
}) => {
  return (
    <Box className={transactionsStyles.hashPill}>
      <Link href={getScannerUrl(chainId, transactionData.hash)} target="_blank">
        <Text variant="p4">
          Click <p>here to view {transactionData.type}</p> transaction
        </Text>
      </Link>
      <div
        className={transactionsStyles.closeIcon}
        onClick={() => removeTxHash(transactionData.hash)}
      >
        <Icon iconName="close" size={10} />
      </div>
    </Box>
  )
}
