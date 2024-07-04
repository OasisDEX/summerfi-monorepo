/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react'
import classNames from 'classnames'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import radioButtonStyles from './RadioButton.module.scss'

export const RadioButton = ({
  name,
  value,
  checked,
  onChange,
  label,
  className,
  style,
}: {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  label: string
  className?: string
  style?: React.CSSProperties
}) => {
  return (
    <div
      className={classNames(radioButtonStyles.radioButtonWrapper, className, {
        [radioButtonStyles.radioButtonWrapperChecked]: checked,
      })}
      style={style}
    >
      {checked ? <Icon iconName="radio_button_checked" /> : <Icon iconName="radio_button" />}
      <input
        type="radio"
        id={value}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className={radioButtonStyles.radio}
      />
      <label htmlFor={value} className={radioButtonStyles.label}>
        <Text as="p" variant="p3semi">
          {label}
        </Text>
      </label>
    </div>
  )
}
