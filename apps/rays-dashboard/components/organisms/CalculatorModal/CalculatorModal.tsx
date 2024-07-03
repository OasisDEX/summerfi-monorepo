'use client'

import { useEffect, useState } from 'react'
import { Button, Divider, Input, RadioButton, RadioButtonGroup, Text } from '@summerfi/app-ui'
import BigNumber from 'bignumber.js'
import { useToggle } from 'usehooks-ts'

import { AnimatedNumber } from '@/components/molecules/AnimatedNumber/AnimatedNumber'
import { ModalButton, ModalButtonProps } from '@/components/molecules/Modal/ModalButton'
import { formatAsShorthandNumbers } from '@/helpers/formatters'

const AmountTooHigh = ({ label }: { label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
    <Text as="h5" variant="h5" style={{ color: 'var(--color-primary-30)', marginTop: '8px' }}>
      [̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]
    </Text>
    <Text as="p" variant="p3semi" style={{ color: 'var(--color-neutral-80)' }}>
      {label}
    </Text>
  </div>
)

const CalculatorModalRaysValue = ({ value, label }: { value: number; label: string }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
      <Text as="h4" variant="h4" style={{ color: 'var(--color-primary-30)' }}>
        {value > 99999 ? (
          <>{formatAsShorthandNumbers(new BigNumber(value), 1)}</>
        ) : (
          <AnimatedNumber number={Number(value.toPrecision(4))} size={28} hasComma duration={400} />
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
  const [migration, setMigration] = useState<'true' | 'false'>('true')
  const [calculatedValues, setCalculatedValues] = useState([0, 0, 0])

  const calculateValues = () => {
    const safeAmount = amount > 0 ? amount : 0
    const basePoints = (safeAmount / 10000) * 690
    const migrationBonus = migration === 'true' ? basePoints * 0.2 : 0
    const totalPoints = basePoints + migrationBonus

    setCalculatedValues([basePoints, migrationBonus, totalPoints])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Text as="h5" variant="h5" style={{ marginTop: '16px' }}>
        $RAYS Calculator
      </Text>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          padding: 'var(--space-l) var(--space-l)',
        }}
      >
        {amount > 9999999999999 ? (
          <>
            <AmountTooHigh label="Base" />
            <AmountTooHigh label="Migration" />
            <AmountTooHigh label="Total" />
          </>
        ) : (
          <>
            <CalculatorModalRaysValue value={calculatedValues[0]} label="Base" />
            <CalculatorModalRaysValue value={calculatedValues[1]} label="Migration" />
            <CalculatorModalRaysValue value={calculatedValues[2]} label="Total" />
          </>
        )}
      </div>
      <Text as="p" variant="p3semi" style={{ margin: '32px 0 8px 0' }}>
        Amount
      </Text>
      <Input
        icon={{
          name: 'dai_circle_color',
          size: 24,
        }}
        value={amount || 0}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        style={{
          padding: 'var(--space-m) var(--space-m) var(--space-m) 50px',
          width: '100%',
        }}
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
        variant="secondaryLarge"
        style={{ marginTop: 'var(--space-l)' }}
        onClick={calculateValues}
      >
        Calculate $RAYS
      </Button>
    </div>
  )
}

export const CalculatorModal = () => {
  return <ModalButton Button={CalculatorModalButton} ModalContent={CalculatorModalContent} />
}
