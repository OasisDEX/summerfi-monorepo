'use client'

import { type DropdownOption } from '@summerfi/app-types'

import { Text } from '@/components/atoms/Text/Text'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'

import titleWithSelectStyles from '@/components/molecules/TitleWithSelect/TitleWithSelect.module.scss'

type TitleWithSelectProps =
  | {
      title: string
      options?: DropdownOption[]
      onChangeNetwork?: (selected: DropdownOption) => void
      selected?: DropdownOption
    }
  | {
      title: string
      options: DropdownOption[]
      onChangeNetwork: (selected: DropdownOption) => void
      selected: DropdownOption
    }

export const TitleWithSelect = ({
  title,
  options,
  onChangeNetwork,
  selected,
}: TitleWithSelectProps) => {
  return (
    <div className={titleWithSelectStyles.titleWithSelectWrapper}>
      <div className={titleWithSelectStyles.titleLine}>
        <Text as="h2" variant="h2">
          {title}
        </Text>
        {selected && options && onChangeNetwork && (
          <Dropdown dropdownValue={selected} options={options} onChange={onChangeNetwork} />
        )}
      </div>
    </div>
  )
}
