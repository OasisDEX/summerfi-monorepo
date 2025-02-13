'use client'
import { Icon } from '@summerfi/app-earn-ui'
import { ChainSelector } from '@/features/bridge/components/ChainSelector/ChainSelector'
import styles from './ChainSelectors.module.scss'

interface ChainSelectorsProps {
  sourceChain: string
  destinationChain: string
  onSourceChainChange: (value: string) => void
  onDestinationChainChange: (value: string) => void
}

export const ChainSelectors = ({
  sourceChain,
  destinationChain,
  onSourceChainChange,
  onDestinationChainChange,
}: ChainSelectorsProps) => {
  return (
    <div className={styles.networkSelectors}>
      <ChainSelector label="From" value={sourceChain} onChange={onSourceChainChange} />
      <div className={styles.arrow}>
        <Icon iconName="arrow_forward" size={20} />
      </div>
      <ChainSelector label="To" value={destinationChain} onChange={onDestinationChainChange} />
    </div>
  )
}
