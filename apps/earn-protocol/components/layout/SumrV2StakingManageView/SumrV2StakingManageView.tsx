'use client'

import { useMemo, useState } from 'react'
import {
  AnimateHeight,
  Button,
  Card,
  CheckboxButton,
  DataBlock,
  Expander,
  Icon,
  InputWithDropdown,
  OrderInformation,
  SkeletonLine,
  Text,
  Tooltip,
  useAmount,
  useUserWallet,
  WithArrow,
  YieldSourceLabel,
} from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import { ChainIds } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import Link from 'next/link'

import { LockupRangeGraph } from '@/components/molecules/LockupRangeGraph/LockupRangeGraph'
import { LockupRangeInput } from '@/components/molecules/LockupRangeInput/LockupRangeInput'
import WalletLabel from '@/components/molecules/WalletLabel/WalletLabel'
import { sdkApiUrl } from '@/constants/sdk'
import { QuickActionTags } from '@/features/bridge/components/QuickActionTags/QuickActionTags'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import { useHandleInputChangeEvent } from '@/hooks/use-mixpanel-event'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useToken } from '@/hooks/use-token'
import { useTokenBalance } from '@/hooks/use-token-balance'

import sumrV2StakingManageViewStyles from './SumrV2StakingManageView.module.css'

// Huh?
const lockBucketAvailabilityMap = {
  90: 300,
  180: 12000,
  360: 1000000,
  720: 1000000,
  1080: 10000000,
}

const mapLockBucketToAvailability = (days: number) => {
  if (days < 90) {
    return lockBucketAvailabilityMap[90]
  }
  if (days <= 180) {
    return lockBucketAvailabilityMap[180]
  }
  if (days <= 360) {
    return lockBucketAvailabilityMap[360]
  }
  if (days <= 720) {
    return lockBucketAvailabilityMap[720]
  }

  return lockBucketAvailabilityMap[1080]
}

const mapLockBucketToRange = (days: number) => {
  if (days < 90) {
    return '14 days - 3m'
  }
  if (days <= 180) {
    return '3m - 6m'
  }
  if (days <= 360) {
    return '6m - 1y'
  }
  if (days <= 720) {
    return '1y - 2y'
  }

  return '2y - 3y'
}

const getAvailabilityLabel: (availability: number) => 'low' | 'medium' | 'high' = (
  availability,
) => {
  if (availability <= 1000) {
    return 'low'
  }
  if (availability < 15000) {
    return 'medium'
  }

  return 'high'
}

