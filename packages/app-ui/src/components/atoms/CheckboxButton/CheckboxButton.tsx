/* eslint-disable @typescript-eslint/no-shadow */
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import checkboxButtonStyles from './CheckboxButton.module.scss'

export const CheckboxButton = ({
  name,
  checked,
  onChange,
  label,
  className,
  style,
}: {
  name: string
  checked: boolean
  onChange: (value: string) => void
  label: React.ReactNode
  className?: string
  style?: React.CSSProperties
}): React.ReactNode => {
  return (
    <div className={clsx(checkboxButtonStyles.checkboxSectionWrapper, className)} style={style}>
      <div
        className={checkboxButtonStyles.checkmarkWrapper}
        style={{
          backgroundColor: checked ? 'var(--color-success-10)' : 'var(--color-neutral-10)',
        }}
      >
        {checked ? <Icon iconName="checkmark" size={18} /> : null}
      </div>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className={checkboxButtonStyles.input}
      />
      <label htmlFor={name} className={checkboxButtonStyles.label}>
        {typeof label === 'string' ? (
          <Text as="p" variant="p3semi">
            {label}
          </Text>
        ) : (
          label
        )}
      </label>
    </div>
  )
}
