import { type CSSProperties, type FC, type ReactNode } from 'react'
import clsx from 'clsx'

import { Expander } from '@/components/atoms/Expander/Expander'
import { Text } from '@/components/atoms/Text/Text'
import type TextClassNames from '@/components/atoms/Text/Text.module.css'

import faqSectionStyles from './FaqSection.module.css'

const ExpanderContent = ({ children }: { children: ReactNode }) => {
  return <div className={faqSectionStyles.faqSectionExpanderContent}>{children}</div>
}

interface FaqSectionProps {
  data: {
    title: string
    content: ReactNode
  }[]
  wrapperClassName?: string
  headerClassName?: string
  faqSectionClassName?: string
  headerVariant?: keyof typeof TextClassNames
  customTitle?: string
  expanderButtonStyles?: CSSProperties
}

export const FaqSection: FC<FaqSectionProps> = ({
  data,
  wrapperClassName,
  headerVariant = 'h2',
  headerClassName,
  faqSectionClassName,
  customTitle,
  expanderButtonStyles,
}) => {
  return (
    <div className={clsx(wrapperClassName, faqSectionStyles.faqGeneralWrapper)}>
      <div className={clsx(headerClassName)}>
        <Text variant={headerVariant}>{customTitle ?? 'FAQ'}</Text>
      </div>
      <div className={clsx(faqSectionStyles.faqSectionBlockWrapper, faqSectionClassName)}>
        {data.map(({ title, content }) => (
          <Expander title={title} key={title} expanderButtonStyles={expanderButtonStyles}>
            <ExpanderContent>{content}</ExpanderContent>
          </Expander>
        ))}
      </div>
    </div>
  )
}
