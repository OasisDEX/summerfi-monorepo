import { type CSSProperties, type ReactNode } from 'react'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'
import { TitleWithIcon } from '@/components/molecules/TitleWithIcon/TitleWithIcon'

import dataBlockStyles from './DataBlock.module.scss'

type DataBlockProps = {
  title: string
  titleTooltip?: string
  size?: 'small' | 'large'
  titleSize?: 'small' | 'large'
  titleStyle?: CSSProperties
  subValueSize?: 'small' | 'large'
  valueSize?: 'small' | 'large'
  valueStyle?: CSSProperties
  value: string
  subValue?: ReactNode
  subValueType?: 'positive' | 'negative' | 'neutral'
  centered?: boolean
  subValueStyle?: CSSProperties
}

export const DataBlock = ({
  title,
  titleTooltip,
  titleSize,
  titleStyle,
  size = 'small',
  value,
  valueSize,
  valueStyle,
  centered,
  subValue,
  subValueType,
  subValueSize,
  subValueStyle,
}: DataBlockProps) => {
  const titleVariant = {
    small: 'p3semi' as const,
    large: 'p1semi' as const,
  }[titleSize ?? size]

  const valueVariant = {
    small: 'p1semi' as const,
    large: 'h4' as const,
  }[valueSize ?? size]

  const subValueVariant = {
    small: 'p2semi' as const,
    large: 'h5' as const,
  }[subValueSize ?? size]

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
        titleStyle={titleStyle}
      />
      <Text variant={valueVariant} style={valueStyle}>
        {value}
      </Text>
      {subValue && (
        <Text
          variant={subValueVariant}
          style={{
            color: {
              positive: 'var(--color-background-success-bold)',
              negative: 'var(--color-background-warning-bold)',
              neutral: 'var(--color-text-secondary)',
            }[subValueType ?? 'neutral'],
            ...subValueStyle,
          }}
        >
          {subValue}
        </Text>
      )}
    </div>
  )
}
