import { Card, FaqSection } from '@summerfi/app-earn-ui'

export const PortfolioRewardsFaq = () => {
  return (
    <Card variant="cardSecondary">
      <FaqSection
        headerVariant="h5"
        data={[
          {
            title: 'What is the $SUMR token airdrop?',
            content: 'Good question ✨',
          },
          {
            title: 'Who qualifies for the $SUMR token airdrop?',
            content: 'Good question ✨',
          },
          {
            title: 'When will the $SUMR tokens start trading?',
            content: 'Good question ✨',
          },
          {
            title: 'Will the $RAYS points campaign continue',
            content: 'Good question ✨',
          },
        ]}
      />
    </Card>
  )
}
