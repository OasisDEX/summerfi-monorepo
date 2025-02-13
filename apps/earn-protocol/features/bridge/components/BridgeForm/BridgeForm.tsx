'use client'
import { type FC, useState } from 'react'
import { Sidebar } from '@summerfi/app-earn-ui'

import { BridgeFormTitle } from '@/features/bridge/components/BridgeFormTitle/BridgeFormTitle'
import { BridgeInput } from '@/features/bridge/components/BridgeInput/BridgeInput'
import { ChainSelectors } from '@/features/bridge/components/ChainSelectors/ChainSelectors'
import { Spacer } from '@/features/bridge/components/Spacer/Spacer'
import { TransactionDetails } from '@/features/bridge/components/TransactionDetails/TransactionDetails'
import { type BridgeExternalData } from '@/features/bridge/types'

interface BridgeFormProps {
  walletAddress: string
  externalData: BridgeExternalData | null
}

export const BridgeForm: FC<BridgeFormProps> = ({ walletAddress, externalData }) => {
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
          <ChainSelectors
            sourceChain={sourceChain}
            destinationChain={destinationChain}
            onSourceChainChange={setSourceChain}
            onDestinationChainChange={setDestinationChain}
          />
          <Spacer />
          <BridgeInput value={amount} onChange={setAmount} placeholder="Enter amount to bridge" />
          <TransactionDetails />
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
