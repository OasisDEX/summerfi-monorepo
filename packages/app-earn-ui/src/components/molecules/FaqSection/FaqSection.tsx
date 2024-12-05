import { type FC, type ReactNode } from 'react'

import { Expander } from '@/components/atoms/Expander/Expander'
import { Text } from '@/components/atoms/Text/Text'

import faqSectionStyles from './FaqSection.module.scss'

const ExpanderContent = ({ children }: { children: ReactNode }) => {
  return <div className={faqSectionStyles.faqSectionExpanderContent}>{children}</div>
}

interface FaqSectionProps {
  data: {
    title: string
    content: ReactNode
  }[]
  wrapperClassName?: string
}

export const FaqSection: FC<FaqSectionProps> = ({ data, wrapperClassName }) => {
  return (
    <div className={wrapperClassName}>
      <div className={faqSectionStyles.faqSectionHeaderWrapper}>
        <Text variant="h2" className={faqSectionStyles.faqSectionHeader}>
          FAQ
        </Text>
      </div>
      <div className={faqSectionStyles.faqSectionBlockWrapper}>
        {data.map(({ title, content }) => (
          <Expander title={title} key={title}>
            <ExpanderContent>{content}</ExpanderContent>
          </Expander>
        ))}
      </div>
    </div>
  )
}
