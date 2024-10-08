import React, { type ChangeEventHandler, type FC } from 'react'
import { type DropdownOption } from '@summerfi/app-types'

import { Input } from '@/components/atoms/Input/Input'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'

import classNames from '@/components/molecules/InputWithDropdown/InputWithDropdown.module.scss'

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
      <Dropdown options={options} dropdownValue={dropdownValue} />
      <Input placeholder="0" value={value} onChange={handleChange} />
    </div>
  )
}
