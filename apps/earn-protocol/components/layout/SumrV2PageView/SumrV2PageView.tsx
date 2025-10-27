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
import { SumrTransferabilityCounter } from '@/features/sumr-claim/components/SumrTransferabilityCounter/SumrTransferabilityCounter'
import { SumrWhatIsSumrToken } from '@/features/sumr-claim/components/SumrWhatIsSumrToken/SumrWhatIsSumrToken'

import classNames from './SumrV2PageView.module.css'

interface SumrV2PageViewProps {}

export const SumrV2PageView: FC<SumrV2PageViewProps> = () => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <div className={classNames.sumrPageV2Wrapper}>
        <SumrClaimSearch />
        <SumrConversionAndTotalSupply />
        <SumrTransferabilityCounter counterId="sumr-page" />
        <SumrWhatIsSumrToken />
        <SumrGovernance />
        <SumrFundamentalUtility />
        <SumrNotTransferable />
        <SumrMultipleWaysToEarn />
        <SumrFaq />
        <HighestQualityYieldsDisclaimer />
      </div>
    </SDKContextProvider>
  )
}
