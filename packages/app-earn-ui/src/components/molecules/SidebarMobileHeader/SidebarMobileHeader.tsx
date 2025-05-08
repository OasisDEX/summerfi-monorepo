/* eslint-disable react/destructuring-assignment */
import { type FC } from 'react'
import { TransactionAction } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'

import { Button } from '@/components/atoms/Button/Button.tsx'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine.tsx'
import { Text } from '@/components/atoms/Text/Text.tsx'

type SidebarMobileHeaderProps =
  | {
      type: 'open'
      amount: string
      token: string
      isLoadingForecast: boolean
    }
  | {
      type: 'manage'
      sidebarTransactionType: TransactionAction
      setSidebarTransactionType: (type: TransactionAction) => void
    }

export const SidebarMobileHeader: FC<SidebarMobileHeaderProps> = (props) => {
  return props.type === 'open' ? (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          Est. earnings after 1y
        </Text>
        {props.isLoadingForecast ? (
          <div style={{ display: 'flex', alignItems: 'center', height: '22px' }}>
            <SkeletonLine width={80} height={12} />
          </div>
        ) : (
          <Text as="p" variant="p3semiColorful">
            {formatCryptoBalance(props.amount)} {props.token}
          </Text>
        )}
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
          props.sidebarTransactionType === TransactionAction.DEPOSIT
            ? 'primarySmall'
            : 'secondarySmall'
        }
        style={{ flex: 1 }}
        onClick={() => props.setSidebarTransactionType(TransactionAction.DEPOSIT)}
      >
        Deposit
      </Button>
      <Button
        variant={
          props.sidebarTransactionType === TransactionAction.WITHDRAW
            ? 'primarySmall'
            : 'secondarySmall'
        }
        style={{ flex: 1 }}
        onClick={() => props.setSidebarTransactionType(TransactionAction.WITHDRAW)}
      >
        Withdraw
      </Button>
    </div>
  )
}
