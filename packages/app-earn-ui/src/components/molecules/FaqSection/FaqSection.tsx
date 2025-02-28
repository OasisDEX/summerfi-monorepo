import { type FC, type ReactNode } from 'react'
import clsx from 'clsx'

import { Expander } from '@/components/atoms/Expander/Expander'
import { Text } from '@/components/atoms/Text/Text'

import faqSectionStyles from './FaqSection.module.scss'
import { type ClassNames as TextClassNames } from '@/components/atoms/Text/Text.module.scss'

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
  headerVariant?: TextClassNames
}

export const FaqSection: FC<FaqSectionProps> = ({
  data,
  wrapperClassName,
  headerVariant = 'h2',
  headerClassName,
  faqSectionClassName,
}) => {
  return (
    <div className={clsx(wrapperClassName, faqSectionStyles.faqGeneralWrapper)}>
      <div className={clsx(headerClassName)}>
        <Text variant={headerVariant}>FAQ</Text>
      </div>
      <div className={clsx(faqSectionStyles.faqSectionBlockWrapper, faqSectionClassName)}>
        {data.map(({ title, content }) => (
          <Expander title={title} key={title}>
            <ExpanderContent>{content}</ExpanderContent>
          </Expander>
        ))}
      </div>
    </div>
  )
}
