'use client'
import { InfoBox, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import {
  chainIdToSDKNetwork,
  formatCryptoBalance,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'
import { type Chain } from 'viem'

import styles from './TransactionDetails.module.css'

interface TransactionDetailsProps {
  loading: boolean
  gasOnSource: string
  gasOnSourceRaw: string
  amountReceived: string
  lzFee: string
  destinationChain: Chain
  error?: string | null
}

export const TransactionDetails = ({
  gasOnSource,
  amountReceived,
  destinationChain,
  lzFee,
  error,
  loading,
}: TransactionDetailsProps) => {
  const rowsA = [
    {
      label: 'Gas cost',
      value: loading ? (
        <SkeletonLine width={100} height={20} />
      ) : (
        `${formatCryptoBalance(gasOnSource, '$')}`
      ),
      type: 'entry' as const,
    },
    {
      label: 'Messaging fee',
      value: loading ? <SkeletonLine width={100} height={20} /> : `$${formatCryptoBalance(lzFee)}`,
      type: 'entry' as const,
    },
  ]

  const rowsB = [
    {
      label: (
        <>
          You receive{' '}
          <Text variant="p3semiColorful">
            ({capitalize(sdkNetworkToHumanNetwork(chainIdToSDKNetwork(destinationChain.id)))})
          </Text>
        </>
      ),
      value: loading ? (
        <SkeletonLine width={100} height={20} />
      ) : (
        formatCryptoBalance(amountReceived)
      ),
      type: 'entry' as const,
    },
    {
      label: 'Estimated time',
      value: loading ? <SkeletonLine width={100} height={20} /> : '~2 mins',
      type: 'entry' as const,
    },
  ]

  return (
    <div className={styles.container}>
      <div>
        <InfoBox title="Fees" rows={rowsA} error={error ?? undefined} />
      </div>
      <div>
        <InfoBox rows={rowsB} />
      </div>
    </div>
  )
}
