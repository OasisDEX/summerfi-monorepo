import { type ChangeEventHandler, type FC } from 'react'
import { type DropdownOption } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon.tsx'
import { Input } from '@/components/atoms/Input/Input'
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
  handleChange: ChangeEventHandler<HTMLInputElement>
}

export const InputWithDropdown: FC<InputWithDropdownProps> = ({
  options,
  dropdownValue,
  value,
  handleChange,
}) => {
  return (
    <div className={classNames.wrapper}>
      <Dropdown
        options={options.map((item) => ({
          value: item.value,
          content: <Content option={item} />,
        }))}
        dropdownValue={{ value: dropdownValue.value, content: <Content option={dropdownValue} /> }}
        asPill
      >
        <Content option={dropdownValue} />
      </Dropdown>
      <Input placeholder="0" value={value} onChange={handleChange} />
    </div>
  )
}
