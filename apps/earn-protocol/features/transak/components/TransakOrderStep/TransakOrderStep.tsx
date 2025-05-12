import { type FC, useEffect, useState } from 'react'
import { Dial, EXTERNAL_LINKS, type IconNamesList, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { TransakIconWrapper } from '@/features/transak/components/TransakIconWrapper/TransakIconWrapper'
import {
  transakFailedOrderStatuses,
  transakPaymentMethods,
  transakPendingOrderStatuses,
} from '@/features/transak/consts'
import { getTransakPaymentTimeInSeconds } from '@/features/transak/helpers/get-transak-payment-time-in-seconds'
import { getTransakRemainingOrderTime } from '@/features/transak/helpers/get-transak-remaining-order-time'
import { TransakOrderDataStatus, type TransakReducerState } from '@/features/transak/types'

import classNames from './TransakOrder.module.css'

interface TransakOrderStepProps {
  state: TransakReducerState
}

export const TransakOrderStep: FC<TransakOrderStepProps> = ({ state }) => {
  const [ellapsedSeconds, setEllapsedSeconds] = useState(0)
  const resolvedIcon = {
    [TransakOrderDataStatus.PROCESSING]: undefined,
    [TransakOrderDataStatus.PENDING_DELIVERY_FROM_TRANSAK]: undefined,
    [TransakOrderDataStatus.COMPLETED]: { icon: 'checkmark_colorful' },
    [TransakOrderDataStatus.FAILED]: { icon: 'close', color: 'var(--earn-protocol-critical-100)' },
    [TransakOrderDataStatus.CANCELED]: {
      icon: 'close',
      color: 'var(--earn-protocol-critical-100)',
    },
    [TransakOrderDataStatus.EXPIRED]: { icon: 'close', color: 'var(--earn-protocol-critical-100)' },
  }[state.orderData?.data.status ?? TransakOrderDataStatus.PROCESSING]

  const maxWaitingTime = getTransakPaymentTimeInSeconds(
    transakPaymentMethods.find((item) => item.id === state.paymentMethod)?.processingTime,
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setEllapsedSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={classNames.wrapper}>
      {resolvedIcon?.icon && (
        <TransakIconWrapper icon={resolvedIcon.icon as IconNamesList} color={resolvedIcon.color} />
      )}
      {(!state.orderData || transakPendingOrderStatuses.includes(state.orderData.data.status)) && (
        <div className={classNames.dialWrapper}>
          <Dial
            value={ellapsedSeconds}
            max={maxWaitingTime}
            subtext="Time left"
            rawValue={getTransakRemainingOrderTime(ellapsedSeconds, maxWaitingTime)}
          />
        </div>
      )}
      <Text
        as="p"
        variant="p2"
        style={{ color: 'var(--earn-protocol-secondary-60)', textAlign: 'center' }}
      >
        {(!state.orderData || transakPendingOrderStatuses.includes(state.orderData.data.status)) &&
          'This transaction could be done sooner. We will email you when it’s complete.'}
        {state.orderData?.data.status === TransakOrderDataStatus.COMPLETED && (
          <>
            You now have{' '}
            <Text as="span" variant="p2" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
              {state.orderData.data.cryptoAmount} {state.orderData.data.cryptoCurrency}{' '}
            </Text>{' '}
            in your wallet.
          </>
        )}
        {state.orderData && transakFailedOrderStatuses.includes(state.orderData.data.status) && (
          <>
            Oops, the transaction is failed. You can try it again or contact us in{' '}
            <Link href={EXTERNAL_LINKS.DISCORD} color="var(--earn-protocol-primary-100)">
              Discord
            </Link>
            . We will be happy to help you solve the issues.
          </>
        )}
      </Text>
    </div>
  )
}
