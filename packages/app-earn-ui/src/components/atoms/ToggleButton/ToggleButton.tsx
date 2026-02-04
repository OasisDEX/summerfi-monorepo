import { type ChangeEvent, type CSSProperties } from 'react'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'
import type textStyles from '@/components/atoms/Text/Text.module.css'

import slideButtonStyles from './ToggleButton.module.css'

type ToggleButtonProps = {
  title?: string
  id?: string
  checked: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  titleVariant?: keyof typeof textStyles
  wrapperStyle?: CSSProperties
  slideButtonWrapperStyle?: CSSProperties
  sliderStyle?: CSSProperties
  trackVariant?: 'light' | 'dark'
}

export const ToggleButton = ({
  title,
  id,
  titleVariant,
  checked,
  onChange,
  wrapperStyle,
  slideButtonWrapperStyle,
  sliderStyle,
  trackVariant = 'light',
}: ToggleButtonProps): React.ReactNode => {
  return (
    <div className={slideButtonStyles.slideButtonWrapper} style={wrapperStyle}>
      {title && <Text variant={titleVariant ?? 'p2semi'}>{title}</Text>}
      <label className={slideButtonStyles.slideButtonWrapper} style={slideButtonWrapperStyle}>
        <input type="checkbox" checked={checked} id={id} name={id} onChange={onChange} />
        <span
          className={clsx(slideButtonStyles.slider, {
            [slideButtonStyles.sliderLight]: trackVariant === 'light',
            [slideButtonStyles.sliderDark]: trackVariant === 'dark',
          })}
          style={sliderStyle}
        />
      </label>
    </div>
  )
}
