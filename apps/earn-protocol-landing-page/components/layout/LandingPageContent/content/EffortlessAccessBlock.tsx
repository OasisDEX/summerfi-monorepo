import { Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import { Emphasis } from '@/components/layout/LandingPageContent/components/Emphasis'

import effortlessAccessBlockStyles from '@/components/layout/LandingPageContent/content/EffortlessAccessBlock.module.css'

import summerEarnUi from '@/public/img/landing-page/summer-earn-ui.png'

export const EffortlessAccessBlock = () => {
  return (
    <div className={effortlessAccessBlockStyles.wrapper}>
      <Text as="p" variant="h4semi" className={effortlessAccessBlockStyles.callout}>
        Get <Emphasis>effortless access</Emphasis> to crypto’s <Emphasis>best DeFi yields</Emphasis>
        . Continually rebalanced by <Emphasis>AI</Emphasis> powered Keepers to{' '}
        <Emphasis>earn you more</Emphasis> while{' '}
        <Emphasis>saving you time and reducing costs.</Emphasis>
      </Text>
      <Image
        src={summerEarnUi}
        alt="Summer Earn UI"
        className={effortlessAccessBlockStyles.uiImage}
      />
    </div>
  )
}
