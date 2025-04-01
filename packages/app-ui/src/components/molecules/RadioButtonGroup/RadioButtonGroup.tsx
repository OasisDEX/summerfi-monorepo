/* eslint-disable @typescript-eslint/no-shadow */

import { RadioButton } from '@/components/atoms/RadioButton/RadioButton'

export const RadioButtonGroup = ({
  name,
  options,
  value,
  onChange,
  vertical = false,
}: {
  name: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  vertical?: boolean
}): React.ReactNode => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      {options.map((option) => (
        <RadioButton
          key={option.value}
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          label={option.label}
        />
      ))}
    </div>
  )
}
