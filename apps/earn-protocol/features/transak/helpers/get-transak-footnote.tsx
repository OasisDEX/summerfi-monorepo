import { type Dispatch, type FC } from 'react'
import { Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import {
  TransakOrderDataStatus,
  type TransakReducerAction,
  type TransakReducerState,
  TransakSteps,
} from '@/features/transak/types'

interface TransakFootNoteLinkProps {
  label: string
  href: string
  withArrow?: boolean
}

const TransakFootNoteLink: FC<TransakFootNoteLinkProps> = ({ label, href, withArrow = true }) => (
  <Link href={href} target="_blank">
    {withArrow && (
      <WithArrow withStatic style={{ color: 'var(--earn-protocol-primary-100)' }} variant="p3semi">
        {label}
      </WithArrow>
    )}
    {!withArrow && (
      <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
        {label}
      </Text>
    )}
  </Link>
)

const defaultLink = {
  link: 'https://transak.com/',
  label: 'Learn more about KYC',
}

export const getTransakFootnote = ({
  state,
  dispatch,
}: {
  state: TransakReducerState
  dispatch: Dispatch<TransakReducerAction>
}) => {
  switch (state.step) {
    case TransakSteps.ORDER: {
      const isOrderCompleted = state.orderData?.data.status === TransakOrderDataStatus.COMPLETED
      const transactionLink = state.orderData?.data.transactionLink

      const resolvedLabel = isOrderCompleted ? 'View on Etherscan' : defaultLink.label
      const resolvedLink = isOrderCompleted && transactionLink ? transactionLink : defaultLink.link

      return <TransakFootNoteLink label={resolvedLabel} href={resolvedLink} />
    }
    case TransakSteps.SWITCH_TO_L2:
      return <TransakFootNoteLink label="What is Layer 2?" href="/" withArrow={false} />
    case TransakSteps.BUY_ETH:
      return (
        <Text
          as="p"
          variant="p3semi"
          style={{ color: 'var(--earn-protocol-primary-100)', cursor: 'pointer' }}
          onClick={() => dispatch({ type: 'update-step', payload: TransakSteps.EXCHANGE })}
        >
          I already have ETH
        </Text>
      )
    default:
      return <TransakFootNoteLink label={defaultLink.label} href={defaultLink.link} />
  }
}
