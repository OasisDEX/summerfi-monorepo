import { type ChangeEventHandler, type FC, type ReactNode, Suspense } from 'react'
import { type DropdownOption, type DropdownRawOption } from '@summerfi/app-types'
import { humanReadableChainToLabelMap } from '@summerfi/app-utils'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Input } from '@/components/atoms/Input/Input'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'
import { TokenWithNetworkIcon } from '@/components/molecules/TokenWithNetworkIcon/TokenWithNetworkIcon'

import classNames from '@/components/molecules/InputWithDropdown/InputWithDropdown.module.css'

interface ContentProps {
  option: DropdownOption
}

const Content: FC<ContentProps> = ({ option }) => {
  const isWithNetwork = 'network' in option && option.network
  const isWithChainId = 'chainId' in option && option.chainId

  return (
    <>
      {'network' in option && option.network && (
        <TokenWithNetworkIcon
          tokenName={option.tokenSymbol}
          network={option.network}
          variant="tiny"
        />
      )}
      {'chainId' in option && option.chainId && (
        <TokenWithNetworkIcon
          tokenName={option.tokenSymbol}
          chainId={option.chainId}
          variant="tiny"
        />
      )}
      {'tokenSymbol' in option && !isWithNetwork && !isWithChainId && (
        <Icon size={20} tokenName={option.tokenSymbol} />
      )}
      {'iconName' in option && !isWithNetwork && !isWithChainId && (
        <Icon size={20} iconName={option.iconName} />
      )}
      <span>{option.label}</span>
      {'chainId' in option && option.chainId && (
        <Text as="span" variant="p4semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
          {humanReadableChainToLabelMap[option.chainId]}
        </Text>
      )}
    </>
  )
}

interface InputWithDropdownProps {
  options: DropdownOption[]
  dropdownValue: DropdownOption
  value: string
  secondaryValue?: string
  placeholder?: string
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
  tagsRow?: ReactNode
  withSearch?: boolean
  inputPlaceholder?: string
  wrapperClassName?: string
}

export const InputWithDropdown: FC<InputWithDropdownProps> = ({
  options,
  dropdownValue,
  value,
  secondaryValue,
  placeholder,
  handleChange,
  handleDropdownChange,
  heading,
  onFocus,
  onBlur,
  selectAllOnFocus,
  disabled,
  tagsRow,
  withSearch = false,
  inputPlaceholder = 'Search...',
  wrapperClassName,
}) => {
  const handleFocus = (ev: React.FocusEvent<HTMLInputElement>) => {
    if (selectAllOnFocus) {
      ev.target.select()
    }

    onFocus?.()
  }

  return (
    <div className={clsx(classNames.wrapper, wrapperClassName)}>
      {heading && (
        <div className={classNames.headingWrapper}>
          <Text as="p" variant="p3semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
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
      <div style={{ width: '100%' }}>
        <div className={classNames.inputWrapper}>
          <Suspense fallback={<SkeletonLine width={130} height={40} />}>
            <Dropdown
              options={options.map((item) => ({
                value: item.value,
                content: <Content key={item.label} option={item} />,
              }))}
              dropdownValue={{
                value: dropdownValue.value,
                content: <Content option={dropdownValue} />,
              }}
              asPill
              onChange={handleDropdownChange}
              isDisabled={disabled}
              withSearch={withSearch}
              inputPlaceholder={inputPlaceholder}
            >
              <Content option={dropdownValue} />
            </Dropdown>
          </Suspense>
          <Input
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            secondaryValue={secondaryValue}
            onFocus={handleFocus}
            onBlur={onBlur}
            disabled={disabled}
          />
        </div>
        {tagsRow && <div className={classNames.tagsWrapper}>{tagsRow}</div>}
      </div>
    </div>
  )
}
