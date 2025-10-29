import { type CSSProperties, type FC } from 'react'
import clsx from 'clsx'

import { Text, type TextAllowedHtmlTags } from '@/components/atoms/Text/Text'
import type textStyles from '@/components/atoms/Text/Text.module.css'

import countDownItemStyles from '@/components/molecules/CountDownItem/CountDownItem.module.css'

interface Variants {
  value: {
    as: TextAllowedHtmlTags
    variant: keyof typeof textStyles
  }
  title: {
    variant: keyof typeof textStyles
    color: string
  }
}

interface CountDownItemProps {
  title: string
  value: number
  variant: 'large' | 'medium' | 'small'
  progress?: number
  secondsProgress?: boolean
}

export const CountDownItem: FC<CountDownItemProps> = ({
  title,
  value,
  variant = 'large',
  progress,
  secondsProgress,
}) => {
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
    small: {
      value: {
        as: 'p',
        variant: 'p3semi',
        color: 'white',
      },
      title: {
        variant: 'p4semi',
        color: 'var(--color-text-secondary)',
      },
    },
  }[variant] as Variants

  return (
    <div className={countDownItemStyles.countDownItem}>
      <div
        className={clsx(countDownItemStyles.progress, {
          [countDownItemStyles.secondsProgress]: secondsProgress,
        })}
        style={{
          ['--progress' as keyof CSSProperties]: progress ? progress * 100 : 0,
        }}
        aria-hidden
      >
        <div className={countDownItemStyles.progressInner}>
          <Text as={styles.value.as} variant={styles.value.variant}>
            {value}
          </Text>
        </div>
      </div>

      <Text
        as="p"
        variant={styles.title.variant}
        style={{ color: styles.title.color, marginTop: '12px' }}
      >
        {title}
      </Text>
    </div>
  )
}
