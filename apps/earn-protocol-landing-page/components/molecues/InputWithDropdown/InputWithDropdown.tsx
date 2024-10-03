import React, { type FC } from 'react'
import { Dropdown, Input } from '@summerfi/app-earn-ui'
import { type DropdownOption } from '@summerfi/app-types'

import classNames from '@/components/molecues/InputWithDropdown/InputWithDropdown.module.scss'

interface InputWithDropdownProps {
  options: DropdownOption[]
  dropdownValue: DropdownOption
  value: string
  handleChange: any
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
