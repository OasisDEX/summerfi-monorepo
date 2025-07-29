import { Card, FaqSection } from '@summerfi/app-earn-ui'

import classNames from './MerchandiseFaq.module.css'

const merchandiseFaqData = [
  {
    title: 'What is going on?',
    content:
      'Summer.fi is giving away a limited run drop of Summer.fi Beach Club branded merch. Winners have been chosen based on the Summer.fi Beach Club - Beach Boat challenge. If you have won, that means that you have accrued enough points from referring users and TVL to be eligible.',
  },
  {
    title: 'Do I need to pay for shipping?',
    content: 'No. You do not need to pay for shipping.',
  },
  {
    title: 'Tell me more about the merch',
    content:
      'The Summer.fi Beach Club - Beach Boat challenge merch is more than anything, unique. You will be one of the few people on planet earth with this merch. ',
  },
]

export const MerchandiseFaq = () => {
  return (
    <Card className={classNames.merchandiseFaqWrapper} variant="cardSecondary">
      <FaqSection
        data={merchandiseFaqData}
        customTitle="Things you might want to know"
        headerVariant="h5colorfulBeachClub"
      />
    </Card>
  )
}
