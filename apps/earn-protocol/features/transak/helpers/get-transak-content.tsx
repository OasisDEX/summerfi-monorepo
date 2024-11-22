import { type Dispatch, Fragment } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import { TransakExchange } from '@/features/transak/components/TransakExchange/TransakExchange'
import { TransakIconWrapper } from '@/features/transak/components/TransakIconWrapper/TransakIconWrapper'
import {
  type TransakReducerAction,
  type TransakReducerState,
  TransakSteps,
} from '@/features/transak/types'

const initialStepCopies = [
  {
    title: 'Simpler login',
    description: 'Create a passkey to enable quick and easy login with Face ID or Touch ID.',
  },
  {
    title: 'Enhanced security',
    description: 'Prevent phishing and theft by registering a passkey with your device.',
  },
]

const aboutKYCCopies = [
  {
    title: 'Why need to do KYC?',
    description:
      'Bibendum dolor nunc ultricies iaculis nullam in. Mauris in tristique suspendisse auctor nisl.',
  },
  {
    title: 'Multiple KYC levels',
    description:
      'Each higher level requires more information to verify a user’s account and comes with the benefit of higher order limits.',
  },
  {
    title: 'What information you need to provide',
    description: 'Your full name, phone number, and current address.',
  },
]

export const getTransakContent = ({
  step,
  dispatch,
  state,
  isMobile,
}: {
  step: TransakSteps
  dispatch: Dispatch<TransakReducerAction>
  state: TransakReducerState
  isMobile: boolean
}) => {
  switch (step) {
    case TransakSteps.INITIAL:
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '398px',
            marginBottom: 'var(--general-space-24)',
          }}
        >
          <TransakIconWrapper
            icon="down_up"
            color="var(--earn-protocol-secondary-100)"
            with3rdLayer
          />
          {initialStepCopies.map((item) => (
            <Fragment key={item.title}>
              <Text
                as="p"
                variant="p2"
                style={{
                  color: 'var(--earn-protocol-secondary-100)',
                  marginBottom: 'var(--general-space-4)',
                }}
              >
                {item.title}
              </Text>
              <Text
                as="p"
                variant="p2"
                style={{
                  color: 'var(--earn-protocol-secondary-60)',
                  marginBottom: 'var(--general-space-16)',
                }}
              >
                {item.description}
              </Text>
            </Fragment>
          ))}
        </div>
      )
    case TransakSteps.ABOUT_KYC:
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '398px',
            marginBottom: 'var(--general-space-24)',
          }}
        >
          <TransakIconWrapper icon="kyc_colorful" size={45} />
          {aboutKYCCopies.map((item) => (
            <Fragment key={item.title}>
              <Text
                as="p"
                variant="p2"
                style={{
                  color: 'var(--earn-protocol-secondary-100)',
                  marginBottom: 'var(--general-space-4)',
                }}
              >
                {item.title}
              </Text>
              <Text
                as="p"
                variant="p2"
                style={{
                  color: 'var(--earn-protocol-secondary-60)',
                  marginBottom: 'var(--general-space-16)',
                }}
              >
                {item.description}
              </Text>
            </Fragment>
          ))}
        </div>
      )
    case TransakSteps.EXCHANGE:
      return <TransakExchange dispatch={dispatch} state={state} />
    case TransakSteps.KYC:
      return state.orderData ? null : (
        <div
          id="transak-dialog"
          style={{
            width: isMobile ? '100%' : '500px',
            height: '800px',
            margin: 'var(--general-space-16) auto',
          }}
        />
      )
    default:
      return 'Define me'
  }
}
