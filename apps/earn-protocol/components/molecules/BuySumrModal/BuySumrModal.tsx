'use client'

import { useState } from 'react'
import {
  Button,
  type ButtonVariant,
  Card,
  Icon,
  MobileDrawer,
  Modal,
  Text,
  useMobileCheck,
} from '@summerfi/app-earn-ui'
import Link from 'next/dist/client/link'
import Image from 'next/image'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import aerodromeLogo from '@/public/img/campaigns/aerodrome-logo.svg'
import mexcLogo from '@/public/img/campaigns/mexc-logo.svg'

const sumrExchangesMap = [
  {
    name: 'Aerodrome',
    url: 'https://aerodrome.finance/swap?from=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&chain0=8453&to=0x194f360d130f2393a5e9f3117a6a1b78abea1624&chain1=8453',
    description: 'Aerodrome allows you to swap SUMR for various other tokens on Base.',
    logo: aerodromeLogo,
    logoHeight: 30,
  },
  {
    name: 'MEXC',
    url: 'https://www.mexc.com/exchange/SUMR_USDT',
    description: 'The MEXC Exchange allows you to trade SUMR against USDT.',
    logo: mexcLogo,
    logoHeight: 20,
  },
]

const BuySumrModalContent = () => {
  return (
    <Card variant="cardSecondary" style={{ maxWidth: '446px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Icon tokenName="SUMR" size={60} style={{ marginBottom: '10px' }} />
        <Text variant="h5" style={{ marginBottom: '30px' }}>
          SUMR is avaiable for trading on:
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {sumrExchangesMap.map((exchange) => (
            <Card
              key={exchange.name}
              variant="cardPrimary"
              style={{
                gap: '10px',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Image
                src={exchange.logo}
                alt={`${exchange.name} logo`}
                height={exchange.logoHeight}
                style={{ margin: '20px 0' }}
              />
              <Text variant="p4semi">{exchange.description}</Text>
              <Link href={exchange.url} target="_blank" rel="noopener noreferrer">
                <Button variant="textPrimarySmall" style={{ margin: '0 auto', minWidth: 'auto' }}>
                  Go to {exchange.name}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  )
}

export const BuySumrModal = ({ buttonVariant }: { buttonVariant?: ButtonVariant }) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const [isOpen, setIsOpen] = useState(false)
  const openModal = () => {
    setIsOpen(true)
  }
  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button
        variant={buttonVariant ?? 'textPrimaryMedium'}
        style={{ color: 'var(--color-text-primary)', cursor: 'pointer', width: 'auto' }}
        onClick={openModal}
      >
        Buy SUMR
      </Button>
      {isMobile ? (
        <MobileDrawer isOpen={isOpen} onClose={closeModal} height="auto">
          <BuySumrModalContent />
        </MobileDrawer>
      ) : (
        <Modal openModal={isOpen} closeModal={closeModal} noScroll>
          <BuySumrModalContent />
        </Modal>
      )}
    </>
  )
}
