import { Box, getScannerUrl, Icon, Text } from '@summerfi/app-earn-ui'
import { type TransactionType } from '@summerfi/sdk-common'
import Link from 'next/link'

import transactionsStyles from './TransactionHashPill.module.css'

export const TransactionHashPill = ({
  transactionData,
  chainId,
  removeTxHash,
}: {
  transactionData: {
    type: TransactionType
    hash?: string
    custom?: string
  }
  chainId: number
  removeTxHash: (txHash: string) => void
}) => {
  return (
    <Box className={transactionsStyles.hashPill}>
      {transactionData.hash ? (
        <Link href={getScannerUrl(chainId, transactionData.hash)} target="_blank">
          {transactionData.custom ? (
            <Text variant="p4">{transactionData.custom}</Text>
          ) : (
            <Text variant="p4">
              Click <p>here to view {transactionData.type}</p> transaction
            </Text>
          )}
        </Link>
      ) : transactionData.custom ? (
        <Text variant="p4">{transactionData.custom}</Text>
      ) : (
        <Text variant="p4">
          Click <p>here to view {transactionData.type}</p> transaction
        </Text>
      )}
      {transactionData.hash && (
        <div
          className={transactionsStyles.closeIcon}
          onClick={() => removeTxHash(transactionData.hash as string)}
        >
          <Icon iconName="close" size={10} />
        </div>
      )}
    </Box>
  )
}
