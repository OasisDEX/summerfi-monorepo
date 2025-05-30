'use client'
import { type ChangeEvent, useEffect, useState } from 'react'
import { useAuthModal, useUser } from '@account-kit/react'
import {
  Button,
  Card,
  GradientBox,
  Input,
  LoadingSpinner,
  NewsletterWrapper,
  SkeletonLine,
  Text,
} from '@summerfi/app-earn-ui'
import { formatAddress, formatCryptoBalance } from '@summerfi/app-utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isAddress } from 'viem'

import { PortfolioTabs } from '@/features/portfolio/types'
import { getUserSumrEligibility } from '@/features/sumr-claim/helpers/getUserSumrEligibility'
import { trackButtonClick, trackInputChange } from '@/helpers/mixpanel'
import { useUserAggregatedRewards } from '@/hooks/use-user-aggregated-rewards'

import classNames from './SumrClaimSearch.module.css'

export const SumrClaimSearch = () => {
  const { push } = useRouter()
  const user = useUser()
  const { openAuthModal } = useAuthModal()

  const [eligibleUsers, setEligibleUsers] =
    useState<{ ens: string | null; userAddress: string }[]>()
  const [isBoxVisible, setIsBoxVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [inputError, setInputError] = useState('')
  const [inputValue, setInputValue] = useState('')

  const resolvedAddress = inputValue || user?.address

  const eligibleUser = eligibleUsers?.length === 1 ? eligibleUsers[0] : undefined

  const { claimableAggregatedRewards, isLoading: isAggregatedRewardsLoading } =
    useUserAggregatedRewards({
      walletAddress: eligibleUser?.userAddress,
    })

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setInputError('')
    const newInputValue = e.target.value

    if (newInputValue.length > 0) {
      setIsLoading(true)
    }

    if (newInputValue.length === 0) {
      setIsLoading(false)
    }

    if (newInputValue.startsWith('0x')) {
      setInputError(isAddress(newInputValue) ? '' : 'Please enter a valid address')
    }

    setInputValue(newInputValue)
    setIsBoxVisible(true)
  }

  const resolvedPortfolioUserAddress = eligibleUser?.userAddress ?? user?.address

  const handleButtonClick = () => {
    if (!user) {
      trackButtonClick({
        id: 'SumrClaimSearch',
        page: '/sumr',
        userAddress: '',
      })
      openAuthModal()

      return
    }

    if (resolvedPortfolioUserAddress) {
      trackButtonClick({
        id: 'SumrClaimSearch',
        page: '/sumr',
        userAddress: resolvedPortfolioUserAddress,
        searcherdForAddress: resolvedAddress,
      })
      push(`/portfolio/${resolvedPortfolioUserAddress}?tab=${PortfolioTabs.REWARDS}`)

      return
    }
    // eslint-disable-next-line no-console
    console.warn('No $SUMR button action defined')
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setEligibleUsers(undefined)
      const request = async (address: string) => {
        try {
          const leaderboard = await getUserSumrEligibility(address)

          setEligibleUsers(
            leaderboard.map((item) => ({ ens: item.ens, userAddress: item.userAddress })),
          )

          setIsLoading(false)
        } catch (e) {
          setIsLoading(false)
          setInputError('Error fetching user $SUMR eligibility')
        }
      }

      if (resolvedAddress) {
        void request(resolvedAddress)
      }
      if (inputValue) {
        trackInputChange({
          id: 'SumrClaimSearch',
          page: '/sumr',
          userAddress: user?.address,
          searcherdForAddress: resolvedAddress,
        })
      }
    }, 400)

    return () => clearTimeout(timeout)
    // we dont need to update on user?.address change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedAddress])

  const resolvedHeaderText = eligibleUser
    ? `Address ${eligibleUser.ens ? eligibleUser.ens : formatAddress(eligibleUser.userAddress).toLowerCase()} is eligible for `
    : inputValue.length > 0
      ? 'Given address is not eligible for '
      : user?.address
        ? `Address ${formatAddress(user.address).toLowerCase()} is not eligible for  `
        : 'Claim your '

  const resolvedButtonText = !user
    ? 'Connect Wallet'
    : eligibleUser
      ? 'Claim $SUMR'
      : 'View your address'

  const isButtonDisabled =
    isLoading ||
    inputError.length > 0 ||
    (!eligibleUser && inputValue.length > 0 && !isAddress(inputValue) && !!user)

  const sumrToClaim = isAggregatedRewardsLoading ? (
    <SkeletonLine width="100px" height="35px" />
  ) : claimableAggregatedRewards?.total ? (
    // eslint-disable-next-line no-mixed-operators
    formatCryptoBalance(Number(claimableAggregatedRewards.total) / 10 ** 18)
  ) : (
    ''
  )

  return (
    <div className={classNames.sumrClaimSearchWrapper} id="claim">
      <Text as="h1" variant="h1" className={classNames.headerTextual}>
        {resolvedHeaderText}
        <Text as="span" variant="h1" className={classNames.headerTextualColored}>
          {eligibleUser ? sumrToClaim : null} $SUMR
        </Text>
      </Text>
      <Text as="p" variant="p1" className={classNames.headerDescription}>
        The token that powers DeFi’s best yield optimizer
      </Text>
      <div className={classNames.actionableWrapper}>
        <Input
          variant="withBorder"
          placeholder="Search wallet address or ENS"
          icon={{
            name: 'search_icon',
            size: 20,
            style: { color: 'var(--earn-protocol-secondary-100)' },
          }}
          onChange={handleSearch}
          value={inputValue}
        />
        <Card
          className={
            (eligibleUsers?.length ?? 0) > 1 && inputValue.length > 1
              ? classNames.autoComplete
              : classNames.autoCompleteHidden
          }
          variant="cardPrimarySmallPaddings"
          style={{ borderRadius: 'var(--general-radius-16)' }}
        >
          <ul>
            {eligibleUsers?.slice(0, 4).map((item) => (
              <li
                key={item.userAddress}
                onClick={() => {
                  setIsLoading(true)
                  setInputError('')
                  setInputValue(item.ens ?? item.userAddress)
                }}
              >
                {item.ens ?? item.userAddress}
              </li>
            ))}
          </ul>
          {eligibleUsers && eligibleUsers.length > 4 && (
            <Text
              as="p"
              variant="p3"
              style={{ color: 'var(--earn-protocol-neutral-40)', textAlign: 'center' }}
            >
              ...
            </Text>
          )}
        </Card>
        {inputError.length > 0 && (
          <Text variant="p3" style={{ color: 'var(--earn-protocol-critical-100)' }}>
            {inputError}
          </Text>
        )}
        <Link
          href={
            !user || !resolvedPortfolioUserAddress
              ? '/sumr'
              : `/portfolio/${resolvedPortfolioUserAddress}?tab=${PortfolioTabs.REWARDS}`
          }
          prefetch
        >
          <Button
            variant="primaryLarge"
            style={{ minWidth: 'unset', width: '100%' }}
            onClick={handleButtonClick}
            disabled={isButtonDisabled}
          >
            {isLoading ? <LoadingSpinner size={28} /> : resolvedButtonText}
          </Button>
        </Link>
      </div>

      <GradientBox
        selected
        className={`${classNames.gradientBox} ${isBoxVisible ? classNames.gradientBoxOpened : ''}`}
        style={{
          position: isBoxVisible ? 'relative' : 'absolute',
        }}
      >
        <Card variant="cardGradientLight" style={{ flexDirection: 'column' }}>
          <Text variant="p2semiColorful" style={{ marginBottom: 'var(--general-space-8)' }}>
            Get notified when The Lazy Summer protocol launches
          </Text>
          <Text variant="p3" style={{ marginBottom: 'var(--general-space-16)' }}>
            The best way to earn $SUMR is by depositing into the protocol when its live.
          </Text>
          <NewsletterWrapper inputWrapperStyles={{ maxWidth: '366px' }} isEarnApp />
        </Card>
      </GradientBox>
    </div>
  )
}
