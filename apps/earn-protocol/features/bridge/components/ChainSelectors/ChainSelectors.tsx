'use client'
import { Icon } from '@summerfi/app-earn-ui'
import { type Chain } from 'viem'

import { ChainSelector } from '@/features/bridge/components/ChainSelector/ChainSelector'

import styles from './ChainSelectors.module.scss'

interface ChainSelectorsProps {
  sourceChain: Chain
  destinationChain: Chain
  onSourceChainChange: ({ chain }: { chain: Chain }) => void
  onDestinationChainChange: ({ chain }: { chain: Chain }) => void
}

export const ChainSelectors = ({
  sourceChain,
  destinationChain,
  onSourceChainChange,
  onDestinationChainChange,
}: ChainSelectorsProps) => {
  return (
    <div className={styles.networkSelectors}>
      <ChainSelector label="From" chainId={sourceChain.id} onChange={onSourceChainChange} />
      <div className={styles.arrow}>
        <Icon iconName="arrow_forward" size={20} color="var(--earn-protocol-neutral-10)" />
      </div>
      <ChainSelector label="To" chainId={destinationChain.id} onChange={onDestinationChainChange} />
    </div>
  )
}
