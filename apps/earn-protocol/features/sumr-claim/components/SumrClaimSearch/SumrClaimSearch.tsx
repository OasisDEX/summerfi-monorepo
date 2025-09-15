'use client'
import { type ChangeEvent, useState } from 'react'
import { useAuthModal, useUser } from '@account-kit/react'
import { Button, Input, Text, useUserWallet } from '@summerfi/app-earn-ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isAddress } from 'viem'

import { PortfolioTabs } from '@/features/portfolio/types'
import { EarnProtocolEvents } from '@/helpers/mixpanel'

import classNames from './SumrClaimSearch.module.css'

export const SumrClaimSearch = () => {
  const user = useUser()
  const pathname = usePathname()
  const { userWalletAddress } = useUserWallet()
  const { openAuthModal } = useAuthModal()

  const [inputError, setInputError] = useState('')
  const [inputValue, setInputValue] = useState('')

  const resolvedAddress = inputValue || userWalletAddress

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setInputError('')
    const newInputValue = e.target.value

    if (newInputValue.length > 0 && !isAddress(newInputValue)) {
      setInputError('Please enter a valid address')
    }

    setInputValue(newInputValue)
  }

  const handleButtonClick = () => {
    if (isAddress(resolvedAddress ?? '')) {
      EarnProtocolEvents.buttonClicked({
        buttonName: 'ep-sumr-claim-search',
        page: pathname,
      })

      return
    }

    if (!user) {
      EarnProtocolEvents.buttonClicked({
        buttonName: 'ep-sumr-claim-search',
        page: pathname,
      })
      openAuthModal()

      return
    }

    if (resolvedAddress) {
      EarnProtocolEvents.buttonClicked({
        buttonName: 'ep-sumr-claim-search',
        page: pathname,
        walletAddress: resolvedAddress,
      })

      return
    }
    // eslint-disable-next-line no-console
    console.warn('No $SUMR button action defined')
  }

  const resolvedButtonText =
    inputValue.length > 0
      ? 'Check address'
      : !userWalletAddress
        ? 'Connect Wallet'
        : 'View your address'

  const isButtonDisabled =
    !user && inputValue.length === 0 ? false : !isAddress(resolvedAddress ?? '')

  return (
    <div className={classNames.sumrClaimSearchWrapper} id="claim">
      <Text as="h1" variant="h1" className={classNames.headerTextual}>
        <Text as="span" variant="h1" className={classNames.headerTextualColored}>
          $SUMR
        </Text>{' '}
        - Powering DeFi&apos;s best yield optimizer
      </Text>
      <Text as="p" variant="p1" className={classNames.headerDescription}>
        The token that powers DeFi’s best yield optimizer
      </Text>
      <div className={classNames.actionableWrapper}>
        <Input
          variant="withBorder"
          placeholder="Search wallet address"
          icon={{
            name: 'search_icon',
            size: 20,
            style: { color: 'var(--earn-protocol-secondary-100)' },
          }}
          onChange={handleSearch}
          value={inputValue}
        />

        {inputError.length > 0 && (
          <Text variant="p3" style={{ color: 'var(--earn-protocol-critical-100)' }}>
            {inputError}
          </Text>
        )}
        <Link
          href={
            isAddress(resolvedAddress ?? '')
              ? `/portfolio/${resolvedAddress}?tab=${PortfolioTabs.REWARDS}`
              : '/sumr'
          }
          prefetch
        >
          <Button
            variant="primaryLarge"
            style={{ minWidth: 'unset', width: '100%' }}
            onClick={handleButtonClick}
            disabled={isButtonDisabled}
          >
            {resolvedButtonText}
          </Button>
        </Link>
      </div>
    </div>
  )
}
