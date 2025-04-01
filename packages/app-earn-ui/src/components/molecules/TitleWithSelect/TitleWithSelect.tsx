'use client'

import type { FC, ReactNode } from 'react'
import { type DropdownOption, type DropdownRawOption } from '@summerfi/app-types'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

import titleWithSelectStyles from '@/components/molecules/TitleWithSelect/TitleWithSelect.module.scss'

interface DropdownItemProps {
  option: DropdownOption
}
const DropdownItem: FC<DropdownItemProps> = ({ option }) => (
  <>
    {'tokenSymbol' in option && <Icon tokenName={option.tokenSymbol} />}
    {'iconName' in option && <Icon iconName={option.iconName} />}
    <span>{option.label}</span>
  </>
)

type TitleWithSelectProps =
  | {
      title: ReactNode
      options?: DropdownOption[]
      onChangeNetwork?: (selected: DropdownRawOption) => void
      selected?: DropdownOption
      tooltip?: string
      onRefresh?: () => void
      isRefreshing?: boolean
    }
  | {
      title: ReactNode
      options: DropdownOption[]
      onChangeNetwork: (selected: DropdownRawOption) => void
      selected: DropdownOption
      tooltip?: string
      onRefresh?: () => void
      isRefreshing?: boolean
    }

export const TitleWithSelect = ({
  title,
  options,
  onChangeNetwork,
  selected,
  tooltip,
  isRefreshing,
  onRefresh,
}: TitleWithSelectProps): React.ReactNode => {
  const tooltipContent = selected && options && onChangeNetwork && (
    <Dropdown
      dropdownValue={{ value: selected.value, content: <DropdownItem option={selected} /> }}
      options={options.map((option) => ({
        value: option.value,
        content: <DropdownItem option={option} />,
      }))}
      onChange={onChangeNetwork}
      asPill
    >
      <DropdownItem option={selected} />
    </Dropdown>
  )

  return (
    <div className={titleWithSelectStyles.titleWithSelectWrapper}>
      <div className={clsx(titleWithSelectStyles.titleLine)}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Text as="h2" variant="h2">
            {title}
          </Text>
          {onRefresh && (
            <div
              onClick={onRefresh}
              className={clsx(titleWithSelectStyles.refreshButton, {
                [titleWithSelectStyles.refreshing]: isRefreshing,
              })}
            >
              <Icon iconName="refresh" size={16} />
            </div>
          )}
        </div>
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
