import { type FC, type PropsWithChildren } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import { type TransakPriceQuoteResponse } from '@/features/transak/types'

import classNames from './TransakExchangeDetails.module.scss'

const ListItem: FC<PropsWithChildren> = ({ children }) => (
  <Text as="div" variant="p4" className={classNames.listItem}>
    <div className={classNames.dot} />
    {children}
  </Text>
)

interface TransakExchangeDetailsProps {
  fiatCurrency: string
  details?: TransakPriceQuoteResponse
}

export const TransakExchangeDetails: FC<TransakExchangeDetailsProps> = ({
  fiatCurrency,
  details,
}) => {
  return (
    <div className={classNames.wrapper}>
      <div className={classNames.line} />
      <ul>
        <li>
          <ListItem>
            Transak Fee {details?.feeBreakdown[0].value ?? '-'} {fiatCurrency}
          </ListItem>
        </li>
        <li>
          <ListItem>
            Summer.fi Fee {details?.feeBreakdown[1].value ?? '-'} {fiatCurrency}
          </ListItem>
        </li>
        <li>
          <ListItem>
            Network Fee {details?.feeBreakdown[2].value ?? '-'} {fiatCurrency}
          </ListItem>
        </li>
      </ul>
    </div>
  )
}
