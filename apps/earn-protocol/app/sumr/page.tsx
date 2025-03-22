import { type Metadata } from 'next'

import { SumrPageView } from '@/components/layout/SumrPageView/SumrPageView'

const SumrPage = () => {
  return <SumrPageView />
}

export function generateMetadata(): Metadata {
  return {
    title: `Lazy Summer Protocol - $SUMR Token`,
    description:
      'Check if you are eligible for $SUMR - the token that powers DeFi’s best yield optimizer.',
  }
}

export default SumrPage
