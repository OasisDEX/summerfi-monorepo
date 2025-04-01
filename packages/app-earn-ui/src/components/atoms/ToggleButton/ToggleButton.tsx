import { type ChangeEvent, type CSSProperties } from 'react'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'

import slideButtonStyles from './ToggleButton.module.scss'
import { type ClassNames as TextVariants } from '@/components/atoms/Text/Text.module.scss'

type ToggleButtonProps = {
  title: string
  checked: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  titleVariant?: TextVariants
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
