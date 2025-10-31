/* eslint-disable @typescript-eslint/no-shadow */
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import checkboxButtonStyles from './CheckboxButton.module.css'

export const CheckboxButton = ({
  name,
  checked,
  onChange,
  label,
  className,
  style,
  iconSize = 18,
  iconColor,
  labelStyles,
  labelTextStyles,
}: {
  name: string
  checked: boolean
  onChange: (value: string) => void
  label?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  iconSize?: number
  iconColor?: string
  labelStyles?: React.CSSProperties
  labelTextStyles?: React.CSSProperties
}): React.ReactNode => {
  const checkedColor = iconColor ?? 'var(--earn-protocol-success-100)'

  return (
    <div className={clsx(checkboxButtonStyles.checkboxSectionWrapper, className)} style={style}>
      <div
        className={checkboxButtonStyles.checkmarkWrapper}
        style={{
          borderColor: checked ? checkedColor : 'var(--earn-protocol-neutral-70)',
          backgroundColor: checked ? 'var(--earn-protocol-success-10)' : 'unset',
        }}
      >
        {checked ? (
          <Icon iconName="checkmark" size={iconSize} style={{ color: checkedColor }} />
        ) : null}
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.value)}
          className={checkboxButtonStyles.input}
        />
      </div>
      {label && (
        <label htmlFor={name} className={checkboxButtonStyles.label} style={labelStyles}>
          {typeof label === 'string' ? (
            <Text as="p" variant="p3semi" style={labelTextStyles}>
              {label}
            </Text>
          ) : (
            label
          )}
        </label>
      )}
    </div>
  )
}
