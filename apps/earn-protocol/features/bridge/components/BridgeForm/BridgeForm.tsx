'use client'
import React, { useState } from 'react'
import { Button, Card, Text } from '@summerfi/app-earn-ui'

import AmountInput from '@/components/AmountInput' // Numeric input with USD conversion display
import ChainSelector from '@/components/ChainSelector' // Chain selector with chain icon and name
import InfoAccordion from '@/components/InfoAccordion' // Collapsible section for important info
import QuickActionButtons from '@/components/QuickActionButtons' // Buttons like 25%, 50%, Max
import TokenSelector from '@/components/TokenSelector' // Token selector preset to SUMR

import styles from './BridgeForm.module.scss'

export const BridgeForm = () => {
  const [sourceChain, setSourceChain] = useState<string>('')
  const [destinationChain, setDestinationChain] = useState<string>('')
  const [amount, setAmount] = useState<string>('')

  const handleBridge = () => {
    // TODO: Add actual bridging logic (API calls, validations, fee estimation, etc.)
    console.log('Bridging with:', { sourceChain, destinationChain, amount })
  }

  return (
    <Card className={`${styles.bridgeForm} p-4`}>
      <Text variant="h2" as="h2">
        Bridge SUMR Tokens
      </Text>
      <div className="mt-4 space-y-4">
        <ChainSelector label="Transfer From" value={sourceChain} onChange={setSourceChain} />
        <ChainSelector
          label="Transfer To"
          value={destinationChain}
          onChange={setDestinationChain}
        />
      </div>
      <div className="mt-4 space-y-4">
        {/* Pre-set token selector for SUMR */}
        <TokenSelector token="SUMR" />
        <AmountInput value={amount} onChange={setAmount} placeholder="Enter amount to bridge" />
        <QuickActionButtons
          onSelect={(percentage) => {
            // TODO: Update the amount based on quick action percentage
            console.log('Quick action percentage:', percentage)
          }}
        />
      </div>
      <div className="mt-4">
        <InfoAccordion header="Important Info">
          <Text as="p">
            Bridging fee estimates, network delays, and other vital information will be shown here.
          </Text>
        </InfoAccordion>
      </div>
      <div className="mt-4">
        <Button onClick={handleBridge} variant="primarySmall">
          Bridge
        </Button>
      </div>
    </Card>
  )
}
