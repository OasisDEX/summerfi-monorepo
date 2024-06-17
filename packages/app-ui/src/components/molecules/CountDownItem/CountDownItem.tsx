import { FC } from 'react'

import { Text, TextAllowedHtmlTags } from '@/components/atoms/Text/Text'

import { Styles } from '@/components/atoms/Text/Text.module.scss'
import classNames from '@/components/molecules/CountDownItem/CountDownItem.module.scss'

interface Variants {
  value: {
    as: TextAllowedHtmlTags
    variant: keyof Styles
  }
  title: {
    variant: keyof Styles
    color: string
  }
}

interface CountDownItemProps {
  title: string
  value: number
  variant: 'large' | 'medium'
}

export const CountDownItem: FC<CountDownItemProps> = ({ title, value, variant = 'large' }) => {
  const styles = {
    large: {
      value: {
        as: 'h4',
        variant: 'h4',
      },
      title: {
        variant: 'p4semi',
        color: 'var(--color-primary-30)',
      },
    },
    medium: {
      value: {
        as: 'p',
        variant: 'p1semi',
      },
      title: {
        variant: 'p4semi',
        color: 'var(--color-neutral-80)',
      },
    },
  }[variant] as Variants

  return (
    <div className={classNames.countDownItem}>
      <Text as={styles.value.as} variant={styles.value.variant}>
        {value}
      </Text>
      <Text as="p" variant={styles.title.variant} style={{ color: styles.title.color }}>
        {title}
      </Text>
    </div>
  )
}
