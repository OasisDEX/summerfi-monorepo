'use client'

import { type FC, useEffect, useId, useRef, useState } from 'react'
import { type DateRange, DayPicker, type DayPickerProps } from 'react-day-picker'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import 'react-day-picker/style.css'

dayjs.extend(customParseFormat)

import { Input } from '@/components/atoms/Input/Input'
import { Text } from '@/components/atoms/Text/Text'
import { MobileDrawer } from '@/components/molecules/MobileDrawer/MobileDrawer'

import styles from './DateRangePicker.module.css'

type DateRangePickerProps = DayPickerProps & {
  isMobile: boolean
  onChange: (date: DateRange) => void
}

export const DateRangePicker: FC<DateRangePickerProps> = ({ isMobile, onChange }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dialogId = useId()
  const headerId = useId()

  const [month, setMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(undefined)
  const [inputValue, setInputValue] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setIsDialogOpen(false)
      }
    }

    if (!dialogRef.current) return
    if (isDialogOpen) {
      // Don't use showModal() to allow click outside to close
      dialogRef.current.show()
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      dialogRef.current.close()
    }

    // eslint-disable-next-line consistent-return
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDialogOpen])

  const handleDayPickerSelect = (date: DateRange | undefined) => {
    if (!date) {
      setInputValue('')
      setSelectedDate(undefined)

      return
    }

    // Handle range mode
    setSelectedDate(date)
    onChange(date)
    const formattedFrom = dayjs(date.from).format('DD/MM/YYYY')
    const formattedTo = dayjs(date.to).format('DD/MM/YYYY')
    const rangeText =
      formattedFrom === formattedTo ? formattedFrom : `${formattedFrom} - ${formattedTo}`

    setInputValue(rangeText)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Only allow digits (0-9), forward slashes (/), spaces, and hyphens (-)
    const allowedPattern = /^[0-9/\s-]*$/u

    if (!allowedPattern.test(newValue)) {
      return
    }

    setInputValue(newValue)

    // Check if it's a range (contains " - ")
    if (newValue.includes(' - ')) {
      const [fromStr, toStr] = newValue.split(' - ')
      const parsedFrom = dayjs(fromStr, 'DD/MM/YYYY')
      const parsedTo = dayjs(toStr, 'DD/MM/YYYY')

      if (parsedFrom.isValid() && parsedTo.isValid()) {
        const dateRange = { from: parsedFrom.toDate(), to: parsedTo.toDate() }

        setSelectedDate(dateRange)
        onChange(dateRange)
        setMonth(parsedFrom.toDate())
      } else {
        setSelectedDate(undefined)
      }
    } else {
      // Single date
      const parsedDate = dayjs(newValue, 'DD/MM/YYYY')

      if (parsedDate.isValid()) {
        const dateRange = { from: parsedDate.toDate(), to: parsedDate.toDate() }

        setSelectedDate(dateRange)
        onChange(dateRange)
        setMonth(parsedDate.toDate())
      } else {
        setSelectedDate(undefined)
      }
    }
  }

  return (
    <div className={styles.datePickerContainer}>
      <label htmlFor="date-input">
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-neutral-40)' }}>
          Pick a date:
        </Text>
      </label>
      <div className={styles.datePickerInputContainer}>
        <Input
          style={{ fontSize: 'inherit' }}
          id="date-input"
          type="text"
          value={inputValue}
          placeholder="DD/MM/YYYY - DD/MM/YYYY"
          onChange={handleInputChange}
          variant="withBorder"
          className={styles.datePickerInput}
        />{' '}
        <button
          style={{ fontSize: 'inherit' }}
          onClick={toggleDialog}
          aria-controls="dialog"
          aria-haspopup="dialog"
          aria-expanded={isDialogOpen}
          aria-label="Open calendar to choose booking date"
          className={styles.datePickerButton}
        >
          📆
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
              mode="range"
              selected={selectedDate}
              onSelect={handleDayPickerSelect}
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
            mode="range"
            selected={selectedDate}
            onSelect={handleDayPickerSelect}
            className={styles.datePicker}
          />
        </dialog>
      )}
    </div>
  )
}
