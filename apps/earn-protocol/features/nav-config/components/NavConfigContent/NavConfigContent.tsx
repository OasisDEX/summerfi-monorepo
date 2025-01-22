'use client'
import { type ChangeEvent, type FC, useState } from 'react'
import {
  Button,
  Card,
  Icon,
  Input,
  PercentageBadge,
  Text,
  ToggleButton,
} from '@summerfi/app-earn-ui'
import { mapNumericInput } from '@summerfi/app-utils'
import Link from 'next/link'

import { useSlippageConfig } from '@/features/nav-config/hooks/useSlippageConfig'
import { useSumrNetApyConfig } from '@/features/nav-config/hooks/useSumrNetApyConfig'

import classNames from './NavConfigContent.module.scss'

interface NavConfigContentProps {
  handleOpenClose?: () => void
}

const slippageOptions = ['0.5', '1.00', '2.00', '2.50']

export const NavConfigContent: FC<NavConfigContentProps> = ({ handleOpenClose }) => {
  const [sumrNetApyConfig, setSumrNetApyConfig] = useSumrNetApyConfig()
  const [slippageConfig, setSlippageConfig] = useSlippageConfig()

  const [inputValue, setInputValue] = useState(mapNumericInput(sumrNetApyConfig.dilutedValuation))
  const [slippage, setSlippage] = useState(mapNumericInput(slippageConfig.slippage))
  const [activeSlippageOption, setActiveSlippageOption] = useState<number | undefined>(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    slippageOptions.findIndex((item) => item === slippageConfig.slippage) ?? 1,
  )
  const [sumrToggle, setSumrToggle] = useState(sumrNetApyConfig.withSumr)

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value) {
      setInputValue(mapNumericInput(ev.target.value))
    } else {
      setInputValue('')
    }
  }

  const handleSlippageChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value) {
      setSlippage(mapNumericInput(ev.target.value))
      setActiveSlippageOption(undefined)
    } else {
      setSlippage('')
    }
  }

  return (
    <Card variant="cardSecondary" style={{ maxWidth: '446px' }}>
      <div className={classNames.navConfigContent}>
        <Text
          as="h5"
          variant="h5"
          style={{ marginBottom: 'var(--general-space-20)', textAlign: 'center' }}
        >
          Settings
        </Text>
        <div className={classNames.spacerHeader} />
        <Text
          as="p"
          variant="p2semi"
          style={{
            marginBottom: 'var(--general-space-8)',
          }}
        >
          Update Net APY
        </Text>
        <Text
          as="p"
          variant="p3"
          style={{
            marginBottom: 'var(--general-space-24)',
            color: 'var(--earn-protocol-secondary-60)',
          }}
        >
          Net APY is affected by rate and SUMR rewards. You can choose either include both or only
          one of those in APY.
        </Text>
        <Input
          placeholder="Enter fully diluted valuation"
          variant="dark"
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className={classNames.toggleWrapper}>
          <ToggleButton
            title="Include SUMR"
            checked={sumrToggle}
            onChange={(ev) => {
              setSumrToggle(ev.target.checked)
            }}
            titleVariant="p3semi"
            wrapperStyle={{ width: '100%', justifyContent: 'space-between' }}
            trackVariant="dark"
          />
        </div>
        <div className={classNames.spacerContent} />
        <Text
          as="p"
          variant="p2semi"
          style={{
            marginBottom: 'var(--general-space-8)',
          }}
        >
          Max. Slippage
        </Text>
        <Text
          as="p"
          variant="p3"
          style={{
            marginBottom: 'var(--general-space-24)',
            color: 'var(--earn-protocol-secondary-60)',
          }}
        >
          Select the amount of slippage you would like.{' '}
          <Link href="/apps/earn-protocol/public">
            <span style={{ color: 'var(--earn-protocol-primary-100)' }}>Learn more</span>
          </Link>
        </Text>
        <Input
          placeholder="Enter slippage"
          variant="dark"
          value={slippage}
          onChange={handleSlippageChange}
        />
        <div className={classNames.slippageOptionsWrapper}>
          {slippageOptions.map((item, idx) => (
            <PercentageBadge
              value={item}
              key={item}
              onClick={() => {
                setSlippage(mapNumericInput(item))
                setActiveSlippageOption(idx)
              }}
              isActive={activeSlippageOption === idx}
            />
          ))}
        </div>
        <div
          style={
            handleOpenClose
              ? {
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }
              : {}
          }
        >
          {handleOpenClose && (
            <Button variant="secondaryLarge" onClick={handleOpenClose}>
              <Icon iconName="close" size={12} style={{ opacity: 0.5 }} />
              Close
            </Button>
          )}
          <Button
            variant="primaryLarge"
            onClick={() => {
              setSumrNetApyConfig({
                withSumr: sumrToggle,
                dilutedValuation: inputValue,
              })
              setSlippageConfig({ slippage })
            }}
            disabled={
              (sumrNetApyConfig.dilutedValuation === inputValue.replaceAll(',', '') &&
                sumrNetApyConfig.withSumr === sumrToggle &&
                slippageConfig.slippage === slippage.replaceAll(',', '')) ||
              slippage === '' ||
              slippage.endsWith('.')
            }
          >
            Save changes
          </Button>
        </div>
      </div>
    </Card>
  )
}
