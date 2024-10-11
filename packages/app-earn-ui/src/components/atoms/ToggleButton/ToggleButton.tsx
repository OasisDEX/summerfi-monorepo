import { Text } from '@/components/atoms/Text/Text'

import slideButtonStyles from './ToggleButton.module.scss'
import { type ClassNames as TextVariants } from '@/components/atoms/Text/Text.module.scss'

type ToggleButtonProps = {
  title: string
  checked: boolean
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void
  titleVariant?: TextVariants
}

export const ToggleButton = ({ title, titleVariant, checked, onChange }: ToggleButtonProps) => {
  return (
    <div className={slideButtonStyles.slideButtonWrapper}>
      <Text variant={titleVariant ?? 'p2semi'}>{title}</Text>
      <label className={slideButtonStyles.slideButtonWrapper}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className={slideButtonStyles.slider}></span>
      </label>
    </div>
  )
}
