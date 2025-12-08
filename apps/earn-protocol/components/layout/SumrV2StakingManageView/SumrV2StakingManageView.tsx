'use client'

import { type ChangeEvent, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import {
  AnimateHeight,
  Button,
  Card,
  CheckboxButton,
  DataBlock,
  ERROR_TOAST_CONFIG,
  Expander,
  Icon,
  Input,
  InputWithDropdown,
  OrderInformation,
  SDKChainIdToAAChainMap,
  SkeletonLine,
  SUCCESS_TOAST_CONFIG,
  Text,
  Tooltip,
  useAmount,
  useClientChainId,
  useUserWallet,
  WithArrow,
  YieldSourceLabel,
} from '@summerfi/app-earn-ui'
import { UiTransactionStatuses } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalToBigInt } from '@summerfi/app-utils'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import { type AddressValue, ChainIds } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { debounce } from 'lodash-es'
import Link from 'next/link'

import { LockupRangeGraph } from '@/components/molecules/LockupRangeGraph/LockupRangeGraph'
import { LockupRangeInput } from '@/components/molecules/LockupRangeInput/LockupRangeInput'
import WalletLabel from '@/components/molecules/WalletLabel/WalletLabel'
import { sdkApiUrl } from '@/constants/sdk'
import { QuickActionTags } from '@/features/bridge/components/QuickActionTags/QuickActionTags'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import { useStakeSumrTransactionV2 } from '@/features/claim-and-delegate/hooks/use-stake-sumr-transaction-v2'
import { useSumrNetApyConfig } from '@/features/nav-config/hooks/useSumrNetApyConfig'
import { getAvailabilityLabel } from '@/helpers/stakingv2-availability-label'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useHandleInputChangeEvent } from '@/hooks/use-mixpanel-event'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useToken } from '@/hooks/use-token'
import { useTokenBalance } from '@/hooks/use-token-balance'

import sumrV2StakingManageViewStyles from './SumrV2StakingManageView.module.css'

export type LockBucketAvailabilityMap = {
  0: number
  1: number
  2: number
  3: number
  4: number
  5: number
  6: number
}

const mapLockBucketToAvailability = (
  lockBucketAvailabilityMap: LockBucketAvailabilityMap | null,
  days: number,
) => {
  if (!lockBucketAvailabilityMap) {
    return 0
  }

  if (days === 0) {
    return lockBucketAvailabilityMap[0]
  }
  if (days < 14) {
    return lockBucketAvailabilityMap[1]
  }
  if (days < 90) {
    return lockBucketAvailabilityMap[2]
  }
  if (days < 180) {
    return lockBucketAvailabilityMap[3]
  }
  if (days < 365) {
    return lockBucketAvailabilityMap[4]
  }
  if (days < 730) {
    return lockBucketAvailabilityMap[5]
  }

  return lockBucketAvailabilityMap[6]
}

const mapLockBucketToRange = (days: number) => {
  if (days === 0) {
    return 'No lockup'
  }
  if (days < 14) {
    return 'Up to 14 days'
  }
  if (days < 90) {
    return '14 days - 3m'
  }
  if (days < 180) {
    return '3m - 6m'
  }
  if (days < 365) {
    return '6m - 1y'
  }
  if (days < 730) {
    return '1y - 2y'
  }

  return '2y - 3y'
}

const mapLockBucketToBucketIndex = (days: number) => {
  if (days === 0) {
    return -1
  }
  if (days < 14) {
    return -1
  }
  if (days < 90) {
    return 0
  }
  if (days < 180) {
    return 1
  }
  if (days < 365) {
    return 2
  }
  if (days < 730) {
    return 3
  }

  return 4
}

const availabilityColorMap: { [key in 'low' | 'medium' | 'high']: string } = {
  low: 'var(--color-text-critical)',
  medium: 'var(--color-background-warning-bold)',
  high: 'var(--earn-protocol-success-100)',
}

const mapBucketsInfoToAvailabilityMap = (
  bucketsInfo: { bucket: number; cap: bigint; totalStaked: bigint }[],
): LockBucketAvailabilityMap => {
  // Map bucket indexes to lockBucketAvailabilityMap keys
  const bucketIndexToMapKey: {
    [key: number]: keyof LockBucketAvailabilityMap
  } = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
  }

  const availabilityMap: LockBucketAvailabilityMap = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  }

  // Populate the map with bucket caps
  bucketsInfo.forEach((bucketInfo: { bucket: number; cap: bigint; totalStaked: bigint }) => {
    const bucketIndex = bucketInfo.bucket
    const mapKey = bucketIndexToMapKey[bucketIndex]

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (mapKey !== undefined) {
      // Convert BigInt cap to number (assuming it's in token units)
      availabilityMap[mapKey] = new BigNumber(bucketInfo.cap.toString())
        .minus(bucketInfo.totalStaked.toString())
        .shiftedBy(-SUMR_DECIMALS)
        .toNumber()
    }
  })

  return availabilityMap
}

const StepNumber = ({ number }: { number: number }) => {
  return (
    <div className={sumrV2StakingManageViewStyles.stepNumberWrapper}>
      <Text variant="p4semi">{number}</Text>
    </div>
  )
}

