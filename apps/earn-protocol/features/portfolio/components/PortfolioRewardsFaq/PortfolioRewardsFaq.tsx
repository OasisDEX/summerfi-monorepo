import { Card, FaqSection } from '@summerfi/app-earn-ui'

import { sumrFaqData } from '@/features/sumr-claim/components/SumrFaq/sumr-faq-data'

export const PortfolioRewardsFaq = () => {
  return (
    <Card variant="cardSecondary">
      <FaqSection headerVariant="h5" data={sumrFaqData} />
    </Card>
  )
}
