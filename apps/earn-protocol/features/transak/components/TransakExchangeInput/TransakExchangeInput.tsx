import { type ChangeEvent, type FC, useState } from 'react'
import { Dropdown, Icon, Text } from '@summerfi/app-earn-ui'
import { type DropdownOption, type DropdownRawOption } from '@summerfi/app-types'
import { mapNumericInput } from '@summerfi/app-utils'

import classNames from './TransakExchangeInput.module.css'

interface ContentProps {
  option: DropdownOption
}

const Content: FC<ContentProps> = ({ option }) => (
  <>
    {'tokenSymbol' in option && <Icon tokenName={option.tokenSymbol} />}
    {'iconName' in option && <Icon iconName={option.iconName} />}
    {'icon' in option && (
      <div
        dangerouslySetInnerHTML={{ __html: option.icon }}
        style={{
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      />
    )}
    <span>{option.label}</span>
  </>
)

interface TransakExchangeInputProps {
  label: string
  defaultValue?: string
  defaultOption?: DropdownOption
  readOnly?: boolean
  onInputChange?: (value: string) => void
  onOptionChange?: (value: string) => void
  options: DropdownOption[]
}

export const TransakExchangeInput: FC<TransakExchangeInputProps> = ({
  defaultValue = '',
  defaultOption,
  readOnly,
  label,
  onInputChange,
  onOptionChange,
  options,
}) => {
  if (!options.length) {
    throw new Error('TransakExchangeInput requires at least one option')
  }

  const [fiatAmount, setFiatAmount] = useState<string>(defaultValue)
  const [option, setOption] = useState<DropdownRawOption>({
    value: defaultOption?.value ?? options[0].value,
    content: <Content option={defaultOption ?? options[0]} />,
  })

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) {
      return
    }

    const updatedValue = mapNumericInput(ev.target.value)

    setFiatAmount(updatedValue)
    onInputChange?.(updatedValue)
  }

  const handleOptionChange = (newOption: DropdownRawOption) => {
    setOption(newOption)
    onOptionChange?.(newOption.value)
  }

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.inputWrapper}>
        <Text as="p" variant="p3" className={classNames.label}>
          {label}
        </Text>
        <input
          type="text"
          placeholder="0"
          style={{ width: '100%', caretColor: readOnly ? 'transparent' : 'auto' }}
          onChange={handleInputChange}
          value={readOnly ? defaultValue : fiatAmount}
        />
      </div>
      <div className={classNames.dropdownWrapper}>
        <Dropdown
          options={options.map((item) => ({
            value: item.value,
            content: <Content option={item} />,
          }))}
          dropdownValue={{ value: option.value, content: option.content }}
          onChange={handleOptionChange}
          withSearch
          inputPlaceholder="Search for currency"
        >
          {option.content}
        </Dropdown>
      </div>
    </div>
  )
}
