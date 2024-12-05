import { type FC } from 'react'

import { SumrClaimSearch } from '@/features/sumr-claim/components/SumrClaimSearch/SumrClaimSearch'
import { SumrConversionAndPrice } from '@/features/sumr-claim/components/SumrConversionAndPrice/SumrConversionAndPrice'
import { SumrFundamentalUtility } from '@/features/sumr-claim/components/SumrFundamentalUtility/SumrFundamentalUtility'
import { SumrGovernance } from '@/features/sumr-claim/components/SumrGovernance/SumrGovernance'
import { SumrMultipleWaysToEarn } from '@/features/sumr-claim/components/SumrMultipleWaysToEarn/SumrMultipleWaysToEarn'
import { SumrNotTransferable } from '@/features/sumr-claim/components/SumrNotTransferable/SumrNotTransferable'
import { SumrTransferabilityCounter } from '@/features/sumr-claim/components/SumrTransferabilityCounter/SumrTransferabilityCounter'
import { SumrWhatIsSumrToken } from '@/features/sumr-claim/components/SumrWhatIsSumrToken/SumrWhatIsSumrToken'

import classNames from './SumrPageView.module.scss'

interface SumrPageViewProps {
  sumrPrice: string
}

export const SumrPageView: FC<SumrPageViewProps> = ({ sumrPrice }) => {
  return (
    <div className={classNames.sumrPageWrapper}>
      <SumrClaimSearch />
      <SumrConversionAndPrice sumrPrice={sumrPrice} />
      <SumrTransferabilityCounter />
      <SumrWhatIsSumrToken />
      <SumrGovernance />
      <SumrFundamentalUtility />
      <SumrNotTransferable />
      <SumrMultipleWaysToEarn />
    </div>
  )
}
