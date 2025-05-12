import { Fragment } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import { TransakIconWrapper } from '@/features/transak/components/TransakIconWrapper/TransakIconWrapper'

import classNames from './TransakInitialStep.module.css'

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

export const TransakInitialStep = () => {
  return (
    <div className={classNames.transakInitialStepWrapper}>
      <TransakIconWrapper icon="down_up" color="var(--earn-protocol-secondary-100)" with3rdLayer />
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
}
