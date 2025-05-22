import {
  type CSSProperties,
  type DetailedHTMLProps,
  type FC,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { type IconNamesList } from '@summerfi/app-types'
import clsx from 'clsx'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import inputStyles from '@/components/atoms/Input/Input.module.css'

export const Input: FC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    variant?: keyof typeof inputStyles
    className?: string
    icon?: {
      name: IconNamesList
      size?: number
      style?: CSSProperties
    }
    CustomIcon?: FC
    wrapperStyles?: CSSProperties
    wrapperClassName?: string
    secondaryValue?: string
    button?: ReactNode
    buttonStyles?: CSSProperties
  }
> = ({
  variant = 'default',
  className,
  CustomIcon,
  icon,
  wrapperStyles,
  wrapperClassName,
  secondaryValue,
  button,
  placeholder,
  value,
  buttonStyles,
  ...rest
}) => {
  return (
    <div className={clsx(inputStyles.wrapper, wrapperClassName)} style={wrapperStyles}>
      {icon && (
        <div className={inputStyles.iconWrapper}>
          <Icon iconName={icon.name} size={icon.size} variant="s" style={icon.style} />
        </div>
      )}
      {CustomIcon && (
        <div className={inputStyles.iconWrapper}>
          <CustomIcon />
        </div>
      )}
      <input
        className={[
          icon ? inputStyles.withIconOffset : '',
          getAtomClassList({ className, variant: inputStyles[variant] }),
        ].join(' ')}
        {...rest}
        value={value}
        placeholder={placeholder}
      />
      {button && (
        <div style={{ position: 'absolute', right: '34px', cursor: 'pointer', ...buttonStyles }}>
          {button}
        </div>
      )}
      {secondaryValue !== '0' && secondaryValue !== '' && (
        <Text
          as="p"
          variant="p3semi"
          style={{
            position: 'absolute',
            right: 0,
            bottom: '-5px',
            color: 'var(--earn-protocol-secondary-60)',
          }}
        >
          {secondaryValue}
        </Text>
      )}
    </div>
  )
}
