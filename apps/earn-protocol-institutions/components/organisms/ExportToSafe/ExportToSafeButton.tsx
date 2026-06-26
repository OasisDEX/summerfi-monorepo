'use client'

import { useState } from 'react'
import { Button } from '@summerfi/app-earn-ui'

import { ExportToSafeModal } from '@/components/organisms/ExportToSafe/ExportToSafeModal'
import { type SDKTransactionItem } from '@/contexts/TransactionQueueContext/types'

export const ExportToSafeButton = ({ transactions }: { transactions: SDKTransactionItem[] }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="secondarySmall" onClick={() => setIsOpen(true)}>
        Export to Safe
      </Button>
      <ExportToSafeModal
        transactions={transactions}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
