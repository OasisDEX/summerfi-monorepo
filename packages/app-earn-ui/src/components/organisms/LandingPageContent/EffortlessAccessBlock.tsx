import { type ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'

import { Text } from '@/components/atoms/Text/Text'
import { Emphasis } from '@/components/molecules/Emphasis/Emphasis'

import effortlessAccessBlockStyles from './EffortlessAccessBlock.module.css'

export const EffortlessAccessBlock = ({ uiImage }: { uiImage: StaticImageData }): ReactNode => {
  return (
    <div className={effortlessAccessBlockStyles.wrapper}>
      <Text as="p" variant="h4semi" className={effortlessAccessBlockStyles.callout}>
        Get <Emphasis>effortless access</Emphasis> to crypto’s <Emphasis>best DeFi yields</Emphasis>
        . Continually rebalanced by <Emphasis>AI</Emphasis> powered Keepers to{' '}
        <Emphasis>earn you more</Emphasis> while{' '}
        <Emphasis>saving you time and reducing costs.</Emphasis>
      </Text>
      <Image src={uiImage} alt="Summer Earn UI" className={effortlessAccessBlockStyles.uiImage} />
    </div>
  )
}
