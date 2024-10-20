'use client'

import { useEffect, useRef, useState } from 'react'
import { type DropdownOption } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'

import dropdownStyles from '@/components/molecules/Dropdown/Dropdown.module.scss'

export interface DropdownProps {
  options: DropdownOption[]
  dropdownValue: DropdownOption
  onChange?: (option: DropdownOption) => void
}

export const Dropdown: React.FC<DropdownProps> = ({ options, dropdownValue, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<DropdownOption>(dropdownValue)
  const [isOpen, setIsOpen] = useState(false) // To manage dropdown open/close state
  const dropdownRef = useRef<HTMLDivElement | null>(null) // Reference for the dropdown

  useEffect(() => {
    if (!onChange) {
      // if theres no onChange prop, set the selected option to
      // the dropdownValue as controlled component behavior
      setSelectedOption(dropdownValue)
    }
  }, [onChange, dropdownValue])

  const handleSelectOption = (option: DropdownOption) => {
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
      <div className={dropdownStyles.dropdownSelected} onClick={toggleDropdown}>
        {'tokenSymbol' in selectedOption && <Icon tokenName={selectedOption.tokenSymbol} />}
        {'iconName' in selectedOption && <Icon iconName={selectedOption.iconName} />}
        <span>{selectedOption.label}</span>
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
            {'tokenSymbol' in option && <Icon tokenName={option.tokenSymbol} />}
            {'iconName' in option && <Icon iconName={option.iconName} />}
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
