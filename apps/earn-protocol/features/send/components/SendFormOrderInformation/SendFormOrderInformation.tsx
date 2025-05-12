import { type FC } from 'react'
import { Icon, networkIconByChainId, OrderInformation } from '@summerfi/app-earn-ui'
import { type IconNamesList } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatFiatBalance,
  humanReadableChainToLabelMap,
} from '@summerfi/app-utils'

import { type SendState } from '@/features/send/types'
import { isValidAddress } from '@/helpers/is-valid-address'

import classNames from './SendFormOrderInformation.module.scss'

interface SendFormOrderInformationProps {
  state: SendState
  amountDisplay: string
  transactionFee?: string
  transactionFeeLoading: boolean
}

export const SendFormOrderInformation: FC<SendFormOrderInformationProps> = ({
  state,
  amountDisplay,
  transactionFee,
  transactionFeeLoading,
}) => {
  const isInvalidAddress = state.recipientAddress !== '' && !isValidAddress(state.recipientAddress)

  if (isInvalidAddress || amountDisplay === '0') {
    return null
  }

  return (
    <div className={classNames.sendFormOrderInformationWrapper}>
      <OrderInformation
        items={[
          {
            label: 'Network',
            value: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
                {humanReadableChainToLabelMap[state.tokenDropdown.chainId]}
                <Icon
                  iconName={networkIconByChainId[state.tokenDropdown.chainId] as IconNamesList}
                  size={16}
                />
              </div>
            ),
          },
          {
            label: 'Sending',
            value: `${formatCryptoBalance(amountDisplay)} ${state.tokenDropdown.tokenSymbol}`,
          },
          {
            label: 'Transaction Fee',
            value: transactionFee ? `$${formatFiatBalance(transactionFee)}` : 'n/a',
            tooltip: 'Estimated transaction fee for this operation',
            isLoading: transactionFeeLoading,
          },
        ]}
      />
    </div>
  )
}
