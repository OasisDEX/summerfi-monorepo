import { useChain } from '@account-kit/react'
import { formatCryptoBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { ArrowSplitter } from '@/features/bridge/components/ArrowSplitter/ArrowSplitter'
import { NetworkDisplay } from '@/features/bridge/components/NetworkDisplay/NetworkDisplay'
import { type BridgeState } from '@/features/bridge/types'

import styles from './NetworkBalances.module.css'

interface NetworkBalancesProps {
  sourceHumanNetworkName: keyof BridgeState['sumrBalances']
  destinationHumanNetworkName: keyof BridgeState['sumrBalances']
  amount: string
  sumrBalances: BridgeState['sumrBalances']
  destinationChainId: number
}

export const NetworkBalances = ({
  sourceHumanNetworkName,
  destinationHumanNetworkName,
  amount,
  sumrBalances,
  destinationChainId,
}: NetworkBalancesProps) => {
  const { chain: sourceChain } = useChain()

  if (!amount || new BigNumber(amount).isNaN() || new BigNumber(amount).isLessThan(0)) {
    return (
      <div className={styles.networkBalancesWrapper}>
        <NetworkDisplay chainId={sourceChain.id} amount="0" />
        <div className={styles.arrowSplitterWrapper}>
          <ArrowSplitter />
        </div>
        <NetworkDisplay chainId={destinationChainId} amount="0" />
      </div>
    )
  }

  return (
    <div className={styles.networkBalancesWrapper}>
      <NetworkDisplay
        chainId={sourceChain.id}
        amount={formatCryptoBalance(
          new BigNumber(sumrBalances[sourceHumanNetworkName])
            .minus(new BigNumber(amount))
            .toString(),
        )}
      />
      <div className={styles.arrowSplitterWrapper}>
        <ArrowSplitter />
      </div>
      <NetworkDisplay
        chainId={destinationChainId}
        amount={formatCryptoBalance(
          new BigNumber(amount)
            .plus(new BigNumber(sumrBalances[destinationHumanNetworkName]))
            .toString(),
        )}
      />
    </div>
  )
}
