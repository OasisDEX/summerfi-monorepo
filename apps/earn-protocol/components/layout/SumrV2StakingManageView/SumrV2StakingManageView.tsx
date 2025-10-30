'use client'

import { useState } from 'react'
import {
  Card,
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
} from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import { ChainIds } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import WalletLabel from '@/components/molecules/WalletLabel/WalletLabel'
import { sdkApiUrl } from '@/constants/sdk'
import { QuickActionTags } from '@/features/bridge/components/QuickActionTags/QuickActionTags'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import { useHandleInputChangeEvent } from '@/hooks/use-mixpanel-event'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useToken } from '@/hooks/use-token'
import { useTokenBalance } from '@/hooks/use-token-balance'

import sumrV2StakingManageViewStyles from './SumrV2StakingManageView.module.css'

const StepNumber = ({ number }: { number: number }) => {
  return (
    <div className={sumrV2StakingManageViewStyles.stepNumberWrapper}>
      <Text variant="p4semi">{number}</Text>
    </div>
  )
}

const SumrV2StakingManageComponent = () => {
  const inputChangeHandler = useHandleInputChangeEvent()
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null)

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

  return (
    <div className={sumrV2StakingManageViewStyles.wrapper}>
      <div className={sumrV2StakingManageViewStyles.title}>
        <Link href="#">
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
              <Link href="#">Learn more about SUMR and staking</Link>
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
                        <Link href="#">View all</Link>
                      </WithArrow>
                    ),
                  },
                  {
                    label: 'Staking contract',
                    value: (
                      <WithArrow variant="p4semi" style={{ marginRight: '15px' }}>
                        <Link href="#">Go to report</Link>
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
          <div className={sumrV2StakingManageViewStyles.cardRightColumnFirstStep}>
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
          <div className={sumrV2StakingManageViewStyles.inlineLittleGap}>
            <StepNumber number={2} />
            <Text variant="p2semi">How do you want to lock up and boost your SUMR?</Text>
          </div>
        </div>
      </Card>
    </div>
  )
}

export const SumrV2StakingManageView = () => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <SumrV2StakingManageComponent />
    </SDKContextProvider>
  )
}
