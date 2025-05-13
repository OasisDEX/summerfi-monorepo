import { Fragment } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import { TransakIconWrapper } from '@/features/transak/components/TransakIconWrapper/TransakIconWrapper'

import classNames from './TransakBuyEthStep.module.css'

const buyEthCopies = [
  {
    title: 'What is gas fee?',
    description:
      'Gas fees on the Ethereum network are small payments made to process transactions, similar to paying a toll that varies based on how busy the network is.',
  },
  {
    title: 'How much ETH should I buy?',
    description: (
      <>
        Transactions usually cost{' '}
        <Text
          as="span"
          variant="p2"
          style={{
            color: 'var(--earn-protocol-secondary-100)',
          }}
        >
          $0.24 to $1.00
        </Text>
        . We suggest buying{' '}
        <Text
          as="span"
          variant="p2"
          style={{
            color: 'var(--earn-protocol-secondary-100)',
          }}
        >
          $25 to $100
        </Text>{' '}
        for ETH
      </>
    ),
  },
]

export const TransakBuyEthStep = () => {
  return (
    <div className={classNames.buyEthWrapper}>
      <TransakIconWrapper icon="lightning_colorful" />
      {buyEthCopies.map((item) => (
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
