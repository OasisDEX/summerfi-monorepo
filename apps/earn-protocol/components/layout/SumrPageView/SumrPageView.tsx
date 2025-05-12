'use client'
import { type FC } from 'react'
import { HighestQualityYieldsDisclaimer } from '@summerfi/app-earn-ui'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'
import { SumrClaimSearch } from '@/features/sumr-claim/components/SumrClaimSearch/SumrClaimSearch'
import { SumrConversionAndTotalSupply } from '@/features/sumr-claim/components/SumrConversionAndTotalSupply/SumrConversionAndTotalSupply'
import { SumrFaq } from '@/features/sumr-claim/components/SumrFaq/SumrFaq'
import { SumrFundamentalUtility } from '@/features/sumr-claim/components/SumrFundamentalUtility/SumrFundamentalUtility'
import { SumrGovernance } from '@/features/sumr-claim/components/SumrGovernance/SumrGovernance'
import { SumrMultipleWaysToEarn } from '@/features/sumr-claim/components/SumrMultipleWaysToEarn/SumrMultipleWaysToEarn'
import { SumrNotTransferable } from '@/features/sumr-claim/components/SumrNotTransferable/SumrNotTransferable'
import { SumrRaysRewards } from '@/features/sumr-claim/components/SumrRaysRewards/SumrRaysRewards'
import { SumrTransferabilityCounter } from '@/features/sumr-claim/components/SumrTransferabilityCounter/SumrTransferabilityCounter'
import { SumrWhatIsSumrToken } from '@/features/sumr-claim/components/SumrWhatIsSumrToken/SumrWhatIsSumrToken'

import classNames from './SumrPageView.module.css'

interface SumrPageViewProps {}

export const SumrPageView: FC<SumrPageViewProps> = () => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <div className={classNames.sumrPageWrapper}>
        <SumrClaimSearch />
        <SumrConversionAndTotalSupply />
        <SumrTransferabilityCounter />
        <SumrWhatIsSumrToken />
        <SumrGovernance />
        <SumrFundamentalUtility />
        <SumrNotTransferable />
        <SumrMultipleWaysToEarn />
        <SumrRaysRewards />
        <SumrFaq />
        <HighestQualityYieldsDisclaimer />
      </div>
    </SDKContextProvider>
  )
}
