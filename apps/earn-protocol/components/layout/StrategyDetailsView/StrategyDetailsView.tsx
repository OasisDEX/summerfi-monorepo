'use client'

import { StrategyDetailsFaq } from '@/components/organisms/StrategyDetailsFaq/StrategyDetailsFaq'
import { StrategyDetailsHowItWorks } from '@/components/organisms/StrategyDetailsHowItWorks/StrategyDetailsHowItWorks'
import { StrategyDetailsSecurity } from '@/components/organisms/StrategyDetailsSecurity/StrategyDetailsSecurity'
import { StrategyDetailsYields } from '@/components/organisms/StrategyDetailsYields/StrategyDetailsYields'

export const StrategyDetailsView = () => {
  return (
    <>
      <StrategyDetailsHowItWorks />
      <StrategyDetailsYields />
      <StrategyDetailsSecurity />
      <StrategyDetailsFaq />
    </>
  )
}
