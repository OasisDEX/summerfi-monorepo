import { type FC, useState } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import { TransakPaymentOptions } from '@/features/transak/types'

import classNames from './TransakPaymentMethods.module.scss'

const paymentMethods = [
  { label: 'Bank Transfer', value: TransakPaymentOptions.GBP_BANK_TRANSFER },
  { label: 'Card payment', value: TransakPaymentOptions.CREDIT_DEBIT_CARD },
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
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
          {method.label}
        </Text>
      </div>
    </div>
  ))
}
