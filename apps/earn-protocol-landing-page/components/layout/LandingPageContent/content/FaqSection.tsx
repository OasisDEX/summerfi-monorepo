import { type ReactNode } from 'react'
import { Expander, Text } from '@summerfi/app-earn-ui'

import faqSectionStyles from '@/components/layout/LandingPageContent/content/FaqSection.module.scss'

const ExpanderContent = ({ children }: { children: ReactNode }) => {
  return <div className={faqSectionStyles.faqSectionExpanderContent}>{children}</div>
}

export const FaqSection = () => {
  return (
    <div>
      <div className={faqSectionStyles.faqSectionHeaderWrapper}>
        <Text variant="h2" className={faqSectionStyles.faqSectionHeader}>
          FAQ
        </Text>
      </div>
      <div className={faqSectionStyles.faqSectionBlockWrapper}>
        <Expander title="Why should I trust your platform?">
          <ExpanderContent>Good question ✨</ExpanderContent>
        </Expander>
        <Expander title="How does the strategy work?">
          <ExpanderContent>Good question ✨</ExpanderContent>
        </Expander>
        <Expander title="Where does the yield come from?">
          <ExpanderContent>Good question ✨</ExpanderContent>
        </Expander>
        <Expander title="What’s the platform of Summer.fi?">
          <ExpanderContent>Good question ✨</ExpanderContent>
        </Expander>
      </div>
    </div>
  )
}
