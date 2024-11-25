import { type FC } from 'react'
import { EXTERNAL_LINKS, type IconNamesList, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { TransakIconWrapper } from '@/features/transak/components/TransakIconWrapper/TransakIconWrapper'
import { transakFailedOrderStatuses } from '@/features/transak/consts'
import { type TransakOrderData, TransakOrderDataStatus } from '@/features/transak/types'

import classNames from './TransakOrder.module.scss'

interface TransakOrderStepProps {
  orderData?: TransakOrderData
}

export const TransakOrderStep: FC<TransakOrderStepProps> = ({ orderData }) => {
  const resolvedIcon = {
    [TransakOrderDataStatus.PROCESSING]: { icon: 'checkmark_colorful' },
    [TransakOrderDataStatus.COMPLETED]: { icon: 'checkmark_colorful' },
    [TransakOrderDataStatus.FAILED]: { icon: 'close', color: 'var(--earn-protocol-critical-100)' },
    [TransakOrderDataStatus.CANCELED]: {
      icon: 'close',
      color: 'var(--earn-protocol-critical-100)',
    },
    [TransakOrderDataStatus.EXPIRED]: { icon: 'close', color: 'var(--earn-protocol-critical-100)' },
  }[orderData?.data.status ?? TransakOrderDataStatus.PROCESSING]

  return (
    <div className={classNames.wrapper}>
      <TransakIconWrapper icon={resolvedIcon.icon as IconNamesList} color={resolvedIcon.color} />
      <Text
        as="p"
        variant="p2"
        style={{ color: 'var(--earn-protocol-secondary-60)', textAlign: 'center' }}
      >
        {(!orderData || orderData.data.status === TransakOrderDataStatus.PROCESSING) &&
          "We will send you a confirmation email once the order is processed.'"}
        {orderData?.data.status === TransakOrderDataStatus.COMPLETED && (
          <>
            You now have{' '}
            <Text as="span" variant="p2" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
              {orderData.data.cryptoAmount} {orderData.data.cryptoCurrency}{' '}
            </Text>{' '}
            in your wallet.
          </>
        )}
        {orderData && transakFailedOrderStatuses.includes(orderData.data.status) && (
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
