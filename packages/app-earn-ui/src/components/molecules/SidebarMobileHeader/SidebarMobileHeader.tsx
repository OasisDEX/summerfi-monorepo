/* eslint-disable react/destructuring-assignment */
import { type FC } from 'react'
import { TransactionAction } from '@summerfi/app-types'

import { Button } from '@/components/atoms/Button/Button.tsx'
import { Text } from '@/components/atoms/Text/Text.tsx'

type SidebarMobileHeaderProps =
  | {
      type: 'open'
      amount: string
      token: string
    }
  | {
      type: 'manage'
      transactionType: TransactionAction
      setTransactionType: (type: TransactionAction) => void
    }

export const SidebarMobileHeader: FC<SidebarMobileHeaderProps> = (props) => {
  return props.type === 'open' ? (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          Est. earnings after 1y
        </Text>
        <Text as="p" variant="p3semiColorful">
          {props.amount} {props.token}
        </Text>
      </div>
      <Button variant="primarySmall" style={{ padding: '0 var(--general-space-16)' }}>
        Deposit
      </Button>
    </>
  ) : (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--general-space-16)',
        width: '100%',
      }}
    >
      <Button
        variant={
          props.transactionType === TransactionAction.DEPOSIT ? 'primarySmall' : 'secondarySmall'
        }
        style={{ flex: 1 }}
        onClick={() => props.setTransactionType(TransactionAction.DEPOSIT)}
      >
        Deposit
      </Button>
      <Button
        variant={
          props.transactionType === TransactionAction.WITHDRAW ? 'primarySmall' : 'secondarySmall'
        }
        style={{ flex: 1 }}
        onClick={() => props.setTransactionType(TransactionAction.WITHDRAW)}
      >
        Withdraw
      </Button>
    </div>
  )
}
