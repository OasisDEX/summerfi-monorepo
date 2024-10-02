'use client'
import React, { type ChangeEvent, useState } from 'react'
import { Button, Card, Icon, Input, Pill, Text, Tooltip } from '@summerfi/app-earn-ui'

export const LandingStrategyPicker = () => {
  const [value, setValue] = useState('10000')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginBottom: '97px',
        }}
      >
        <Text as="h1" variant="h1" style={{ color: 'white', textAlign: 'center' }}>
          Automated Exposure to DeFi’s
        </Text>
        <Text as="h1" variant="h1" style={{ color: '#FF49A4', textAlign: 'center' }}>
          Highest Quality Yield
        </Text>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          gap: '5px',
        }}
      >
        <Card
          style={{
            width: '515px',
            flexDirection: 'column',
            alignItems: 'center',
            border: 'unset',
          }}
          variant="cardPrimary"
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon tokenName="USDC" variant="xxl" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text
                  as="h4"
                  variant="h4"
                  style={{ color: 'white', fontSize: '24px', lineHeight: '30px' }}
                >
                  USDC
                </Text>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <Text as="p" variant="p3" style={{ color: '#F29109' }}>
                    Medium risk
                  </Text>
                  <Tooltip tooltip="TBD">
                    <Icon iconName="question_o" variant="s" style={{ stroke: '#F29109' }} />
                  </Tooltip>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Text style={{ color: '#FFFBFD' }}>
                <Pill>APY 9.3%</Pill>
              </Text>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '36px',
                  width: '36px',
                  border: '1px solid',
                  borderColor: '#474747',
                  backgroundColor: '#333333',
                  borderRadius: 'var(--radius-circle)',
                  cursor: 'pointer',
                }}
              >
                <Icon iconName="cog" variant="s" />
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text as="p" variant="p3semi" style={{ color: '#777576' }}>
                Total assets
              </Text>
              <Text style={{ color: '#FFFBFD' }}>$800,130,321</Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text as="p" variant="p3semi" style={{ color: '#777576' }}>
                Best for
              </Text>
              <Text style={{ color: '#FFFBFD' }}>$800,130,321</Text>
            </div>
          </div>
        </Card>
        <Card
          style={{
            width: '515px',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
          variant="cardPrimary"
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '100%',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <Text as="h5" variant="h5" style={{ color: 'white' }}>
              Deposit
            </Text>
          </div>

          <div
            style={{
              position: 'absolute',
              borderBottom: '1px solid #1B1B1B',
              height: '1px',
              width: '100%',
              top: '80px',
            }}
          />
          <div
            style={{
              position: 'relative',
              marginTop: '32px',
              width: '100%',
              marginBottom: 'var(--space-l)',
            }}
          >
            <Input placeholder="0" value={value} onChange={handleChange} />
          </div>

          <Card
            style={{
              // width: '515px',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              marginBottom: 'var(--space-xl)',
            }}
            variant="cardSecondary"
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Text as="p" variant="p3semi" style={{ color: '#777576' }}>
                Estimated earnings after 1 year
              </Text>
              <Text as="p" variant="p1semiColorful">
                67,353 USDC
              </Text>
            </div>
          </Card>
          <Button variant="primaryLarge" style={{ marginBottom: 'var(--space-m)', width: '100%' }}>
            Get started
          </Button>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Tooltip tooltip="TBD">
              <Icon iconName="question_o" variant="xs" style={{ stroke: '#FF49A4' }} />
            </Tooltip>
            <Text as="p" variant="p4" style={{ color: '#FF49A4' }}>
              Key details about your assets
            </Text>
          </div>
        </Card>
      </div>
    </div>
  )
}
