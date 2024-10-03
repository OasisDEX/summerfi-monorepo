'use client'

import React, { useEffect, useRef, useState } from 'react'
import { type DropdownOption } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'

import dropdownStyles from '@/components/molecules/Dropdown/Dropdown.module.scss'

export interface DropdownProps {
  options: DropdownOption[]
  dropdownValue: DropdownOption
}

export const Dropdown: React.FC<DropdownProps> = ({ options, dropdownValue }) => {
  const [selectedOption, setSelectedOption] = useState<DropdownOption>(dropdownValue)
  const [isOpen, setIsOpen] = useState(false) // To manage dropdown open/close state
  const dropdownRef = useRef<HTMLDivElement | null>(null) // Reference for the dropdown

  const handleSelectOption = (option: DropdownOption) => {
    setSelectedOption(option)
    setIsOpen(false) // Close dropdown after selection
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
      <div className={dropdownStyles.dropdownSelected} onClick={toggleDropdown}>
        {'tokenSymbol' in selectedOption && <Icon tokenName={selectedOption.tokenSymbol} />}
        {'iconName' in selectedOption && <Icon iconName={selectedOption.iconName} />}
        {/* <img src={selectedOption.icon} alt={selectedOption.label} className={dropdownStyles.dropdownIcon} />*/}
        <span>{selectedOption.label}</span>
        <Icon iconName={isOpen ? 'chevron_up' : 'chevron_down'} size={11} color="#777576" />
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
            {'tokenSymbol' in option && <Icon tokenName={option.tokenSymbol} />}
            {'iconName' in option && <Icon iconName={option.iconName} />}
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