const SumrV2StakingManageComponent = ({
  onStake,
  isLoading = false,
  approveStatus,
  needsApproval,
  prepareTxs,
  isSettingChain = false,
}: {
  onStake: (params: {
    amount: BigNumber
    lockupDuration: number
    usdcYieldBoost?: number
    usdcBlendedYieldBoostFrom?: number
    usdcBlendedYieldBoostTo?: number
    percentageOfSumrLocked?: string
    userStakesCountBefore?: string
    userStakesCountAfter?: string
  }) => void
  isLoading?: boolean
  approveStatus: UiTransactionStatuses | null
  needsApproval: boolean
  prepareTxs: (
    amount: bigint,
    lockupPeriod: bigint,
  ) => Promise<{ approve?: () => Promise<unknown>; stake: () => Promise<unknown> } | null>
  isSettingChain?: boolean
}) => {
  const inputChangeHandler = useHandleInputChangeEvent()
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null)
  const [warningAccepted, setWarningAccepted] = useState(false)
  const [selectedLockupAndBoost, setSelectedLockupAndBoost] = useState<number>(0)

  const [lockBucketAvailabilityMap, setLockBucketAvailabilityMap] =
    useState<LockBucketAvailabilityMap | null>(null)
  const [sdkDataOnMountLoading, setSdkDataOnMountLoading] = useState(true)
  const [totalSumrStaked, setTotalSumrStaked] = useState<string>('0')
  const [protocolRevenue, setProtocolRevenue] = useState<string>('0')
  const [revenueShare, setRevenueShare] = useState<number>(0)
  const [maxApy, setMaxApy] = useState<string>('0')
  const [circulatingSupply, setCirculatingSupply] = useState<string>('0')
  const [percentageStaked, setPercentageStaked] = useState<string>('0')
  const [averageLockDuration, setAverageLockDuration] = useState<string>('0')
  const [simulationLoading, setSimulationLoading] = useState(false)
  const [simulationData, setSimulationData] = useState<{
    usdcYieldApy: string
    sumrRewardApy: string
    usdcYieldBoost: number
    usdcBlendedYieldBoostFrom: number
    usdcBlendedYieldBoostTo: number
    usdcYieldUsdPerYear: BigNumber
    sumrRewardAmount: BigNumber
    userStakesCountBefore: string
    userStakesCountAfter: string
  } | null>(null)
  const [stakingContractAddress, setStakingContractAddress] = useState<string>('')

  // Calculate price from fully diluted valuation
  const [sumrNetApyConfig] = useSumrNetApyConfig()

  const sumrPriceUsd = useMemo(
    () => new BigNumber(sumrNetApyConfig.dilutedValuation, 10).dividedBy(1_000_000_000).toNumber(),
    [sumrNetApyConfig.dilutedValuation],
  )

  const {
    getStakingBucketsInfoV2,
    getStakingTotalSumrStakedV2,
    getProtocolRevenue,
    getStakingRevenueShareV2,
    getStakingRewardRatesV2,
    getStakingSimulationDataV2,
    getSummerToken,
    getStakingConfigV2,
    getStakingStatsV2,
  } = useAppSDK()

  const [debouncedSelectedLockupAndBoost, setDebouncedSelectedLockupAndBoost] =
    useState<number>(selectedLockupAndBoost)
  const debouncedSetLockupAndBoost = useMemo(
    () =>
      debounce((a: number) => {
        setDebouncedSelectedLockupAndBoost(a)
      }, 300),
    [],
  )

  useEffect(() => {
    debouncedSetLockupAndBoost(selectedLockupAndBoost)

    return () => {
      debouncedSetLockupAndBoost.cancel()
    }
  }, [selectedLockupAndBoost, debouncedSetLockupAndBoost])

  // Fetch staking buckets info and other staking data on mount
  useEffect(() => {
    const fetchStakingData = async () => {
      try {
        setSdkDataOnMountLoading(true)

        // Fetch all data in parallel for better performance
        const [
          bucketsInfo,
          totalStaked,
          revenue,
          revenueShareData,
          rewardRates,
          stakingConfig,
          stakingStats,
        ] = await Promise.all([
          getStakingBucketsInfoV2(),
          getStakingTotalSumrStakedV2(),
          getProtocolRevenue(),
          getStakingRevenueShareV2(),
          getStakingRewardRatesV2({
            sumrPriceUsd,
          }),
          getStakingConfigV2(),
          getStakingStatsV2(),
        ])

        // Process and set all the data
        const availabilityMap = mapBucketsInfoToAvailabilityMap(bucketsInfo)

        setLockBucketAvailabilityMap(availabilityMap)
        setStakingContractAddress(stakingConfig.stakingContractAddress)
        const totalStakedFormatted = new BigNumber(totalStaked.toString())
          .shiftedBy(-18)
          .dividedBy(1000000)
          .toFormat(2, BigNumber.ROUND_DOWN)

        setTotalSumrStaked(totalStakedFormatted)

        const revenueFormatted = new BigNumber(revenue)
          .dividedBy(1000000)
          .toFormat(2, BigNumber.ROUND_DOWN)

        setProtocolRevenue(revenueFormatted)

        setRevenueShare(revenueShareData.percentage.value)

        setMaxApy(new BigNumber(rewardRates.maxApy.value).toFormat(2, BigNumber.ROUND_DOWN))

        // Process staking stats
        const circulatingSupplyFormatted = new BigNumber(stakingStats.circulatingSupply)
          .dividedBy(1000000)
          .toFormat(2, BigNumber.ROUND_DOWN)

        setCirculatingSupply(circulatingSupplyFormatted)

        // Calculate percentage of circulating SUMR staked
        const percentStaked =
          parseFloat(stakingStats.circulatingSupply) === 0
            ? '0.00'
            : new BigNumber(stakingStats.summerStakedNormalized)
                .dividedBy(stakingStats.circulatingSupply)
                .times(100)
                .toFormat(2, BigNumber.ROUND_DOWN)

        setPercentageStaked(percentStaked)

        // Format average lock duration from seconds to days
        if (stakingStats.averageLockupPeriod) {
          const averageDays = new BigNumber(stakingStats.averageLockupPeriod.toString())
            .dividedBy(86400) // Convert seconds to days
            .toFormat(0, BigNumber.ROUND_DOWN)

          setAverageLockDuration(averageDays)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch staking data:', error)
      } finally {
        setSdkDataOnMountLoading(false)
      }
    }

    void fetchStakingData()
  }, [
    getStakingBucketsInfoV2,
    getStakingTotalSumrStakedV2,
    getProtocolRevenue,
    getStakingRevenueShareV2,
    getStakingRewardRatesV2,
    getSummerToken,
    getStakingConfigV2,
    getStakingStatsV2,
    sumrPriceUsd,
  ])

  const { token: sumrToken } = useToken({
    tokenSymbol: 'SUMMER',
    chainId: ChainIds.Base,
  })

  const { isLoadingAccount, userWalletAddress } = useUserWallet()

  const { publicClient } = useNetworkAlignedClient({
    overrideNetwork: 'Base',
  })

  const { tokenBalance: sumrBalanceOnSourceChain, tokenBalanceLoading } = useTokenBalance({
    chainId: ChainIds.Base,
    publicClient,
    tokenSymbol: 'SUMMER',
    vaultTokenSymbol: 'SUMMER',
  })

  const {
    amountDisplay,
    amountParsed,
    amountDisplayUSD,
    manualSetAmount,
    handleAmountChange,
    onBlur: defaultOnBlur,
    onFocus: defaultOnFocus,
  } = useAmount({
    tokenDecimals: SUMR_DECIMALS,
    selectedToken: sumrToken,
    inputChangeHandler,
    inputName: 'sumr-staking-amount-input',
  })

  const handleAmountChangeWithPercentage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPercentage(null)
    handleAmountChange(e)
  }

  // Prepare transactions when amount or lockup duration changes
  useEffect(() => {
    const prepareTransactions = async () => {
      if (amountParsed.isZero() || amountParsed.isNaN()) {
        return
      }

      const amountBigInt = formatDecimalToBigInt(amountParsed.toString())
      const lockupPeriodSeconds = BigInt(debouncedSelectedLockupAndBoost * 24 * 60 * 60)

      await prepareTxs(amountBigInt, lockupPeriodSeconds)
    }

    void prepareTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountParsed, debouncedSelectedLockupAndBoost])

  // Fetch simulation data when amount or lockup duration changes
  useEffect(() => {
    const fetchSimulation = async () => {
      if (amountParsed.isZero() || amountParsed.isNaN() || !userWalletAddress) {
        setSimulationData(null)
        setSimulationLoading(false)

        return
      }

      try {
        setSimulationLoading(true)
        const amountBigInt = formatDecimalToBigInt(amountParsed.toString())
        const lockupPeriodSeconds = BigInt(debouncedSelectedLockupAndBoost * 24 * 60 * 60)

        const simulation = await getStakingSimulationDataV2({
          amount: amountBigInt,
          period: lockupPeriodSeconds,
          sumrPriceUsd,
          userAddress: userWalletAddress as AddressValue,
        })

        // Calculate USD per year for USDC yield
        const usdcYieldUsdPerYear = amountParsed
          .times(sumrPriceUsd)
          .times(simulation.usdcYieldApy.value)
          .dividedBy(100)

        // Calculate SUMR reward amount per year
        const sumrRewardAmount = amountParsed.times(simulation.sumrRewardApy.value).dividedBy(100)

        setSimulationData({
          usdcYieldApy: new BigNumber(simulation.usdcYieldApy.value).toFormat(
            2,
            BigNumber.ROUND_DOWN,
          ),
          sumrRewardApy: new BigNumber(simulation.sumrRewardApy.value).toFormat(
            2,
            BigNumber.ROUND_DOWN,
          ),
          usdcYieldBoost: simulation.usdcYieldBoost,
          usdcBlendedYieldBoostFrom: simulation.usdcBlendedYieldBoostFrom,
          usdcBlendedYieldBoostTo: simulation.usdcBlendedYieldBoostTo,
          usdcYieldUsdPerYear,
          sumrRewardAmount,
          userStakesCountBefore: simulation.userStakesCountBefore.toString(),
          userStakesCountAfter: simulation.userStakesCountAfter.toString(),
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch simulation data:', error)
        setSimulationData(null)
      } finally {
        setSimulationLoading(false)
      }
    }

    void fetchSimulation()
  }, [
    amountParsed,
    debouncedSelectedLockupAndBoost,
    userWalletAddress,
    sumrToken,
    getStakingSimulationDataV2,
    sumrPriceUsd,
  ])

  const lockupExpirationDate = useMemo(() => {
    if (debouncedSelectedLockupAndBoost === 0) {
      return 'N/A'
    }

    return dayjs().add(debouncedSelectedLockupAndBoost, 'day').format('MMM D, YYYY')
  }, [debouncedSelectedLockupAndBoost])

  const lockTimePeriodSummaryLabel = useMemo(() => {
    if (debouncedSelectedLockupAndBoost === 0) {
      return 'No lockup'
    }

    return `${debouncedSelectedLockupAndBoost} days (${lockupExpirationDate})`
  }, [debouncedSelectedLockupAndBoost, lockupExpirationDate])

  const percentageOfSumrBeingLocked = useMemo(() => {
    if (!sumrBalanceOnSourceChain || amountParsed.isZero()) {
      return '0%'
    }

    const percentage = amountParsed.dividedBy(sumrBalanceOnSourceChain).times(100)

    return `${percentage.toFixed(0)}%`
  }, [amountParsed, sumrBalanceOnSourceChain])

  const enoughBucketAvailability = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!amountParsed || !lockBucketAvailabilityMap) {
      return false
    }

    return (
      mapLockBucketToAvailability(lockBucketAvailabilityMap, debouncedSelectedLockupAndBoost) >=
      amountParsed.toNumber()
    )
  }, [amountParsed, debouncedSelectedLockupAndBoost, lockBucketAvailabilityMap])

  const isButtonDisabled = useMemo(() => {
    if (!amountDisplay || amountParsed.isZero()) {
      return true
    }

    if (sumrBalanceOnSourceChain && amountParsed.isGreaterThan(sumrBalanceOnSourceChain)) {
      return true
    }

    if (debouncedSelectedLockupAndBoost > 0 && !warningAccepted) {
      return true
    }

    if (!enoughBucketAvailability) {
      return true
    }

    if (sdkDataOnMountLoading) {
      return true
    }

    if (isLoading || isSettingChain) {
      return true
    }

    return false
  }, [
    amountDisplay,
    amountParsed,
    enoughBucketAvailability,
    sumrBalanceOnSourceChain,
    warningAccepted,
    sdkDataOnMountLoading,
    isLoading,
    isSettingChain,
    debouncedSelectedLockupAndBoost,
  ])

  const getButtonLabel = () => {
    if (isSettingChain) {
      return 'Switching to Base...'
    }
    if (approveStatus === UiTransactionStatuses.PENDING) {
      return needsApproval ? 'Approving...' : 'Staking...'
    }
    if (approveStatus !== UiTransactionStatuses.COMPLETED && needsApproval) {
      return 'Approve SUMR'
    }

    return 'Confirm Stake & Lock'
  }

  const onConfirmStake = () => {
    onStake({
      amount: amountParsed,
      lockupDuration: debouncedSelectedLockupAndBoost,
      usdcYieldBoost: simulationData?.usdcYieldBoost,
      usdcBlendedYieldBoostFrom: simulationData?.usdcBlendedYieldBoostFrom,
      usdcBlendedYieldBoostTo: simulationData?.usdcBlendedYieldBoostTo,
      percentageOfSumrLocked: percentageOfSumrBeingLocked,
      userStakesCountBefore: simulationData?.userStakesCountBefore,
      userStakesCountAfter: simulationData?.userStakesCountAfter,
    })
  }

  const bucketAvailability = mapLockBucketToAvailability(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    lockBucketAvailabilityMap,
    debouncedSelectedLockupAndBoost,
  )

  const handleManualLockupChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const parsedValue = parseInt(inputValue, 10)

    if (inputValue === '') {
      setSelectedLockupAndBoost(0)

      return
    }

    if (parsedValue > 1080) {
      setSelectedLockupAndBoost(1080)
    } else if (parsedValue < 0) {
      setSelectedLockupAndBoost(0)
    } else {
      setSelectedLockupAndBoost(parsedValue)
    }
  }

  return (
    <div className={sumrV2StakingManageViewStyles.wrapper}>
      <div className={sumrV2StakingManageViewStyles.title}>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault()
            // Handle back navigation
            window.history.back()
          }}
        >
          <Icon iconName="arrow_backward" size={32} />
        </Link>
        <Text variant="h3">Stake SUMR to earn rewards</Text>
      </div>
      <Card className={sumrV2StakingManageViewStyles.cardGrid} variant="cardSecondary">
        <div className={sumrV2StakingManageViewStyles.cardLeftColumn}>
          <div className={sumrV2StakingManageViewStyles.cardLeftColumnTitle}>
            <Text variant="p2semi">Stake SUMR to earn USDC and SUMR</Text>
            <Text as="p" variant="p3">
              Share in the success of the Lazy Summer Protocol.
              <br />
              Earn real yield in USDC from a share of the revenue that the protocol makes, while
              getting governance rights and continued SUMR rewards.
            </Text>
            <WithArrow>
              <Link href="Huh?">Learn more about SUMR and staking</Link>
            </WithArrow>
          </div>
          <Expander
            title={
              <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                <Icon iconName="info" size={20} />
                <Text variant="p2semi">SUMR Key staking info</Text>
              </div>
            }
            defaultExpanded
            expanderButtonClassName={sumrV2StakingManageViewStyles.expanderTitleButton}
          >
            <Card className={sumrV2StakingManageViewStyles.sumrKeyStakingInfoCard}>
              <OrderInformation
                wrapperStyles={{
                  padding: '0px',
                }}
                items={[
                  {
                    label: 'Total SUMR Staked ',
                    value: (
                      <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                        <Icon iconName="sumr" size={16} />
                        {sdkDataOnMountLoading ? (
                          <SkeletonLine width={60} height={16} />
                        ) : (
                          <Text variant="p3semi">{`${totalSumrStaked}m`}</Text>
                        )}
                      </div>
                    ),
                  },
                  {
                    label: '% of circulating SUMR Staked',
                    value: sdkDataOnMountLoading ? (
                      <SkeletonLine width={60} height={16} />
                    ) : (
                      `${percentageStaked}%`
                    ),
                  },
                  {
                    label: 'Total circulating SUMR supply',
                    value: (
                      <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                        <Icon iconName="sumr" size={16} />
                        {sdkDataOnMountLoading ? (
                          <SkeletonLine width={60} height={16} />
                        ) : (
                          <Text variant="p3semi">{`${circulatingSupply}m`}</Text>
                        )}
                      </div>
                    ),
                  },
                  {
                    label: 'Average SUMR lock duration',
                    value: sdkDataOnMountLoading ? (
                      <SkeletonLine width={60} height={16} />
                    ) : (
                      `${averageLockDuration} days`
                    ),
                  },
                ]}
              />
              <div className={sumrV2StakingManageViewStyles.orderInformationDivider} />
              <OrderInformation
                wrapperStyles={{
                  padding: '0px',
                }}
                items={[
                  {
                    label: 'Protocol Revenue',
                    value: sdkDataOnMountLoading ? (
                      <SkeletonLine width={80} height={16} />
                    ) : (
                      `$${protocolRevenue}m`
                    ),
                  },
                  {
                    label: 'Revenue Share',
                    value: (
                      <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                        {sdkDataOnMountLoading ? (
                          <SkeletonLine width={50} height={16} />
                        ) : (
                          <Text variant="p3semi">{`${revenueShare}%`}</Text>
                        )}
                        <Tooltip
                          tooltip="USDC yield is derived from Lazy Summer Protocol Revenue. Specifically a 20% of total protocol revenue."
                          tooltipWrapperStyles={{
                            minWidth: '220px',
                          }}
                        >
                          <Icon iconName="info" size={16} />
                        </Tooltip>
                      </div>
                    ),
                  },
                  {
                    label: 'USDC Yield APY',
                    value: sdkDataOnMountLoading ? (
                      <SkeletonLine width={70} height={16} />
                    ) : (
                      `up to ${maxApy}%`
                    ),
                  },
                ]}
              />
              <div className={sumrV2StakingManageViewStyles.orderInformationDivider} />
              <OrderInformation
                wrapperStyles={{
                  padding: '0px',
                }}
                items={[
                  {
                    label: 'Staking contract',
                    value: (
                      <WithArrow variant="p4semi" style={{ marginRight: '15px' }}>
                        <Link
                          href={`https://basescan.org/address/${stakingContractAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Go to basescan
                        </Link>
                      </WithArrow>
                    ),
                  },
                  {
                    label: 'Staking contract audit',
                    value: 'ADD LINK',
                  },
                ]}
              />
            </Card>
          </Expander>
          <Expander
            title={
              <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                <Icon iconName="light_bulb" size={20} />
                <Text variant="p2semi">Quick SUMR staking tips</Text>
              </div>
            }
            expanderButtonClassName={sumrV2StakingManageViewStyles.expanderTitleButton}
          >
            <Card className={sumrV2StakingManageViewStyles.sumrKeyStakingInfoCard}>
              <Text variant="p2semi">You can create multiple positions</Text>
              <Text variant="p3">
                You don’t need to fit everything into one lock. If capacity is limited or you want
                flexibility, split your SUMR across several positions.
              </Text>
              <Text variant="p2semi">Longer locks = higher rewards</Text>
              <Text variant="p3">
                Higher conviction? Choose a longer lock to earn more SUMR and boost your earnings
                over time.
              </Text>
              <Text variant="p2semi">Each lock duration has a cap</Text>
              <Text variant="p3">
                If one duration is at or near capacity, stake part of your SUMR in other available
                buckets.
              </Text>
              <Text variant="p2semi">Early exits are penalized</Text>
              <Text variant="p3">
                Only lock for as long as you’re truly comfortable, exiting early reduces the amount
                of SUMR you get back.
              </Text>
            </Card>
          </Expander>
          <Expander
            title={
              <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                <Icon iconName="question_o" size={20} />
                <Text variant="p2semi">FAQS</Text>
              </div>
            }
            expanderButtonClassName={sumrV2StakingManageViewStyles.expanderTitleButton}
          >
            <Card className={sumrV2StakingManageViewStyles.sumrKeyStakingInfoCard}>
              <Text variant="p2semi">How do I earn yield when I stake?</Text>
              <Text variant="p3">
                You earn <strong>dual rewards,</strong> ongoing <strong>SUMR emissions</strong> plus
                a <strong>share of protocol yield in USDC</strong>, paid as LV vault tokens that
                keep compounding.
              </Text>
              <Text variant="p2semi">Why staking instead of just holding SUMR?</Text>
              <Text variant="p3">
                Holding gives you only price exposure.{' '}
                <strong>
                  Staking adds governance power, boosted SUMR rewards, and a direct share of
                  protocol revenue
                </strong>{' '}
                on top.
              </Text>
              <Text variant="p2semi">How does SUMR earn value over time?</Text>
              <Text variant="p3">
                Lazy Summer charges fees on vault AUM. A portion of that{' '}
                <strong>protocol revenue flows to the treasury and stakers</strong>, so as TVL
                grows, the potential value to SUMR stakers can grow too (subject to governance).
              </Text>
              <Text variant="p2semi">Do I need to stake to use Lazy Summer?</Text>
              <Text variant="p3">
                No. Anyone can deposit into vaults without SUMR.{' '}
                <strong>Staking is optional</strong> and is for users who want governance influence
                and value capture from protocol growth.
              </Text>
              <Text variant="p2semi">What if I need to exit my lock early?</Text>
              <Text variant="p3">
                You can exit before your lock ends, but{' '}
                <strong>an early withdrawal penalty applies</strong>, decreasing as you get closer
                to the end of your lock.
              </Text>
            </Card>
          </Expander>
        </div>
        <div className={sumrV2StakingManageViewStyles.cardRightColumn}>
          <div className={sumrV2StakingManageViewStyles.cardRightColumnStepWrapper}>
            <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
              <StepNumber number={1} />
              <Text variant="p2semi">How much SUMR would you like to stake?</Text>
            </div>
            <Card>
              {!userWalletAddress ? (
                isLoadingAccount || sdkDataOnMountLoading ? (
                  <SkeletonLine width={200} height={50} />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                      gap: '8px',
                      padding: '20px 0',
                      width: '100%',
                    }}
                  >
                    <Text variant="p3semi">Connect your wallet to stake SUMR.</Text>
                    <WalletLabel />
                  </div>
                )
              ) : null}
              {userWalletAddress && (
                <InputWithDropdown
                  value={amountDisplay}
                  heading={{
                    label: 'Balance',
                    value: `${tokenBalanceLoading || !sumrBalanceOnSourceChain ? '-' : formatCryptoBalance(sumrBalanceOnSourceChain)} SUMR`,
                    action: () => {
                      if (sumrBalanceOnSourceChain) {
                        manualSetAmount(sumrBalanceOnSourceChain.toFixed())
                      }
                    },
                  }}
                  secondaryValue={amountDisplayUSD}
                  handleChange={handleAmountChangeWithPercentage}
                  handleDropdownChange={() => {}}
                  onBlur={defaultOnBlur}
                  onFocus={defaultOnFocus}
                  options={[{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }]}
                  dropdownValue={{ label: 'SUMR', value: 'SUMR', tokenSymbol: 'SUMR' }}
                  selectAllOnFocus
                  wrapperClassName={sumrV2StakingManageViewStyles.inputWrapper}
                />
              )}
            </Card>
            <QuickActionTags
              selectedValue={selectedPercentage}
              customOptions={[
                { label: '25%', value: 25 },
                { label: '50%', value: 50 },
                { label: '75%', value: 75 },
                { label: 'Max', value: 100 },
              ]}
              tagRowClassName={sumrV2StakingManageViewStyles.quickActionTags}
              onSelect={(percentage) => {
                setSelectedPercentage(percentage)
                const newAmount = sumrBalanceOnSourceChain
                  ? sumrBalanceOnSourceChain
                      .times(percentage)
                      .div(100)
                      .decimalPlaces(2, BigNumber.ROUND_DOWN)
                  : new BigNumber(0)

                manualSetAmount(newAmount.toFixed())
              }}
            />
          </div>
          <div className={sumrV2StakingManageViewStyles.cardRightColumnStepWrapper}>
            <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
              <StepNumber number={2} />
              <Text variant="p2semi">How do you want to lock up and boost your SUMR?</Text>
            </div>
            <div className={sumrV2StakingManageViewStyles.yieldSourcesCards}>
              <Card className={sumrV2StakingManageViewStyles.yieldSourcesCard}>
                <YieldSourceLabel
                  label={
                    <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                      <Text variant="p4semiColorful">Yield source 1</Text>
                      <Tooltip tooltip="Huh?">
                        <Icon iconName="info" size={16} color="#B049FF" />
                      </Tooltip>
                    </div>
                  }
                />
                <DataBlock
                  title={
                    <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                      <Icon iconName="usdc_circle_color" size={24} />
                      <Text variant="p4semi">
                        USDC Yield
                        {simulationData && simulationData.usdcYieldBoost > 1
                          ? ` (Boosted ${simulationData.usdcYieldBoost.toFixed(1)}x)`
                          : ''}
                      </Text>
                    </div>
                  }
                  value={
                    simulationLoading ? (
                      <SkeletonLine width={160} height={28} style={{ marginBottom: '0' }} />
                    ) : simulationData ? (
                      `${simulationData.usdcYieldApy}%`
                    ) : (
                      '-'
                    )
                  }
                  subValue={
                    simulationLoading ? (
                      <SkeletonLine width={120} height={20} style={{ marginBottom: '0' }} />
                    ) : simulationData ? (
                      `$${formatCryptoBalance(simulationData.usdcYieldUsdPerYear)} a year`
                    ) : (
                      '-'
                    )
                  }
                  subValueType="positive"
                  wrapperClassName={sumrV2StakingManageViewStyles.yieldDataBlock}
                />
              </Card>
              <Card className={sumrV2StakingManageViewStyles.yieldSourcesCard}>
                <YieldSourceLabel
                  label={
                    <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                      <Text variant="p4semiColorful">Yield source 2</Text>
                      <Tooltip tooltip="Huh?">
                        <Icon iconName="info" size={16} color="#B049FF" />
                      </Tooltip>
                    </div>
                  }
                />
                <DataBlock
                  title={
                    <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                      <Icon iconName="sumr" size={20} />
                      <Text variant="p4semi">SUMR Reward APY</Text>
                    </div>
                  }
                  value={
                    simulationLoading ? (
                      <SkeletonLine width={160} height={28} style={{ marginBottom: '0' }} />
                    ) : simulationData ? (
                      `${simulationData.sumrRewardApy}%`
                    ) : (
                      '-'
                    )
                  }
                  subValue={
                    simulationLoading ? (
                      <SkeletonLine width={120} height={20} style={{ marginBottom: '0' }} />
                    ) : simulationData ? (
                      `+${formatCryptoBalance(simulationData.sumrRewardAmount)} SUMR`
                    ) : (
                      '-'
                    )
                  }
                  subValueType="positive"
                  wrapperClassName={sumrV2StakingManageViewStyles.yieldDataBlock}
                />
              </Card>
            </div>
            <Card className={sumrV2StakingManageViewStyles.stakingLengthControllers}>
              <Text
                variant="p3semi"
                style={{
                  textAlign: 'center',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Lockup and boost yield
              </Text>
              <div className={sumrV2StakingManageViewStyles.stakingLengthLabels}>
                <Text
                  variant="p3semi"
                  className={sumrV2StakingManageViewStyles.stakingLengthLabelsBottom}
                >
                  1x
                </Text>
                <Text
                  variant="p3semi"
                  className={clsx(
                    sumrV2StakingManageViewStyles.stakingLengthLabelsBottom,
                    sumrV2StakingManageViewStyles.stakingLockupManualInputWrapper,
                  )}
                  style={{
                    paddingLeft: selectedLockupAndBoost === 0 ? '8px' : '0',
                  }}
                >
                  <Input
                    variant="dark"
                    value={selectedLockupAndBoost}
                    className={sumrV2StakingManageViewStyles.stakingLockupManualInput}
                    type="number"
                    onChange={handleManualLockupChange}
                    wrapperStyles={{
                      display: selectedLockupAndBoost === 0 ? 'none' : 'inline-block',
                    }}
                  />
                  {selectedLockupAndBoost === 0 ? 'No lockup' : 'days'}
                </Text>
                <Text
                  variant="p3semi"
                  className={sumrV2StakingManageViewStyles.stakingLengthLabelsBottom}
                  style={{ textAlign: 'right' }}
                >
                  7.2x Boost
                </Text>
              </div>
              <LockupRangeInput
                value={selectedLockupAndBoost}
                onChange={setSelectedLockupAndBoost}
              />
              <div className={sumrV2StakingManageViewStyles.stakingLengthLabels}>
                <Text variant="p3semi">Years</Text>
                <Text variant="p3semi" style={{ marginLeft: '-27px' }}>
                  1
                </Text>
                <Text variant="p3semi">2</Text>
                <Text variant="p3semi">3</Text>
              </div>
              <LockupRangeGraph
                lockupMap={
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  lockBucketAvailabilityMap
                    ? {
                        90: getAvailabilityLabel(lockBucketAvailabilityMap[2], amountParsed), // 14 days - 3m
                        180: getAvailabilityLabel(lockBucketAvailabilityMap[3], amountParsed), // 3m - 6m
                        360: getAvailabilityLabel(lockBucketAvailabilityMap[4], amountParsed), // 6m - 1y
                        720: getAvailabilityLabel(lockBucketAvailabilityMap[5], amountParsed), // 1y - 2y
                        1080: getAvailabilityLabel(lockBucketAvailabilityMap[6], amountParsed), // 2y - 3y
                      }
                    : {
                        90: 'high',
                        180: 'high',
                        360: 'high',
                        720: 'high',
                        1080: 'high',
                      }
                }
                selectedBucketIndex={mapLockBucketToBucketIndex(debouncedSelectedLockupAndBoost)}
                onLockupClick={(days: number) => {
                  setSelectedLockupAndBoost(days)
                }}
              />
              <Expander
                expanderButtonStyles={{
                  marginTop: '18px',
                  justifyContent: 'center',
                }}
                title={
                  <Text
                    variant="p4semi"
                    style={{
                      color: !enoughBucketAvailability
                        ? 'var(--color-text-critical)'
                        : 'var(--color-text-primary)',
                    }}
                  >
                    Availability details
                  </Text>
                }
                defaultExpanded={!enoughBucketAvailability}
              >
                <Card className={sumrV2StakingManageViewStyles.youSelectedCard}>
                  <Text variant="p4semi">You selected</Text>
                  <OrderInformation
                    wrapperStyles={{
                      padding: '0px',
                      backgroundColor: 'transparent',
                    }}
                    items={[
                      {
                        label: 'Bucket',
                        value: 'Available',
                      },
                      debouncedSelectedLockupAndBoost >= 0
                        ? {
                            label: (
                              <span
                                style={{
                                  color:
                                    availabilityColorMap[
                                      getAvailabilityLabel(bucketAvailability, amountParsed)
                                    ],
                                }}
                              >
                                {mapLockBucketToRange(debouncedSelectedLockupAndBoost)}
                              </span>
                            ),
                            value: (
                              <span
                                style={{
                                  color:
                                    availabilityColorMap[
                                      getAvailabilityLabel(bucketAvailability, amountParsed)
                                    ],
                                  cursor: bucketAvailability > 0 ? 'pointer' : 'default',
                                }}
                                onClick={() => {
                                  if (bucketAvailability > 0) {
                                    manualSetAmount(
                                      Math.min(
                                        sumrBalanceOnSourceChain?.toNumber() ?? 0,
                                        bucketAvailability,
                                      ).toFixed(),
                                    )
                                  }
                                }}
                              >
                                {bucketAvailability.toLocaleString()} SUMR
                              </span>
                            ),
                          }
                        : {
                            label: 'No lockup',
                            value: 'N/A',
                          },
                    ]}
                  />
                  <AnimateHeight
                    id="bucket-availability-warning-message"
                    show={!enoughBucketAvailability}
                  >
                    <Card variant="cardWarning" style={{ padding: '16px 16px 24px 16px' }}>
                      <div className={sumrV2StakingManageViewStyles.warningWrapper}>
                        <Icon
                          iconName="warning"
                          size={20}
                          color="var(--color-text-warning)"
                          style={{ marginTop: '3px' }}
                        />
                        <div className={sumrV2StakingManageViewStyles.warningContent}>
                          <Text variant="p3">
                            Not enough SUMR in this bucket for your deposit. You’ll need to deposit
                            no more than{' '}
                            {formatCryptoBalance(
                              mapLockBucketToAvailability(
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                lockBucketAvailabilityMap,
                                debouncedSelectedLockupAndBoost,
                              ),
                            )}{' '}
                            SUMR. Stake the remainder in a different lock bucket.
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </AnimateHeight>
                </Card>
              </Expander>
            </Card>
            <Card className={sumrV2StakingManageViewStyles.orderSummary}>
              <Text variant="p3semi" className={sumrV2StakingManageViewStyles.orderSummaryHeader}>
                Summary of changes
              </Text>
              <OrderInformation
                wrapperStyles={{
                  padding: '0px',
                }}
                items={[
                  {
                    label: 'SUMR Being Locked',
                    value: (
                      <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                        <Icon iconName="sumr" size={16} />
                        <Text variant="p3semi">
                          {formatCryptoBalance(amountParsed) || '0'} SUMR
                        </Text>
                      </div>
                    ),
                  },
                  {
                    label: 'Lock time period',
                    value: lockTimePeriodSummaryLabel,
                  },
                  {
                    label: 'Yield boost multiplier',
                    value: simulationLoading ? (
                      <SkeletonLine width={50} height={16} />
                    ) : simulationData ? (
                      `${simulationData.usdcYieldBoost.toFixed(2)}x`
                    ) : (
                      '-'
                    ),
                  },
                  {
                    label: 'Blended yield boost multiplier',
                    value: simulationLoading ? (
                      <SkeletonLine width={90} height={16} />
                    ) : simulationData ? (
                      `${simulationData.usdcBlendedYieldBoostFrom.toFixed(1)}x → ${simulationData.usdcBlendedYieldBoostTo.toFixed(1)}x`
                    ) : (
                      '-'
                    ),
                  },
                  {
                    label: 'SUMR lock positions ',
                    value: simulationLoading ? (
                      <SkeletonLine width={90} height={16} />
                    ) : simulationData ? (
                      `${simulationData.userStakesCountBefore} → ${simulationData.userStakesCountAfter} (+${Number(simulationData.userStakesCountAfter) - Number(simulationData.userStakesCountBefore)})`
                    ) : (
                      '-'
                    ),
                  },
                  {
                    label: '% of available SUMR being locked ',
                    value: `0% → ${percentageOfSumrBeingLocked}`,
                  },
                  {
                    label: (
                      <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                        <Text variant="p3semi" style={{ color: 'var(--color-text-warning)' }}>
                          Initial early withdrawal penalty
                        </Text>
                        <Tooltip tooltip="Huh?">
                          <Icon iconName="info" size={16} color="var(--color-text-warning)" />
                        </Tooltip>
                      </div>
                    ),
                    value: (
                      <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                        <Text variant="p3semi" style={{ color: 'var(--color-text-warning)' }}>
                          11.2%
                        </Text>
                      </div>
                    ), // Huh?
                  },
                ]}
              />
            </Card>
            <AnimateHeight id="warning-acceptance" show={debouncedSelectedLockupAndBoost > 0}>
              <Card variant="cardWarning" style={{ padding: '16px 16px 24px 16px' }}>
                <div className={sumrV2StakingManageViewStyles.warningWrapper}>
                  <Icon
                    iconName="warning"
                    size={20}
                    color="var(--color-text-warning)"
                    style={{ marginTop: '3px' }}
                  />
                  <div className={sumrV2StakingManageViewStyles.warningContent}>
                    <Text variant="p3">
                      Warning: There is an early withdrawal penalty if you unstake your SUMR before
                      the lockup has expired. At your current lockup, this starts at 11.2% of the
                      amount you withdraw and reduces to 2% as you get closer to{' '}
                      {lockupExpirationDate}.
                    </Text>
                    <CheckboxButton
                      name="warning-acceptance-checkbox"
                      checked={warningAccepted}
                      onChange={() => {
                        setWarningAccepted((prev) => !prev)
                      }}
                      iconColor="var(--color-text-warning)"
                      label="I understand the mechanics of the early withdrawal penalty"
                      labelStyles={{
                        paddingLeft: '40px',
                      }}
                    />
                  </div>
                </div>
              </Card>
            </AnimateHeight>
            <Button
              disabled={isButtonDisabled}
              variant="primaryLarge"
              style={{ alignSelf: 'flex-end', minWidth: 'auto' }}
              onClick={onConfirmStake}
            >
              {getButtonLabel()}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

const SumrV2StakingSuccessComponent = ({
  txData,
}: {
  txData: {
    amount: BigNumber
    lockupDuration: number
    usdcYieldBoost?: number
    usdcBlendedYieldBoostFrom?: number
    usdcBlendedYieldBoostTo?: number
    percentageOfSumrLocked?: string
    userStakesCountBefore?: string
    userStakesCountAfter?: string
  }
}) => {
  const { isLoadingAccount, userWalletAddress } = useUserWallet()
  const { publicClient } = useNetworkAlignedClient({
    overrideNetwork: 'Base',
  })

  const { tokenBalance: sumrBalanceOnSourceChain, tokenBalanceLoading } = useTokenBalance({
    chainId: ChainIds.Base,
    publicClient,
    tokenSymbol: 'SUMMER',
    vaultTokenSymbol: 'SUMMER',
  })

  const isAllTokenStaked = useMemo(() => {
    if (!sumrBalanceOnSourceChain || isLoadingAccount) {
      return false
    }

    // safe-ish assumption
    return (
      txData.amount.isEqualTo(sumrBalanceOnSourceChain) || sumrBalanceOnSourceChain.isLessThan(0.1)
    )
  }, [txData, sumrBalanceOnSourceChain, isLoadingAccount])

  const lockupExpirationDate = useMemo(() => {
    if (txData.lockupDuration === 0) {
      return 'N/A'
    }

    return dayjs().add(txData.lockupDuration, 'day').format('MMM D, YYYY')
  }, [txData.lockupDuration])

  const lockTimePeriodSummaryLabel = useMemo(() => {
    if (txData.lockupDuration === 0) {
      return 'No lockup'
    }

    return `${txData.lockupDuration} days (${lockupExpirationDate})`
  }, [txData.lockupDuration, lockupExpirationDate])

  return (
    <div className={sumrV2StakingManageViewStyles.finalCardWrapper}>
      <div className={sumrV2StakingManageViewStyles.title}>
        {tokenBalanceLoading ? (
          <SkeletonLine width={32} height={32} />
        ) : (
          <Text variant="h3">
            {isAllTokenStaked
              ? 'All of your SUMR is staked and locked'
              : 'Some of your SUMR is staked and locked'}
          </Text>
        )}
      </div>
      <Card variant="cardSecondary" className={sumrV2StakingManageViewStyles.finalCard}>
        <div className={sumrV2StakingManageViewStyles.summaryWrapper}>
          <Text as="p" variant="p1semi">
            SUMR Staked
          </Text>
          <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
            <Icon iconName="sumr" size={38} />
            <Text as="p" variant="h2">
              {formatCryptoBalance(txData.amount)} SUMR
            </Text>
          </div>
          <Text as="p" variant="p1semi">
            $10,000.00
          </Text>
        </div>
        <Card className={sumrV2StakingManageViewStyles.orderSummary}>
          <Text variant="p3semi" className={sumrV2StakingManageViewStyles.orderSummaryHeader}>
            Summary of changes
          </Text>
          <OrderInformation
            wrapperStyles={{
              padding: '0px',
            }}
            items={[
              {
                label: 'SUMR Being Locked',
                value: (
                  <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                    <Icon iconName="sumr" size={16} />
                    <Text variant="p3semi">{formatCryptoBalance(txData.amount)} SUMR</Text>
                  </div>
                ),
              },
              {
                label: 'Lock time period',
                value: lockTimePeriodSummaryLabel,
              },
              {
                label: 'Yield boost multiplier',
                value: txData.usdcYieldBoost ? (
                  `${txData.usdcYieldBoost.toFixed(2)}x`
                ) : (
                  <SkeletonLine width={50} height={16} />
                ),
              },
              {
                label: 'Blended yield boost multiplier',
                value:
                  txData.usdcBlendedYieldBoostFrom !== undefined &&
                  txData.usdcBlendedYieldBoostTo !== undefined ? (
                    `${txData.usdcBlendedYieldBoostFrom.toFixed(1)}x → ${txData.usdcBlendedYieldBoostTo.toFixed(1)}x`
                  ) : (
                    <SkeletonLine width={90} height={16} />
                  ),
              },
              {
                label: 'SUMR lock positions ',
                value:
                  txData.userStakesCountBefore !== undefined &&
                  txData.userStakesCountAfter !== undefined
                    ? `${txData.userStakesCountBefore} → ${txData.userStakesCountAfter} (+${Number(txData.userStakesCountAfter) - Number(txData.userStakesCountBefore)})`
                    : '-',
              },
              {
                label: '% of available SUMR being locked ',
                value: `0 → ${txData.percentageOfSumrLocked ?? '0%'}`,
              },
              {
                label: (
                  <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                    <Text variant="p3semi" style={{ color: 'var(--color-text-warning)' }}>
                      Initial early withdrawal penalty
                    </Text>
                    <Tooltip tooltip="Huh?">
                      <Icon iconName="info" size={16} color="var(--color-text-warning)" />
                    </Tooltip>
                  </div>
                ),
                value: (
                  <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                    <Text variant="p3semi" style={{ color: 'var(--color-text-warning)' }}>
                      11.2%
                    </Text>
                  </div>
                ), // Huh?
              },
            ]}
          />
        </Card>
        <div className={sumrV2StakingManageViewStyles.successScreenButtonGroup}>
          {!isAllTokenStaked && (
            <Link href="/staking/manage" style={{ marginTop: '24px' }}>
              <Button variant="primaryLarge">Stake remaining $SUMR</Button>
            </Link>
          )}
          {userWalletAddress ? (
            <Link
              href={`/portfolio/${userWalletAddress}?tab=rewards`}
              style={{ marginTop: '24px' }}
            >
              <Button variant={isAllTokenStaked ? 'primaryLarge' : 'secondaryLarge'}>
                Go to portfolio
              </Button>
            </Link>
          ) : (
            <Button variant={isAllTokenStaked ? 'primaryLarge' : 'secondaryLarge'} disabled>
              Go to portfolio
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

const SumrV2StakingIntermediary = () => {
  const [step, setStep] = useState<'init' | 'done'>('init')
  const [txData, setTxData] = useState<{
    amount: BigNumber
    lockupDuration: number
    usdcYieldBoost?: number
    usdcBlendedYieldBoostFrom?: number
    usdcBlendedYieldBoostTo?: number
    percentageOfSumrLocked?: string
    userStakesCountBefore?: string
    userStakesCountAfter?: string
  }>()
  const [approveStatus, setApproveStatus] = useState<UiTransactionStatuses | null>(null)
  const [stakeStatus, setStakeStatus] = useState<UiTransactionStatuses | null>(null)
  const [shouldAutoStakeAfterApproval, setShouldAutoStakeAfterApproval] = useState(false)

  const { setChain, isSettingChain } = useChain()
  const { clientChainId } = useClientChainId()

  const { stakeSumrTransaction, approveSumrTransaction, prepareTxs, isLoading } =
    useStakeSumrTransactionV2({
      onStakeSuccess: () => {
        setStakeStatus(UiTransactionStatuses.COMPLETED)
        setStep('done')
        setShouldAutoStakeAfterApproval(false)
        toast.success('Staked $SUMR tokens successfully', SUCCESS_TOAST_CONFIG)
      },
      onApproveSuccess: () => {
        setApproveStatus(UiTransactionStatuses.COMPLETED)
        toast.success('Approved staking $SUMR tokens successfully', SUCCESS_TOAST_CONFIG)
      },
      onStakeError: () => {
        setStakeStatus(UiTransactionStatuses.FAILED)
        setShouldAutoStakeAfterApproval(false)
        toast.error('Failed to stake $SUMR tokens', ERROR_TOAST_CONFIG)
      },
      onApproveError: () => {
        setApproveStatus(UiTransactionStatuses.FAILED)
        setShouldAutoStakeAfterApproval(false)
        toast.error('Failed to approve staking $SUMR tokens', ERROR_TOAST_CONFIG)
      },
    })

  // Auto-execute stake after approval completes
  useEffect(() => {
    if (
      shouldAutoStakeAfterApproval &&
      approveStatus === UiTransactionStatuses.COMPLETED &&
      stakeSumrTransaction &&
      !stakeStatus
    ) {
      setStakeStatus(UiTransactionStatuses.PENDING)
      stakeSumrTransaction()
        .catch((err) => {
          setStakeStatus(UiTransactionStatuses.FAILED)
          toast.error('Failed to stake SUMR', ERROR_TOAST_CONFIG)
          // eslint-disable-next-line no-console
          console.error('Error staking SUMR:', err)
        })
        .finally(() => {
          setShouldAutoStakeAfterApproval(false)
        })
    }
  }, [shouldAutoStakeAfterApproval, approveStatus, stakeSumrTransaction, stakeStatus])

  // Auto-execute approve/stake after chain switch to Base
  useEffect(() => {
    if (
      shouldAutoStakeAfterApproval &&
      clientChainId === ChainIds.Base &&
      !isSettingChain &&
      !approveStatus &&
      !stakeStatus &&
      txData
    ) {
      const executeTransactions = async () => {
        try {
          const amountBigInt = formatDecimalToBigInt(txData.amount.toString())
          const lockupPeriodSeconds = BigInt(txData.lockupDuration * 24 * 60 * 60)

          const prepared = await prepareTxs(amountBigInt, lockupPeriodSeconds)

          if (!prepared) {
            toast.error('Failed to prepare staking transaction', ERROR_TOAST_CONFIG)
            setShouldAutoStakeAfterApproval(false)

            return
          }

          if (prepared.approve) {
            setApproveStatus(UiTransactionStatuses.PENDING)
            await prepared.approve()
            // After approval, the first useEffect will handle staking
          } else {
            setShouldAutoStakeAfterApproval(false)
            setStakeStatus(UiTransactionStatuses.PENDING)
            await prepared.stake()
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error executing transactions after chain switch:', error)
          setShouldAutoStakeAfterApproval(false)
        }
      }

      void executeTransactions()
    }
  }, [
    shouldAutoStakeAfterApproval,
    clientChainId,
    isSettingChain,
    approveStatus,
    stakeStatus,
    txData,
    prepareTxs,
  ])

  const onStake = async ({
    amount,
    lockupDuration,
    usdcYieldBoost,
    usdcBlendedYieldBoostFrom,
    usdcBlendedYieldBoostTo,
    percentageOfSumrLocked,
    userStakesCountBefore,
    userStakesCountAfter,
  }: {
    amount: BigNumber
    lockupDuration: number
    usdcYieldBoost?: number
    usdcBlendedYieldBoostFrom?: number
    usdcBlendedYieldBoostTo?: number
    percentageOfSumrLocked?: string
    userStakesCountBefore?: string
    userStakesCountAfter?: string
  }) => {
    if (amount.isZero() || amount.isNaN()) {
      toast.error('Invalid staking amount', ERROR_TOAST_CONFIG)

      return
    }

    setTxData({
      amount,
      lockupDuration,
      usdcYieldBoost,
      usdcBlendedYieldBoostFrom,
      usdcBlendedYieldBoostTo,
      percentageOfSumrLocked,
      userStakesCountBefore,
      userStakesCountAfter,
    })

    // Check if we need to switch to Base network
    if (clientChainId !== ChainIds.Base) {
      setShouldAutoStakeAfterApproval(true)
      setChain({ chain: SDKChainIdToAAChainMap[ChainIds.Base] })

      return
    }

    try {
      // Convert amount to bigint with proper decimals
      const amountBigInt = formatDecimalToBigInt(amount.toString())
      // Convert lockup duration from days to seconds
      const lockupPeriodSeconds = BigInt(lockupDuration * 24 * 60 * 60)

      // Prepare the transactions
      const prepared = await prepareTxs(amountBigInt, lockupPeriodSeconds)

      if (!prepared) {
        toast.error('Failed to prepare staking transaction', ERROR_TOAST_CONFIG)

        return
      }

      // Execute approve transaction first if needed
      if (prepared.approve && approveStatus !== UiTransactionStatuses.COMPLETED) {
        setShouldAutoStakeAfterApproval(true)
        setApproveStatus(UiTransactionStatuses.PENDING)
        await prepared.approve().catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error approving staking $SUMR:', err)

          throw err
        })
        // Don't proceed to stake yet - wait for approval status to update

        return
      }

      // Execute stake transaction directly if no approval needed
      setStakeStatus(UiTransactionStatuses.PENDING)
      await prepared.stake().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error staking $SUMR:', err)

        throw err
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Staking error:', error)
    }
  }

  if (step === 'init') {
    return (
      <SumrV2StakingManageComponent
        onStake={onStake}
        isLoading={
          isLoading ||
          approveStatus === UiTransactionStatuses.PENDING ||
          stakeStatus === UiTransactionStatuses.PENDING
        }
        approveStatus={approveStatus}
        needsApproval={!!approveSumrTransaction}
        prepareTxs={prepareTxs}
        isSettingChain={isSettingChain}
      />
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (step === 'done' && txData) {
    return <SumrV2StakingSuccessComponent txData={txData} />
  }

  return <Text variant="p2semi">Something went wrong.</Text>
}

export const SumrV2StakingManageView = () => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <SumrV2StakingIntermediary />
    </SDKContextProvider>
  )
}
