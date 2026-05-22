'use client'

import { type FC, useEffect, useId, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import 'react-day-picker/style.css'

dayjs.extend(customParseFormat)

import { Icon } from '@/components/atoms/Icon/Icon'
import { Input } from '@/components/atoms/Input/Input'
import { MobileDrawer } from '@/components/molecules/MobileDrawer/MobileDrawer'

import styles from './DatePicker.module.css'

type DatePickerProps = {
  isMobile: boolean
  onChange: (date: Date | undefined) => void
  value?: Date
  minDate?: Date
  maxDate?: Date
}

export const DatePicker: FC<DatePickerProps> = ({
  isMobile,
  onChange,
  value,
  minDate,
  maxDate,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dialogId = useId()
  const headerId = useId()

  const [month, setMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [inputValue, setInputValue] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true

    if (maxDate && date > maxDate) return true

    return false
  }

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen)

  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(ev.target as Node)) {
        setIsDialogOpen(false)
      }
    }

    if (dialogRef.current) {
      if (isDialogOpen) {
        dialogRef.current.show()
        document.addEventListener('mousedown', handleClickOutside)
      } else {
        dialogRef.current.close()
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDialogOpen])

  useEffect(() => {
    setSelectedDate(value)
    setInputValue(value ? dayjs(value).format('DD/MM/YYYY') : '')
  }, [value])

  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) {
      setInputValue('')
      setSelectedDate(undefined)
      onChange(undefined)

      return
    }

    if (isDateDisabled(date)) {
      return
    }

    setSelectedDate(date)
    onChange(date)
    setInputValue(dayjs(date).format('DD/MM/YYYY'))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    if (!/^[0-9/]*$/u.test(newValue)) {
      return
    }

    setInputValue(newValue)

    if (newValue === '') {
      setSelectedDate(undefined)
      onChange(undefined)

      return
    }

    const parsedDate = dayjs(newValue, 'DD/MM/YYYY')

    if (parsedDate.isValid()) {
      const date = parsedDate.toDate()

      if (isDateDisabled(date)) {
        setSelectedDate(undefined)

        return
      }

      setSelectedDate(date)
      onChange(date)
      setMonth(date)

      return
    }

    setSelectedDate(undefined)
  }

  return (
    <div className={styles.datePickerContainer}>
      <div className={styles.datePickerInputContainer}>
        <Input
          style={{ fontSize: 'inherit' }}
          id="date-input"
          type="text"
          value={inputValue}
          placeholder="DD/MM/YYYY"
          onChange={handleInputChange}
          variant="dark"
        />
        <button
          style={{ fontSize: 'inherit' }}
          onClick={toggleDialog}
          aria-controls="dialog"
          aria-haspopup="dialog"
          aria-expanded={isDialogOpen}
          aria-label="Open calendar to choose date"
          className={styles.datePickerButton}
        >
          <Icon
            iconName="calendar"
            size={20}
            style={{
              color: 'var(--earn-protocol-secondary-40)',
            }}
          />
        </button>
      </div>
      {isMobile ? (
        <MobileDrawer isOpen={isDialogOpen} onClose={toggleDialog} height="40vh">
          <div className={styles.datePickerMobileWrapper}>
            <DayPicker
              navLayout="around"
              month={month}
              onMonthChange={setMonth}
              autoFocus
              mode="single"
              selected={selectedDate}
              onSelect={handleDayPickerSelect}
              disabled={isDateDisabled}
              className={styles.datePicker}
            />
          </div>
        </MobileDrawer>
      ) : (
        <dialog
          role="dialog"
          ref={dialogRef}
          id={dialogId}
          aria-modal
          aria-labelledby={headerId}
          onClose={() => setIsDialogOpen(false)}
          className={styles.datePickerDialog}
        >
          <DayPicker
            navLayout="around"
            month={month}
            onMonthChange={setMonth}
            autoFocus
            mode="single"
            selected={selectedDate}
            onSelect={handleDayPickerSelect}
            disabled={isDateDisabled}
            className={styles.datePicker}
          />
        </dialog>
      )}
    </div>
  )
}
