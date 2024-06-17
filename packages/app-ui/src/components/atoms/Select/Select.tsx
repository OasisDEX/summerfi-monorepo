'use client'

import React, { useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import classNames from '@/components/atoms/Select/Select.module.scss'

interface SelectProps {
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  value: string
  placeholder: string
}

export const Select: React.FC<SelectProps> = ({ options, onChange, value, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={classNames.selectContainer} ref={selectRef}>
      <div className={classNames.styledSelect} onClick={handleToggle}>
        <Text as="span" variant="p3semi">
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        {/* <span className="arrow">&#9662;</span>*/}
        <Icon iconName="chevron_down" size={11} />
      </div>
      {isOpen && (
        <ul className={classNames.selectOptions}>
          {options.map((option) => (
            <li
              key={option.value}
              className={
                option.value === value ? classNames.selectedOption : classNames.selectOption
              }
              onClick={() => handleOptionClick(option.value)}
            >
              <Text as="span" variant="p3">
                {option.label}
              </Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
