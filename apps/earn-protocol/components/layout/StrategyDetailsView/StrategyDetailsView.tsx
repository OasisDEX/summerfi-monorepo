'use client'
import { Card } from '@summerfi/app-earn-ui'

import { StrategyDetailsHowItWorks } from '@/components/organisms/StrategyDetailsHowItWorks/StrategyDetailsHowItWorks'

export const StrategyDetailsView = () => {
  return (
    <>
      <StrategyDetailsHowItWorks />
      <Card variant="cardPrimary">Advanced yield</Card>
      <Card variant="cardPrimary">Security</Card>
      <Card variant="cardPrimary">Faq</Card>
    </>
  )
}
