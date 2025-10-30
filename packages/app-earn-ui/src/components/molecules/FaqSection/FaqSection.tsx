'use client'
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
    id?: string
    title: ReactNode
    content: ReactNode
  }[]
  onExpand?: (props: { expanded: boolean; title: string; id?: string }) => void
  wrapperClassName?: string
  headerClassName?: string
  faqSectionClassName?: string
  headerVariant?: keyof typeof TextClassNames
  customTitle?: string
  expanderButtonStyles?: CSSProperties
}

export const FaqSection: FC<FaqSectionProps> = ({
  onExpand,
  data,
  wrapperClassName,
  headerVariant = 'h2',
  headerClassName,
  faqSectionClassName,
  customTitle,
  expanderButtonStyles,
}) => {
  const handleOnExpand = (title: string, id?: string) => (expanded: boolean) => {
    if (onExpand) {
      onExpand({ expanded, title, id })
    }
  }

  return (
    <div className={clsx(wrapperClassName, faqSectionStyles.faqGeneralWrapper)}>
      <div className={clsx(headerClassName)}>
        <Text variant={headerVariant}>{customTitle ?? 'FAQ'}</Text>
      </div>
      <div className={clsx(faqSectionStyles.faqSectionBlockWrapper, faqSectionClassName)}>
        {data.map(({ title, content }, index) => (
          <Expander
            title={title}
            key={typeof title === 'string' ? title : index}
            expanderButtonStyles={expanderButtonStyles}
            onExpand={handleOnExpand(
              typeof title === 'string' ? title : String(index),
              typeof title === 'string' ? undefined : String(index),
            )}
          >
            <ExpanderContent>{content}</ExpanderContent>
          </Expander>
        ))}
      </div>
    </div>
  )
}
