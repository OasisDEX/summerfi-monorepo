'use client'

import type { FC } from 'react'
import { type DropdownOption, type DropdownRawOption } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

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
      tooltip?: string
    }
  | {
      title: string
      options: DropdownOption[]
      onChangeNetwork: (selected: DropdownRawOption) => void
      selected: DropdownOption
      tooltip?: string
    }

export const TitleWithSelect = ({
  title,
  options,
  onChangeNetwork,
  selected,
  tooltip,
}: TitleWithSelectProps) => {
  const tooltipContent = selected && options && onChangeNetwork && (
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
  )

  return (
    <div className={titleWithSelectStyles.titleWithSelectWrapper}>
      <div className={titleWithSelectStyles.titleLine}>
        <Text as="h2" variant="h2">
          {title}
        </Text>
        {tooltip ? (
          <Tooltip
            tooltip={tooltip}
            tooltipWrapperStyles={{
              textWrap: 'nowrap',
              maxWidth: 'auto',
              width: 'auto',
              right: 0,
              top: 10,
            }}
          >
            {tooltipContent}
          </Tooltip>
        ) : (
          <>{tooltipContent}</>
        )}
      </div>
    </div>
  )
}
