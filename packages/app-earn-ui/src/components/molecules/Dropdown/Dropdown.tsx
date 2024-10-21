'use client'

import { type FC, type ReactNode, useEffect, useRef, useState } from 'react'
import { type DropdownRawOption } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'

import dropdownStyles from '@/components/molecules/Dropdown/Dropdown.module.scss'

export interface DropdownProps {
  options: DropdownRawOption[]
  dropdownValue: DropdownRawOption
  onChange?: (option: DropdownRawOption) => void
  children: ReactNode
  asPill?: boolean
}

export const Dropdown: FC<DropdownProps> = ({
  options,
  dropdownValue,
  onChange,
  children,
  asPill,
}) => {
  const [selectedOption, setSelectedOption] = useState<DropdownRawOption>(dropdownValue)
  const [isOpen, setIsOpen] = useState(false) // To manage dropdown open/close state
  const dropdownRef = useRef<HTMLDivElement | null>(null) // Reference for the dropdown

  useEffect(() => {
    if (!onChange) {
      // if there is no onChange prop, set the selected option to
      // the dropdownValue as controlled component behavior
      setSelectedOption(dropdownValue)
    }
  }, [onChange, dropdownValue])

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

  return (
    <div className={dropdownStyles.dropdown} ref={dropdownRef}>
      <div
        className={dropdownStyles.dropdownSelected}
        onClick={toggleDropdown}
        style={
          asPill
            ? {
                padding: '5px 8px 5px 5px',
                backgroundColor: 'var(--earn-protocol-neutral-80)',
                borderRadius: 'var(--general-radius-24)',
              }
            : {}
        }
      >
        {children}
        <Icon
          iconName={isOpen ? 'chevron_up' : 'chevron_down'}
          size={11}
          color="rgba(119, 117, 118, 1)"
        />
      </div>

      <div
        className={`${dropdownStyles.dropdownOptions} ${isOpen ? dropdownStyles.dropdownShow : ''}`}
        aria-hidden={!isOpen} // For accessibility
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={`${dropdownStyles.dropdownOption} ${option.value === selectedOption.value ? dropdownStyles.selected : ''}`}
            onClick={() => handleSelectOption(option)}
          >
            {option.content}
          </div>
        ))}
      </div>
    </div>
  )
}
