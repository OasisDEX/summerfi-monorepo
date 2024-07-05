'use client'

import { useEffect, useState } from 'react'
import { Button, Divider, Input, LoadingSpinner, RadioButtonGroup, Text } from '@summerfi/app-ui'
import { IconCurrencyDollar, IconWallet } from '@tabler/icons-react'
import { useConnectWallet } from '@web3-onboard/react'
import BigNumber from 'bignumber.js'

import { AnimatedNumber } from '@/components/molecules/AnimatedNumber/AnimatedNumber'
import { ModalButton, ModalButtonProps } from '@/components/molecules/Modal/ModalButton'
import { basePath } from '@/helpers/base-path'
import { CALCULATOR_NET_VALUE_CAP, getCalculatorValues } from '@/helpers/calculator'
import { formatAsShorthandNumbers } from '@/helpers/formatters'

import calculatorModalStyles from './CalculatorModal.module.scss'

const DollarIconElement = () => <IconCurrencyDollar size={20} />

const AmountTooHigh = ({ label }: { label: string }) => (
  <div className={calculatorModalStyles.valueBox}>
    <Text as="h5" variant="h5" style={{ color: 'var(--color-primary-30)', marginTop: '8px' }}>
      ( ͡~ ͜ʖ ͡°)
    </Text>
    <Text as="p" variant="p3semi" style={{ color: 'var(--color-neutral-80)' }}>
      {label}
    </Text>
  </div>
)

const CalculatorModalRaysValue = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className={calculatorModalStyles.valueBox}>
      <Text as="h4" variant="h4" style={{ color: 'var(--color-primary-30)' }}>
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
  const [{ wallet }] = useConnectWallet()
  const [amount, setAmount] = useState(0)
  const [migration, setMigration] = useState<'true' | 'false'>('true')
  const [importingWallet, setImportingWallet] = useState(false)
  const [calculatedValues, setCalculatedValues] = useState({
    basePoints: 0,
    migrationBonus: 0,
    totalPoints: 0,
  })

  const calculateValues = () => {
    const safeAmount = amount > 0 ? amount : 0

    setCalculatedValues(
      getCalculatorValues({
        usdAmount: safeAmount,
        migration: migration === 'true',
      }),
    )
  }

  const importConnectedWalletAssets = () => {
    if (!importingWallet) {
      setImportingWallet(true)
      fetch(`${basePath}/api/wallet-assets?address=${wallet?.accounts[0].address}`)
        .then((response) => response.json())
        .then(({ totalValue }) => {
          setImportingWallet(false)
          if (Number.isNaN(totalValue)) return
          setAmount(Number(Number(totalValue).toFixed(2)))
        })
    }
  }

  useEffect(() => {
    calculateValues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [migration])

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Text as="h5" variant="h5" style={{ marginTop: '16px' }}>
        $RAYS Calculator
      </Text>
      <div className={calculatorModalStyles.valuesWrapper}>
        {amount > CALCULATOR_NET_VALUE_CAP ? (
          <>
            <AmountTooHigh label="Base" />
            <AmountTooHigh label="Migration" />
            <AmountTooHigh label="Total" />
          </>
        ) : (
          <>
            <CalculatorModalRaysValue value={calculatedValues.basePoints} label="Base" />
            <CalculatorModalRaysValue value={calculatedValues.migrationBonus} label="Migration" />
            <CalculatorModalRaysValue value={calculatedValues.totalPoints} label="Total" />
          </>
        )}
      </div>
      <Text as="p" variant="p3semi" style={{ margin: '32px 0 8px 0' }}>
        Amount
      </Text>
      <Input
        CustomIcon={DollarIconElement}
        value={amount || 0}
        onChange={(e) =>
          setAmount(
            parseFloat(e.target.value) > CALCULATOR_NET_VALUE_CAP
              ? amount
              : parseFloat(e.target.value),
          )
        }
        onKeyDown={(ev) => {
          if (ev.key === 'Enter') {
            ev.preventDefault()
            calculateValues()
          }
        }}
        className={calculatorModalStyles.amountInput}
      />
      {wallet?.accounts[0].address && (
        <Button
          variant="neutralSmall"
          style={{ marginTop: '20px' }}
          onClick={importConnectedWalletAssets}
          disabled={importingWallet}
        >
          {importingWallet ? (
            <LoadingSpinner />
          ) : (
            <>
              <IconWallet />
              import connected wallet assets value
            </>
          )}
        </Button>
      )}
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
      <Divider style={{ margin: '20px 0' }} />
      <Button
        variant="secondaryLarge"
        style={{ marginTop: 'var(--space-md)' }}
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
