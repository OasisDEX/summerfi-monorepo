import { type FC } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import { type TransakPaymentOptions } from '@/features/transak/types'

import classNames from './TransakPaymentMethods.module.css'

interface TransakPaymentMethodsProps {
  onChange: (paymentMethod: TransakPaymentOptions) => void
  defaultMethod: TransakPaymentOptions
  paymentMethods: { label: string; value: TransakPaymentOptions }[]
}

export const TransakPaymentMethods: FC<TransakPaymentMethodsProps> = ({
  onChange,
  defaultMethod,
  paymentMethods,
}) => {
  const handleChange = (method: TransakPaymentOptions) => {
    onChange(method)
  }

  return paymentMethods.map((method) => (
    <div
      key={method.value}
      onClick={() => handleChange(method.value)}
      className={clsx(classNames.wrapper, {
        [classNames.selected]: defaultMethod === method.value,
      })}
    >
      <div className={classNames.button}>
        <Text
          as="p"
          variant="p4semi"
          style={{
            color: 'var(--earn-protocol-secondary-100)',
            padding: '0 var(--general-space-4)',
            textAlign: 'center',
          }}
        >
          {method.label}
        </Text>
      </div>
    </div>
  ))
}
