import { Card, FaqSection } from '@summerfi/app-earn-ui'
import { slugify } from '@summerfi/app-utils'

import { sumrFaqData } from '@/features/sumr-claim/components/SumrFaq/sumr-faq-data'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'

export const PortfolioRewardsFaq = () => {
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const handleExpanderToggle = ({ expanded, title }: { expanded: boolean; title: string }) => {
    buttonClickEventHandler(
      `portfolio-sumr-rewards-faq-${slugify(title)}-${expanded ? 'open' : 'close'}`,
    )
  }

  return (
    <Card variant="cardSecondary">
      <FaqSection headerVariant="h5" data={sumrFaqData} onExpand={handleExpanderToggle} />
    </Card>
  )
}
