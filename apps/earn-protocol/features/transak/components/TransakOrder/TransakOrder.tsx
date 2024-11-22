import { type FC } from 'react'
import { Button, Text } from '@summerfi/app-earn-ui'

import { type TransakOrderData } from '@/features/transak/types'

import classNames from './TransakOrder.module.scss'

interface TransakOrderProps {
  orderData: TransakOrderData
}

export const TransakOrder: FC<TransakOrderProps> = ({ orderData }) => {
  return (
    <div className={classNames.wrapper}>
      <Text as="h5" variant="h5">
        All done!
      </Text>
      <Text as="h5" variant="h5" style={{ marginBottom: 'var(--general-space-24)' }}>
        We are processing your order
      </Text>
      <Text
        as="p"
        variant="p2semi"
        style={{ color: 'var(--earn-protocol-secondary-60)', textAlign: 'center' }}
      >
        We will send you a confirmation email once the order is processed.
      </Text>
      <div className={classNames.buttonsWrapper}>
        <Button variant="primaryLarge" className={classNames.button}>
          Back to App
        </Button>
        <Button variant="secondaryLarge" className={classNames.button}>
          Track the Order
        </Button>
      </div>
    </div>
  )
}
