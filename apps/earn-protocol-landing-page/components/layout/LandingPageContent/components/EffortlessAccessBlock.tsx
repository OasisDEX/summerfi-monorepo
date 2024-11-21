import { type ReactNode } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import effortlessAccessBlockStyles from './EffortlessAccessBlock.module.scss'

import summerEarnUi from '@/public/img/landing-page/summer-earn-ui.png'

const Emphasis = ({ children }: { children: ReactNode }) => (
  <Text variant="h4colorful" as="span">
    {children}
  </Text>
)

export const EffortlessAccessBlock = () => {
  return (
    <div>
      <Text as="p" variant="h4" className={effortlessAccessBlockStyles.callout}>
        With Summer, get <Emphasis>effortless access</Emphasis> to crypto’s{' '}
        <Emphasis>best DeFi yields</Emphasis>, continually rebalanced to{' '}
        <Emphasis>earn you more</Emphasis> while{' '}
        <Emphasis>saving time and reducing costs.</Emphasis>
      </Text>
      <Image
        src={summerEarnUi}
        alt="Summer Earn UI"
        className={effortlessAccessBlockStyles.uiImage}
      />
    </div>
  )
}
