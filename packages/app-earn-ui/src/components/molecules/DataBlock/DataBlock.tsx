import { type CSSProperties, type ReactNode } from 'react'
import { type IconNamesList } from '@summerfi/app-types'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'
import { TitleWithIcon } from '@/components/molecules/TitleWithIcon/TitleWithIcon'

import dataBlockStyles from './DataBlock.module.css'

export type DataBlockProps = {
  title: ReactNode
  titleTooltip?: string
  size?: 'small' | 'large'
  titleSize?: 'small' | 'medium' | 'large'
  titleStyle?: CSSProperties
  titleWrapperStyles?: CSSProperties
  subValueSize?: 'small' | 'medium' | 'large'
  valueSize?: 'small' | 'medium' | 'large' | 'largeColorful'
  valueStyle?: CSSProperties
  value: ReactNode
  subValue?: ReactNode
  subValueType?: 'positive' | 'negative' | 'neutral'
  centered?: boolean
  subValueStyle?: CSSProperties
  accent?: string
  tooltipIconName?: IconNamesList
  wrapperStyles?: CSSProperties
  wrapperClassName?: string
  onTooltipOpen?: (tooltipName: string) => void
  tooltipName?: string
}

export const DataBlock = ({
  title,
  titleTooltip,
  titleSize,
  titleStyle,
  titleWrapperStyles,
  size = 'small',
  value,
  valueSize,
  valueStyle,
  centered,
  subValue,
  subValueType,
  subValueSize,
  subValueStyle,
  accent,
  tooltipIconName,
  wrapperStyles,
  wrapperClassName,
  onTooltipOpen,
  tooltipName,
}: DataBlockProps): React.ReactNode => {
  const titleVariant = {
    small: 'p3semi' as const,
    medium: 'p2semi' as const,
    large: 'p1semi' as const,
  }[titleSize ?? size]

  const valueVariant = {
    small: 'p1semi' as const,
    medium: 'h5' as const,
    large: 'h4' as const,
    largeColorful: 'h4colorful' as const,
  }[valueSize ?? size]

  const subValueVariant = {
    small: 'p4semi' as const,
    medium: 'p2semi' as const,
    large: 'h5' as const,
  }[subValueSize ?? size]

  return (
    <div
      className={clsx(dataBlockStyles.dataBlockWrapper, wrapperClassName, {
        [dataBlockStyles.centered]: centered,
        [dataBlockStyles.hasAccent]: accent,
      })}
      style={wrapperStyles}
    >
      <div className={dataBlockStyles.titleWrapper} style={titleWrapperStyles}>
        {accent && <div className={dataBlockStyles.accent} style={{ backgroundColor: accent }} />}
        <TitleWithIcon
          titleVariant={titleVariant}
          title={title}
          iconName={titleTooltip ? tooltipIconName ?? 'question_o' : undefined}
          tooltip={titleTooltip}
          color="rgb(119, 117, 118)"
          titleStyle={titleStyle}
          tooltipWrapperStyles={{ minWidth: '230px', left: '-120px' }}
          onTooltipOpen={onTooltipOpen}
          tooltipName={tooltipName}
        />
      </div>
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
