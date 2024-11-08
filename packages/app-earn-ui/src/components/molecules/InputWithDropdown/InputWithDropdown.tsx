import { type ChangeEventHandler, type FC, type ReactNode } from 'react'
import { type DropdownOption } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon.tsx'
import { Input } from '@/components/atoms/Input/Input'
import { Text } from '@/components/atoms/Text/Text.tsx'
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
  selectAllOnFocus?: boolean
  heading?: {
    label: ReactNode
    value: ReactNode
    action: () => void
  }
  onFocus?: () => void
  onBlur?: () => void
}

export const InputWithDropdown: FC<InputWithDropdownProps> = ({
  options,
  dropdownValue,
  value,
  secondaryValue,
  handleChange,
  heading,
  onFocus,
  onBlur,
  selectAllOnFocus,
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
            className={classNames.headingWrapperAction}
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
        />
      </div>
    </div>
  )
}
