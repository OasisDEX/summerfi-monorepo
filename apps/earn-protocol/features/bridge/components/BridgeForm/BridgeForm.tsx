'use client'
import React, { useState } from 'react'
import { Icon, InfoBox, Sidebar, Text } from '@summerfi/app-earn-ui'

import ChainSelector from '@/features/bridge/components/ChainSelector/ChainSelector'

import AmountInput from '../AmountInput/AmountInput'
import BridgeFormTitle from '../BridgeFormTitle/BridgeFormTitle'

import styles from './BridgeForm.module.scss'

export const BridgeForm = () => {
  const [sourceChain, setSourceChain] = useState<string>('')
  const [destinationChain, setDestinationChain] = useState<string>('')
  const [amount, setAmount] = useState<string>('')

  const handleBridge = () => {
    console.log('Bridging:', { sourceChain, destinationChain, amount })
  }

  return (
    <Sidebar
      centered
      title="Bridge"
      customHeader={<BridgeFormTitle />}
      content={
        <>
          <div className={styles.networkSelectors}>
            <ChainSelector label="From" value={sourceChain} onChange={setSourceChain} />
            <div className={styles.arrow}>
              <Icon iconName="arrow_forward" size={20} />
            </div>
            <ChainSelector label="To" value={destinationChain} onChange={setDestinationChain} />
          </div>
          <div className={styles.spacer} />
          <div className={styles.inputSection}>
            <AmountInput value={amount} onChange={setAmount} placeholder="Enter amount to bridge" />
          </div>
          <div className={styles.infoBox}>
            <InfoBox title="Important Info">
              <Text as="p" variant="p3">
                Bridging fee estimates, network delays, and other vital information will be shown
                here.
              </Text>
            </InfoBox>
          </div>
        </>
      }
      primaryButton={{
        label: 'Bridge',
        action: handleBridge,
      }}
      secondaryButton={{
        label: 'Cancel',
        action: () => {
          /* handle cancel */
        },
      }}
    />
  )
}
