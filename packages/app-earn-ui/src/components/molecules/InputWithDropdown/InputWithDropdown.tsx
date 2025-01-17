import { type ChangeEventHandler, type FC, type ReactNode } from 'react'
import { type DropdownOption, type DropdownRawOption } from '@summerfi/app-types'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Input } from '@/components/atoms/Input/Input'
import { Text } from '@/components/atoms/Text/Text'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'

import classNames from '@/components/molecules/InputWithDropdown/InputWithDropdown.module.scss'

interface ContentProps {
  option: DropdownOption
}

const Content: FC<ContentProps> = ({ option }) => (
  <>
    {'tokenSymbol' in option && <Icon tokenName={option.tokenSymbol} />}
    {'iconName' in option && <Icon iconName={option.iconName} />}
    <span>{option.label}</span>
  </>
)

interface InputWithDropdownProps {
  options: DropdownOption[]
  dropdownValue: DropdownOption
  value: string
  secondaryValue?: string
  handleChange: ChangeEventHandler<HTMLInputElement>
  handleDropdownChange?: (option: DropdownRawOption) => void
  selectAllOnFocus?: boolean
  heading?: {
    label: ReactNode
    value: ReactNode
    action?: () => void
  }
  onFocus?: () => void
  onBlur?: () => void
  disabled?: boolean
}

export const InputWithDropdown: FC<InputWithDropdownProps> = ({
  options,
  dropdownValue,
  value,
  secondaryValue,
  handleChange,
  handleDropdownChange,
  heading,
  onFocus,
  onBlur,
  selectAllOnFocus,
  disabled,
}) => {
  const handleFocus = (ev: React.FocusEvent<HTMLInputElement>) => {
    if (selectAllOnFocus) {
      ev.target.select()
    }

    onFocus?.()
  }

  return (
    <div className={classNames.wrapper}>
      {heading && (
        <div className={classNames.headingWrapper}>
          <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            {heading.label}
          </Text>
          <Text
            as="p"
            variant="p3semi"
            className={clsx(classNames.headingWrapperAction, {
              [classNames.headingWrapperActionDisabled]: !heading.action,
            })}
            onClick={heading.action}
          >
            {heading.value}
          </Text>
        </div>
      )}
      <div className={classNames.inputWrapper}>
        <Dropdown
          options={options.map((item) => ({
            value: item.value,
            content: <Content option={item} />,
          }))}
          dropdownValue={{
            value: dropdownValue.value,
            content: <Content option={dropdownValue} />,
          }}
          asPill
          onChange={handleDropdownChange}
          isDisabled={disabled}
        >
          <Content option={dropdownValue} />
        </Dropdown>
        <Input
          placeholder="0"
          value={value}
          onChange={handleChange}
          secondaryValue={secondaryValue}
          onFocus={handleFocus}
          onBlur={onBlur}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
