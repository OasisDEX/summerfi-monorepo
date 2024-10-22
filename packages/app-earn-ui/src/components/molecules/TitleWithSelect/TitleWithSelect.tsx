'use client'

import type { FC } from 'react'
import { type DropdownOption, type DropdownRawOption } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon.tsx'
import { Text } from '@/components/atoms/Text/Text'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'

import titleWithSelectStyles from '@/components/molecules/TitleWithSelect/TitleWithSelect.module.scss'

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

type TitleWithSelectProps =
  | {
      title: string
      options?: DropdownOption[]
      onChangeNetwork?: (selected: DropdownRawOption) => void
      selected?: DropdownOption
    }
  | {
      title: string
      options: DropdownOption[]
      onChangeNetwork: (selected: DropdownRawOption) => void
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
          <Dropdown
            dropdownValue={{ value: selected.value, content: <Content option={selected} /> }}
            options={options.map((option) => ({
              value: option.value,
              content: <Content option={option} />,
            }))}
            onChange={onChangeNetwork}
            asPill
          >
            <Content option={selected} />
          </Dropdown>
        )}
      </div>
    </div>
  )
}
