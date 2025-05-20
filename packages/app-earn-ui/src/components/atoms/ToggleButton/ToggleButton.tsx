import { type ChangeEvent, type CSSProperties } from 'react'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'
import type textStyles from '@/components/atoms/Text/Text.module.css'

import slideButtonStyles from './ToggleButton.module.css'

type ToggleButtonProps = {
  title: string
  checked: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  titleVariant?: keyof typeof textStyles
  wrapperStyle?: CSSProperties
  trackVariant?: 'light' | 'dark'
}

export const ToggleButton = ({
  title,
  titleVariant,
  checked,
  onChange,
  wrapperStyle,
  trackVariant = 'light',
}: ToggleButtonProps): React.ReactNode => {
  return (
    <div className={slideButtonStyles.slideButtonWrapper} style={wrapperStyle}>
      <Text variant={titleVariant ?? 'p2semi'}>{title}</Text>
      <label className={slideButtonStyles.slideButtonWrapper}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span
          className={clsx(slideButtonStyles.slider, {
            [slideButtonStyles.sliderLight]: trackVariant === 'light',
            [slideButtonStyles.sliderDark]: trackVariant === 'dark',
          })}
        />
      </label>
    </div>
  )
}
