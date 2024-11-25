import { type FC, useState } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import { TransakPaymentOptions } from '@/features/transak/types'

import classNames from './TransakPaymentMethods.module.scss'

const paymentMethods = [
  { label: 'Card payment', value: TransakPaymentOptions.CREDIT_DEBIT_CARD },
  { label: 'Google Pay', value: TransakPaymentOptions.GOOGLE_PAY },
  { label: 'Apple Pay', value: TransakPaymentOptions.APPLE_PAY },
]

interface TransakPaymentMethodsProps {
  onChange: (paymentMethod: TransakPaymentOptions) => void
  defaultMethod: TransakPaymentOptions
}

export const TransakPaymentMethods: FC<TransakPaymentMethodsProps> = ({
  onChange,
  defaultMethod,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<TransakPaymentOptions>(defaultMethod)

  const handleChange = (method: TransakPaymentOptions) => {
    setPaymentMethod(method)
    onChange(method)
  }

  return paymentMethods.map((method) => (
    <div
      key={method.value}
      onClick={() => handleChange(method.value)}
      className={clsx(classNames.wrapper, {
        [classNames.selected]: paymentMethod === method.value,
      })}
    >
      <div className={classNames.button}>
        <Text
          as="p"
          variant="p4semi"
          style={{
            color: 'var(--earn-protocol-secondary-100)',
            padding: '0 var(--general-space-4)',
          }}
        >
          {method.label}
        </Text>
      </div>
    </div>
  ))
}
