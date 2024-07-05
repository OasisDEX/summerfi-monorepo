'use client'

import { useState } from 'react'
import { Button, Divider, Input, RadioButtonGroup, Text } from '@summerfi/app-ui'
import BigNumber from 'bignumber.js'

import { AnimatedNumber } from '@/components/molecules/AnimatedNumber/AnimatedNumber'
import { ModalButton, ModalButtonProps } from '@/components/molecules/Modal/ModalButton'
import { CALCULATOR_NET_VALUE_CAP, getCalculatorValues } from '@/helpers/calculator'
import { formatAsShorthandNumbers } from '@/helpers/formatters'

import calculatorModalStyles from './CalculatorModal.module.scss'

const cleanInputValue = (value: string) => `${value}`.replace('$', '').trim()

const CalculatorModalRaysValue = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className={calculatorModalStyles.valueBox}>
      <Text
        as="h4"
        variant="h4"
        style={{
          color: value === 0 ? 'var(--color-primary-30)' : '#1e334d',
          transition: 'color 0.2s ease',
        }}
      >
        {value > 99999 ? (
          <>{formatAsShorthandNumbers(new BigNumber(value), 1)}</>
        ) : (
          <AnimatedNumber number={Number(value.toPrecision(2))} size={28} hasComma duration={400} />
        )}
      </Text>
      <Text as="p" variant="p3semi" style={{ color: 'var(--color-neutral-80)' }}>
        {label}
      </Text>
    </div>
  )
}

const CalculatorModalButton = (props: ModalButtonProps) => {
  return (
    <Button variant="secondaryLarge" {...props}>
      Use $RAYS Calculator
    </Button>
  )
}

const CalculatorModalContent = () => {
  const [amount, setAmount] = useState(0)
  const [calculatedForAmount, setCalculatedForAmount] = useState('')
  const [migration, setMigration] = useState<'true' | 'false'>('true')
  const [calculatedValues, setCalculatedValues] = useState({
    basePoints: 0,
    migrationBonus: 0,
    totalPoints: 0,
  })

  const calculateValues = () => {
    const safeAmount = amount > 0 ? amount : 0

    setCalculatedForAmount(`${safeAmount}${migration}`)
    setCalculatedValues(
      getCalculatorValues({
        usdAmount: safeAmount,
        migration: migration === 'true',
      }),
    )
  }

  const ctaLocked = calculatedForAmount === `${amount}${migration}` || amount === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Text as="h5" variant="h5" style={{ marginTop: '16px' }}>
        $RAYS Calculator
      </Text>
      <div className={calculatorModalStyles.valuesWrapper}>
        <CalculatorModalRaysValue value={calculatedValues.basePoints} label="Base" />
        <CalculatorModalRaysValue value={calculatedValues.migrationBonus} label="Migration" />
        <CalculatorModalRaysValue value={calculatedValues.totalPoints} label="Total" />
      </div>
      <Text as="p" variant="p3semi" style={{ margin: '32px 0 8px 0' }}>
        Amount
      </Text>
      <Input
        value={`$ ${amount || 0}`}
        style={{
          fontSize: '18px',
        }}
        onChange={(e) => {
          const cleanValue = cleanInputValue(e.target.value) || '0'

          return setAmount(
            parseFloat(cleanValue) > CALCULATOR_NET_VALUE_CAP ? amount : parseFloat(cleanValue),
          )
        }}
        onKeyDown={(ev) => {
          if (ev.key === 'Enter') {
            ev.preventDefault()
            calculateValues()
          }
        }}
        className={calculatorModalStyles.amountInput}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text as="p" variant="p3semi" style={{ margin: '32px 0 8px 0' }}>
          Migration
        </Text>
        <RadioButtonGroup
          name="migration"
          onChange={(nextMigration) => setMigration(nextMigration as 'true' | 'false')}
          value={migration}
          options={[
            {
              label: 'Yes',
              value: 'true',
            },
            {
              label: 'No',
              value: 'false',
            },
          ]}
        />
      </div>
      <Divider style={{ margin: '40px 0 20px 0' }} />
      <Button
        variant={ctaLocked ? 'secondaryLarge' : 'primaryLarge'}
        style={{ marginTop: 'var(--space-l)' }}
        onClick={calculateValues}
        disabled={ctaLocked}
      >
        Calculate $RAYS
      </Button>
    </div>
  )
}

export const CalculatorModal = () => {
  return <ModalButton Button={CalculatorModalButton} ModalContent={CalculatorModalContent} />
}