const availabilityColorMap: { [key in 'low' | 'medium' | 'high']: string } = {
  low: 'var(--color-text-critical)',
  medium: 'var(--color-background-warning-bold)',
  high: 'var(--earn-protocol-success-100)',
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
}: {
  onStake: (params: { amount: BigNumber; lockupDuration: number }) => void
}) => {
  const inputChangeHandler = useHandleInputChangeEvent()
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null)
  const [warningAccepted, setWarningAccepted] = useState(false)
  const [selectedLockupAndBoost, setSelectedLockupAndBoost] = useState<number>(90)

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

  const lockupExpirationDate = useMemo(() => {
    if (selectedLockupAndBoost === 0) {
      return 'N/A'
    }

    return dayjs().add(selectedLockupAndBoost, 'day').format('MMM D, YYYY')
  }, [selectedLockupAndBoost])

  const lockTimePeriodSummaryLabel = useMemo(() => {
    if (selectedLockupAndBoost === 0) {
      return 'No lockup'
    }

    return `${selectedLockupAndBoost} days (${lockupExpirationDate})`
  }, [selectedLockupAndBoost, lockupExpirationDate])

  const enoughBucketAvailability = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!amountParsed) {
      return false
    }

    return mapLockBucketToAvailability(selectedLockupAndBoost) >= amountParsed.toNumber()
  }, [amountParsed, selectedLockupAndBoost])

  const isButtonDisabled = useMemo(() => {
    if (!amountDisplay || amountParsed.isZero()) {
      return true
    }

    if (sumrBalanceOnSourceChain && amountParsed.isGreaterThan(sumrBalanceOnSourceChain)) {
      return true
    }

    if (!warningAccepted) {
      return true
    }

    if (!enoughBucketAvailability) {
      return false
    }

    return false
  }, [
    amountDisplay,
    amountParsed,
    enoughBucketAvailability,
    sumrBalanceOnSourceChain,
    warningAccepted,
  ])

  const onConfirmStake = () => {
    // Huh?
    // eslint-disable-next-line no-console
    console.log('Stake confirmed:', {
      amount: amountDisplay,
      lockupDuration: selectedLockupAndBoost,
    })
    onStake({
      amount: amountParsed,
      lockupDuration: selectedLockupAndBoost,
    })
  }

  return (
    <div className={sumrV2StakingManageViewStyles.wrapper}>
      <div className={sumrV2StakingManageViewStyles.title}>
        <Link href="Huh?">
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
                        <Text variant="p3semi">63.2m</Text>
                      </div>
                    ),
                  },
                  {
                    label: '% of circulating SUMR Staked',
                    value: '72.8%',
                  },
                  {
                    label: 'Total circulating SUMR supply',
                    value: (
                      <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                        <Icon iconName="sumr" size={16} />
                        <Text variant="p3semi">74.2m</Text>
                      </div>
                    ),
                  },
                  {
                    label: 'Average SUMR lock duration',
                    value: '2.3 years',
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
                    value: '$1.02m',
                  },
                  {
                    label: 'Revenue Share',
                    value: (
                      <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
                        <Text variant="p3semi">20%</Text>
                        <Tooltip tooltip="Huh?">
                          <Icon iconName="info" size={16} />
                        </Tooltip>
                      </div>
                    ),
                  },
                  {
                    label: 'USDC Yield APY',
                    value: 'up to 8.02%',
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
                    label: 'SUMR Analytics',
                    value: (
                      <WithArrow variant="p4semi" style={{ marginRight: '15px' }}>
                        <Link href="Huh?">View all</Link>
                      </WithArrow>
                    ),
                  },
                  {
                    label: 'Staking contract',
                    value: (
                      <WithArrow variant="p4semi" style={{ marginRight: '15px' }}>
                        <Link href="Huh?">Go to report</Link>
                      </WithArrow>
                    ),
                  },
                  {
                    label: 'Staking contract audit',
                    value: 'up to 8.02%',
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
            <Card className={sumrV2StakingManageViewStyles.sumrKeyStakingInfoCard}>Huh?</Card>
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
              Huh? Huh? Huh? What? Huh? Huh?
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
                isLoadingAccount ? (
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
                  }}
                  secondaryValue={amountDisplayUSD}
                  handleChange={handleAmountChangeWithPercentage}
                  handleDropdownChange={() => {}}
                  onBlur={() => {
                    defaultOnBlur()
                    // clearTransaction()
                    // if (!isSourceMatchingDestination) {
                    //   prepareTransaction()
                    // }
                  }}
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

                manualSetAmount(newAmount.toString())
                // if (!isSourceMatchingDestination) {
                //   prepareTransaction(newAmount.toString())
                // }
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
                      <Text variant="p4semi">USDC Yield (Boosted 2.2x)</Text>
                    </div>
                  }
                  value="7.2% APY"
                  subValue="$4,750.58 a year"
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
                      <Text variant="p4semi">SUMR Reward APY (Boosted 2.2x)</Text>
                    </div>
                  }
                  value="3.5% APY"
                  subValue="+7,116.06 SUMR"
                  subValueType="positive"
                  wrapperClassName={sumrV2StakingManageViewStyles.yieldDataBlock}
                />
              </Card>
            </div>
            <Card className={sumrV2StakingManageViewStyles.stakingLengthControllers}>
              <div className={sumrV2StakingManageViewStyles.stakingLengthLabels}>
                <Text variant="p3semi">1x</Text>
                <Text variant="p3semi">Lockup and boost yield</Text>
                <Text variant="p3semi">7.2x Boost</Text>
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
                lockupMap={{
                  90: getAvailabilityLabel(mapLockBucketToAvailability(90)), // 14 days - 3m
                  180: getAvailabilityLabel(mapLockBucketToAvailability(180)), // 3m - 6m
                  360: getAvailabilityLabel(mapLockBucketToAvailability(360)), // 6m - 1y
                  720: getAvailabilityLabel(mapLockBucketToAvailability(720)), // 1y - 2y
                  1080: getAvailabilityLabel(mapLockBucketToAvailability(1080)), // 2y - 3y
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
                    Avaliablity details
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
                      selectedLockupAndBoost > 0
                        ? {
                            label: (
                              <span
                                style={{
                                  color:
                                    availabilityColorMap[
                                      getAvailabilityLabel(
                                        mapLockBucketToAvailability(selectedLockupAndBoost),
                                      )
                                    ],
                                }}
                              >
                                {mapLockBucketToRange(selectedLockupAndBoost)}
                              </span>
                            ),
                            value: (
                              <span
                                style={{
                                  color:
                                    availabilityColorMap[
                                      getAvailabilityLabel(
                                        mapLockBucketToAvailability(selectedLockupAndBoost),
                                      )
                                    ],
                                }}
                              >
                                {mapLockBucketToAvailability(
                                  selectedLockupAndBoost,
                                ).toLocaleString()}{' '}
                                SUMR
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
                              mapLockBucketToAvailability(selectedLockupAndBoost),
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
                          {formatCryptoBalance(amountDisplay) || '0'} SUMR
                        </Text>
                      </div>
                    ),
                  },
                  {
                    label: 'Lock time period',
                    value: lockTimePeriodSummaryLabel,
                  },
                  {
                    label: 'Yield boost multipler',
                    value: '7x', // Huh?
                  },
                  {
                    label: 'Blended yield boost multipler',
                    value: '1.0x → 7x', // Huh?
                  },
                  {
                    label: 'SUMR lock positions ',
                    value: '0 → 1 (+1)', // Huh?
                  },
                  {
                    label: '% of available SUMR being locked ',
                    value: '0 → 100%', // Huh?
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
            <Button
              disabled={isButtonDisabled}
              variant="primaryLarge"
              style={{ alignSelf: 'flex-end', minWidth: 'auto' }}
              onClick={onConfirmStake}
            >
              Confirm Stake & Lock
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
  txData: { amount: BigNumber; lockupDuration: number }
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
                label: 'Yield boost multipler',
                value: '7x', // Huh?
              },
              {
                label: 'Blended yield boost multipler',
                value: '1.0x → 7x', // Huh?
              },
              {
                label: 'SUMR lock positions ',
                value: '0 → 1 (+1)', // Huh?
              },
              {
                label: '% of available SUMR being locked ',
                value: '0 → 100%', // Huh?
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
        {userWalletAddress ? (
          <Link href={`/portfolio/${userWalletAddress}`} style={{ marginTop: '24px' }}>
            <Button variant="primaryLarge">Go to portfolio</Button>
          </Link>
        ) : (
          <Button variant="primaryLarge" disabled>
            Go to portfolio
          </Button>
        )}
      </Card>
    </div>
  )
}

const SumrV2StakingIntermediary = () => {
  // Huh?
  // simple mapping steps, will need to include actual tx logic
  const [step, setStep] = useState<'init' | 'done'>('init')
  const [txData, setTxData] = useState<{
    amount: BigNumber
    lockupDuration: number
  }>()

  const onStake = ({ amount, lockupDuration }: { amount: BigNumber; lockupDuration: number }) => {
    setTxData({ amount, lockupDuration })
    setStep('done')
  }

  if (step === 'init') {
    return <SumrV2StakingManageComponent onStake={onStake} />
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
