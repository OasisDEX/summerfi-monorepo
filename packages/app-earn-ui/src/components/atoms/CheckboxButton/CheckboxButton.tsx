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
}: {
  name: string
  checked: boolean
  onChange: (value: string) => void
  label?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  iconSize?: number
}): React.ReactNode => {
  return (
    <div className={clsx(checkboxButtonStyles.checkboxSectionWrapper, className)} style={style}>
      <div
        className={checkboxButtonStyles.checkmarkWrapper}
        style={{
          borderColor: checked
            ? 'var(--earn-protocol-success-100)'
            : 'var(--earn-protocol-neutral-70)',
          backgroundColor: checked ? 'var(--earn-protocol-success-10)' : 'unset',
        }}
      >
        {checked ? (
          <Icon
            iconName="checkmark"
            size={iconSize}
            style={{ color: 'var(--earn-protocol-success-100)' }}
          />
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
        <label htmlFor={name} className={checkboxButtonStyles.label}>
          {typeof label === 'string' ? (
            <Text as="p" variant="p3semi">
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
