import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'
import { TitleWithIcon } from '@/components/molecules/TitleWithIcon/TitleWithIcon'

import dataBlockStyles from './DataBlock.module.scss'

type DataBlockProps = {
  title: string
  titleTooltip?: string
  size?: 'small' | 'large'
  value: string
  subValue?: string
  subValueType?: 'positive' | 'negative' | 'neutral'
  centered?: boolean
}

export const DataBlock = ({
  title,
  titleTooltip,
  size = 'small',
  value,
  centered,
  subValue,
  subValueType,
}: DataBlockProps) => {
  const titleVariant = {
    small: 'p3semi' as const,
    large: 'p1semi' as const,
  }[!subValue ? 'small' : size]

  const valueVariant = {
    small: 'p1semi' as const,
    large: 'h4' as const,
  }[size]

  const subValueVariant = {
    small: 'p2semi' as const,
    large: 'h5' as const,
  }[size]

  return (
    <div
      className={clsx(dataBlockStyles.dataBlockWrapper, {
        [dataBlockStyles.centered]: centered,
      })}
    >
      <TitleWithIcon
        titleVariant={titleVariant}
        title={title}
        iconName={titleTooltip ? 'question_o' : undefined}
        tooltip={titleTooltip}
        color="rgb(119, 117, 118)"
      />
      <Text variant={valueVariant}>{value}</Text>
      {subValue && (
        <Text
          variant={subValueVariant}
          style={{
            color: {
              positive: 'var(--color-background-success-bold)',
              negative: 'var(--color-background-warning-bold)',
              neutral: 'var(--color-text-secondary)',
            }[subValueType ?? 'neutral'],
          }}
        >
          {subValue}
        </Text>
      )}
    </div>
  )
}
