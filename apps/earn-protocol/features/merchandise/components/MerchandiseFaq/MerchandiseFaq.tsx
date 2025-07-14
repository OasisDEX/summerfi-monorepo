import { Card, FaqSection } from '@summerfi/app-earn-ui'

import classNames from './MerchandiseFaq.module.css'

const merchandiseFaqData = [
  {
    title: 'What is going on?',
    content: 'TBD',
  },
  {
    title: 'Do I need to pay for shipping?',
    content: 'TBD',
  },
  {
    title: 'Tell me more about the hoodie',
    content: 'TBD',
  },
  {
    title: 'Another relevant questions?',
    content: 'TBD',
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
