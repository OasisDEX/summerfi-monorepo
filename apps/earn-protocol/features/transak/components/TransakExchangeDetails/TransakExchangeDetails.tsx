import { type FC, type PropsWithChildren } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import { type TransakPriceQuoteResponse } from '@/features/transak/types'

import classNames from './TransakExchangeDetails.module.css'

const fees: {
  label: string
  id: TransakPriceQuoteResponse['feeBreakdown'][0]['id']
}[] = [
  {
    label: 'Transak Fee',
    id: 'transak_fee',
  },
  {
    label: 'Network Fee',
    id: 'network_fee',
  },
  {
    label: 'Summer.fi Fee',
    id: 'partner_fee',
  },
]

const ListItem: FC<PropsWithChildren> = ({ children }) => (
  <Text as="div" variant="p4" className={classNames.listItem}>
    <div className={classNames.dot} />
    {children}
  </Text>
)

const getListItem = ({
  label,
  fiatCurrency,
  details,
  id,
}: {
  fiatCurrency: string
  label: string
  details?: TransakPriceQuoteResponse
  id: TransakPriceQuoteResponse['feeBreakdown'][0]['id']
}) => (
  <li key={id}>
    <ListItem>
      {label} {details?.feeBreakdown.find((item) => item.id === id)?.value ?? '-'} {fiatCurrency}
    </ListItem>
  </li>
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
        {fees.map((item) => getListItem({ fiatCurrency, details, id: item.id, label: item.label }))}
      </ul>
    </div>
  )
}
