'use client'
import { type SDKNetwork } from '@summerfi/app-types'
import { type Chain } from 'viem'

import { ArrowSplitter } from '@/features/bridge/components/ArrowSplitter/ArrowSplitter'
import { ChainSelector } from '@/features/bridge/components/ChainSelector/ChainSelector'

import styles from './ChainSelectors.module.css'

interface ChainSelectorsProps {
  sourceChain: Chain
  destinationChain: Chain
  onSourceChainChange: (network: SDKNetwork) => void
  onDestinationChainChange: (network: SDKNetwork) => void
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
      <ArrowSplitter />
      <ChainSelector label="To" chainId={destinationChain.id} onChange={onDestinationChainChange} />
    </div>
  )
}
