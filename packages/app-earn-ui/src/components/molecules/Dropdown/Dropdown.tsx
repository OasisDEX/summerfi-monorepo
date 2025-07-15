'use client'

import { type CSSProperties, type FC, type ReactNode, useEffect, useRef, useState } from 'react'
import { type DropdownRawOption } from '@summerfi/app-types'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Input } from '@/components/atoms/Input/Input'
import { Text } from '@/components/atoms/Text/Text'
import {
  MobileDrawer,
  MobileDrawerDefaultWrapper,
} from '@/components/molecules/MobileDrawer/MobileDrawer'
import { useMobileCheck } from '@/hooks/use-mobile-check'

import dropdownStyles from '@/components/molecules/Dropdown/Dropdown.module.css'

type TriggerProps = { isOpen: boolean; isDisabled?: boolean }

interface DropdownProps {
  options: DropdownRawOption[]
  dropdownValue: DropdownRawOption
  children: ReactNode
  asPill?: boolean
  withSearch?: boolean
  inputPlaceholder?: string
  isDisabled?: boolean
  dropdownOptionsStyle?: CSSProperties
  dropdownChildrenStyle?: CSSProperties
  trigger?: (props: TriggerProps) => ReactNode
  onChange?: (option: DropdownRawOption) => void
}

export const Dropdown: FC<DropdownProps> = ({
  options,
  dropdownValue,
  children,
  asPill,
  withSearch,
  inputPlaceholder,
  isDisabled,
  dropdownOptionsStyle,
  dropdownChildrenStyle,
  onChange,
  trigger,
}) => {
  const [selectedOption, setSelectedOption] = useState<DropdownRawOption>(dropdownValue)
  const [isOpen, setIsOpen] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const { isMobile } = useMobileCheck()

  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (dropdownValue !== selectedOption) {
      // removed the check for onChange
      // we need both dropdownValue and selectedOption to
      // be in sync (always, regardless of onChange)
      setSelectedOption(dropdownValue)
    }
  }, [dropdownValue, selectedOption])

  const handleSelectOption = (option: DropdownRawOption) => {
    if (onChange) {
      onChange(option)
    }
    setSelectedOption(option)
    setIsOpen(false) // Close dropdown after selection
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Close dropdown when clicking outside
  const handleClickOutside = (ev: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(ev.target as Node)) {
      setIsOpen(false)
    }
  }

  // Effect to handle click outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const optionsMapped = options
    .filter((option) =>
      inputValue.length ? option.value.toLowerCase().includes(inputValue.toLowerCase()) : true,
    )
    .map((option) => (
      <div
        key={option.value}
        className={`${dropdownStyles.dropdownOption} ${option.value === selectedOption.value ? dropdownStyles.selected : ''}`}
        onClick={() => handleSelectOption(option)}
      >
        <Text variant="p3semi">{option.content}</Text>
      </div>
    ))

  const hasMultipleOptions = optionsMapped.length > 1

  return (
    <div className={dropdownStyles.dropdown} ref={dropdownRef}>
      <div
        className={clsx(dropdownStyles.dropdownSelected, {
          [dropdownStyles.disabled]: isDisabled,
        })}
        onClick={hasMultipleOptions ? toggleDropdown : undefined}
        style={
          asPill
            ? {
                padding: '8px 16px 8px 10px',
                backgroundColor: 'var(--earn-protocol-neutral-85)',
                border: '1px solid var(--earn-protocol-neutral-80)',
                ...((isOpen || isHover) && {
                  border: '1px solid var(--earn-protocol-neutral-60)',
                }),
                transition: 'border 0.2s ease-in-out',
                borderRadius: 'var(--general-radius-24)',
                fontWeight: '600',
                cursor: hasMultipleOptions ? 'pointer' : 'default',
                ...dropdownChildrenStyle,
              }
            : { ...dropdownChildrenStyle }
        }
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {trigger ? trigger({ isOpen, isDisabled }) : children}
        {!trigger && hasMultipleOptions && (
          <Icon
            iconName={isOpen ? 'chevron_up' : 'chevron_down'}
            size={12}
            color={
              isOpen ? 'var(--earn-protocol-secondary-100)' : 'var(--earn-protocol-secondary-40)'
            }
            style={{ marginLeft: 'var(--spacing-space-3x-small)' }}
          />
        )}
      </div>

      {isMobile ? (
        <MobileDrawer
          isOpen={isOpen}
          slideFrom="bottom"
          height="auto"
          variant="default"
          zIndex={1001}
          onClose={() => setIsOpen(false)}
          style={{ backgroundColor: 'unset' }}
        >
          <MobileDrawerDefaultWrapper>
            {withSearch && (
              <Input
                placeholder={inputPlaceholder}
                className={dropdownStyles.searchInput}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}
            <div className={dropdownStyles.mobileContentWrapper}>{optionsMapped}</div>
          </MobileDrawerDefaultWrapper>
        </MobileDrawer>
      ) : (
        <div
          className={`${dropdownStyles.dropdownOptions} ${isOpen ? dropdownStyles.dropdownShow : dropdownStyles.dropdownHide}`}
          aria-hidden={!isOpen} // For accessibility
          style={dropdownOptionsStyle}
        >
          {withSearch && (
            <Input
              placeholder={inputPlaceholder}
              className={dropdownStyles.searchInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          )}
          <div className={dropdownStyles.dropdownOverflowWrapper}>{optionsMapped}</div>
        </div>
      )}
    </div>
  )
}
