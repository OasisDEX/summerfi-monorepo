'use client'
import { InfoBox, Text } from '@summerfi/app-earn-ui'
import { chainIdToSDKNetwork, sdkNetworkToHumanNetwork } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'
import { type Chain } from 'viem'

import styles from './TransactionDetails.module.scss'

interface TransactionDetailsProps {
  gasOnSource: number
  amountReceived: number
  lzFee: number
  destinationChain: Chain
  error: string | null
}

export const TransactionDetails = ({
  gasOnSource,
  amountReceived,
  destinationChain,
  lzFee,
  error,
}: TransactionDetailsProps) => {
  const rows = [
    {
      label: (
        <>
          Amount to receive on{' '}
          <Text variant="p3semiColorful">
            {capitalize(sdkNetworkToHumanNetwork(chainIdToSDKNetwork(destinationChain.id)))}
          </Text>
        </>
      ),
      value: amountReceived,
    },
    { label: 'Estimated Gas', value: gasOnSource },
    { label: 'LayerZero fee', value: lzFee },
  ]

  return (
    <div className={styles.infoBox}>
      <InfoBox title="Important Info" rows={rows} error={error ?? undefined} />
    </div>
  )
}
