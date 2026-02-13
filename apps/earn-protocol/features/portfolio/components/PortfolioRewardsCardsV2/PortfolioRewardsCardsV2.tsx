'use client'
import { type Dispatch, type FC, useMemo, useReducer, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuthModal, useChain } from '@account-kit/react'
import {
  Button,
  DataModule,
  ERROR_TOAST_CONFIG,
  Icon,
  MobileDrawer,
  Modal,
  SDKChainIdToAAChainMap,
  SUCCESS_TOAST_CONFIG,
  Text,
  Tooltip,
  useClientChainId,
  useMobileCheck,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import { SupportedNetworkIds, UiTransactionStatuses } from '@summerfi/app-types'
import {
  ADDRESS_ZERO,
  chainIdToSDKNetwork,
  formatCryptoBalance,
  formatFiatBalance,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { UnstakeOldSumrButton } from '@/components/molecules/UnstakeOldSumrButton/UnstakeOldSumrButton'
import { delayPerNetwork } from '@/constants/delay-per-network'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { beachClubDefaultState, beachClubReducer } from '@/features/beach-club/state'
import { type BeachClubState } from '@/features/beach-club/types'
import { ClaimDelegateOptInMerkl } from '@/features/claim-and-delegate/components/ClaimDelegateOptInMerkl/ClaimDelegateOptInMerkl'
import { getDelegateTitle } from '@/features/claim-and-delegate/helpers'
import { useMerklOptInTransaction } from '@/features/claim-and-delegate/hooks/use-merkl-opt-in-transaction'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  type MerklIsAuthorizedPerChain,
} from '@/features/claim-and-delegate/types'
import { type ClaimableRewards } from '@/features/portfolio/types'
import { useClaimMerkleRewardsTransaction } from '@/hooks/use-claim-merkle-rewards-transaction'
import { useHandleButtonClickEvent, useHandleTooltipOpenEvent } from '@/hooks/use-mixpanel-event'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useRevalidateUser } from '@/hooks/use-revalidate'

import classNames from './PortfolioRewardsCardsV2.module.css'

interface SumrAvailableToClaimProps {
  rewardsData: ClaimDelegateExternalData
  sumrPriceUsd: number
}

interface SumrInOldStakingModuleProps {
  rewardsData: ClaimDelegateExternalData
}

interface ClaimMerkleRewardsProps {
  claimableRewards: ClaimableRewards
  userWalletAddress?: string
  viewWalletAddress: string
  merklIsAuthorizedPerChain: MerklIsAuthorizedPerChain
}

interface YourTotalSumrProps {
  rewardsData: ClaimDelegateExternalData
  sumrStakedV2: number
  sumrPriceUsd: number
}

interface YourDelegateProps {
  rewardsData: ClaimDelegateExternalData
  state: ClaimDelegateState
}

interface PortfolioRewardsCardsV2Props {
  rewardsData: ClaimDelegateExternalData
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  sumrStakedV2: number
  sumrPriceUsd: number
  claimableRewards: ClaimableRewards
  viewWalletAddress: string
}

const getMerklClaimRewardsButtonLabel = ({
  claimStatus,
}: {
  claimStatus: BeachClubState['claimStatus']
}) => {
  switch (claimStatus) {
    case UiTransactionStatuses.PENDING:
      return 'Claiming...'
    case UiTransactionStatuses.COMPLETED:
      return 'Claimed'
    case UiTransactionStatuses.FAILED:
      return 'Retry'
    default:
      return 'Claim rewards'
  }
}

const SumrAvailableToClaim: FC<SumrAvailableToClaimProps> = ({ rewardsData, sumrPriceUsd }) => {
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const tooltipEventHandler = useHandleTooltipOpenEvent()
  const { walletAddress } = useParams()
  const { openAuthModal } = useAuthModal()
  const rawSumr = Number(rewardsData.sumrToClaim.aggregatedRewards.total)
  const rawSumrUSD = rawSumr * sumrPriceUsd
  const sumrAmount = formatCryptoBalance(rawSumr)
  const sumrAmountUSD = `$${formatFiatBalance(rawSumrUSD)}`

  const { userWalletAddress } = useUserWallet()

  const resolvedWalletAddress = walletAddress as string

  const handleClaimEventButton = () => {
    buttonClickEventHandler(`portfolio-sumr-rewards-claim`)
  }

  const handleConnect = () => {
    buttonClickEventHandler(`portfolio-sumr-rewards-claim-connect`)
    if (!userWalletAddress) {
      openAuthModal()
    }
  }

  return (
    <DataModule
      dataBlock={{
        title: (
          <Tooltip
            tooltip={
              <Text as="p" variant="p4semi">
                $SUMR available to claim across all networks. Mainet, Base, and Arbitrum
              </Text>
            }
            tooltipWrapperStyles={{ minWidth: '240px' }}
            tooltipName="portfolio-sumr-rewards-total-available-to-claim"
            onTooltipOpen={tooltipEventHandler}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
              <Icon iconName="info" variant="s" />
              <Text as="p" variant="p2semi">
                Total $SUMR available to claim
              </Text>
            </div>
          </Tooltip>
        ),
        titleWrapperStyles: {
          whiteSpace: 'unset',
        },
        value: sumrAmount,
        subValue: sumrAmountUSD,
        titleSize: 'medium',
        valueSize: 'large',
      }}
      actionable={
        !userWalletAddress ? (
          <Button variant="primarySmall" onClick={handleConnect}>
            Claim $SUMR
          </Button>
        ) : (
          <Link href={`/claim/${walletAddress}`} prefetch onClick={handleClaimEventButton}>
            <Button
              variant="primarySmall"
              disabled={
                rawSumr === 0 ||
                userWalletAddress.toLowerCase() !== resolvedWalletAddress.toLowerCase()
              }
            >
              Claim $SUMR
            </Button>
          </Link>
        )
      }
    />
  )
}

const SumrInOldStakingModule: FC<SumrInOldStakingModuleProps> = ({ rewardsData }) => {
  const sumrAvailableToStake = Number(rewardsData.sumrStakeDelegate.stakedAmount)

  const value = `${formatCryptoBalance(sumrAvailableToStake)} SUMR`
  const { walletAddress } = useParams()

  return (
    <DataModule
      dataBlock={{
        title: 'SUMR Staked in Old Staking Module',
        value,
        titleSize: 'medium',
        valueSize: 'large',
      }}
      actionable={
        <UnstakeOldSumrButton
          walletAddress={walletAddress as string}
          oldStakedAmount={rewardsData.sumrStakeDelegate.stakedAmount}
        />
      }
    />
  )
}

const ClaimMerkleRewards: FC<ClaimMerkleRewardsProps> = ({
  claimableRewards,
  userWalletAddress,
  viewWalletAddress,
  merklIsAuthorizedPerChain,
}) => {
  const [isOptInOpen, setIsOptInOpen] = useState(false)

  const hasRewardsToClaim = claimableRewards.usdAmount > 0
  const rewardsLabel = useMemo(() => {
    const rewards = claimableRewards.rewards
      .map((reward) => {
        if (reward.amount > 0) {
          return `${formatCryptoBalance(reward.amount)} ${reward.symbol}`
        }

        return null
      })
      .filter(Boolean)

    return rewards.length > 0 ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {rewards.map((reward, index) => (
          <>
            {index > 0 && <Text variant="p2semi"> + </Text>}
            <Text variant="h5">{reward}</Text>
          </>
        ))}
      </div>
    ) : (
      <div>-</div>
    )
  }, [claimableRewards.rewards])

  const usdcRewardsAmountWithTokenBreakdownTooltip = useMemo(() => {
    if (!hasRewardsToClaim) {
      return undefined
    }
    const tokenRewardsElements = claimableRewards.rewards.map((reward) => {
      if (reward.amount > 0) {
        const tokenUsdValue = reward.amountUSD

        return (
          <div
            key={reward.symbol}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '6px',
              paddingBottom: '6px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text variant="p4semi">{reward.symbol} Amount</Text>
              <Text variant="p4">
                {formatCryptoBalance(reward.amount)}&nbsp;{reward.symbol}
              </Text>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text variant="p4semi">{reward.symbol} Price (USD)</Text>
              <Text variant="p4">${formatFiatBalance(reward.priceUsd)}</Text>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text variant="p4semi">{reward.symbol} Total Value</Text>
              <Text variant="p4semi">${formatFiatBalance(tokenUsdValue)}</Text>
            </div>
          </div>
        )
      }

      return null
    })

    const validTokenElements = tokenRewardsElements.filter(Boolean)

    return (
      <Tooltip
        tooltip={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
            {validTokenElements.length > 0 ? (
              <>
                {validTokenElements}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text variant="p2semi">Total Rewards Value</Text>
                  <Text variant="p2semi">${formatFiatBalance(claimableRewards.usdAmount)}</Text>
                </div>
              </>
            ) : (
              <Text variant="p3">No rewards available to claim</Text>
            )}
          </div>
        }
        tooltipWrapperStyles={{
          minWidth: '320px',
        }}
      >
        <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>
          {claimableRewards.usdAmount > 0
            ? `$${formatFiatBalance(claimableRewards.usdAmount)}`
            : '-'}
        </span>
      </Tooltip>
    )
  }, [claimableRewards.rewards, claimableRewards.usdAmount, hasRewardsToClaim])

  const merklIsAuthorizedOnBase = merklIsAuthorizedPerChain[SupportedNetworkIds.Base]

  const isOwner = userWalletAddress?.toLowerCase() === viewWalletAddress.toLowerCase()

  const revalidateUser = useRevalidateUser()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const { clientChainId } = useClientChainId()
  const { setChain, isSettingChain } = useChain()
  const { publicClient } = useNetworkAlignedClient({
    overrideNetwork: sdkNetworkToHumanNetwork(chainIdToSDKNetwork(clientChainId)),
  })

  const handleOptInOpenClose = () => setIsOptInOpen((prev) => !prev)

  const [state, dispatch] = useReducer(beachClubReducer, {
    ...beachClubDefaultState,
    walletAddress: userWalletAddress ?? '', // we still display this component when no user is connected (no action is possible though so this should be fine)
    merklIsAuthorizedPerChain,
  })

  const { claimMerkleRewardsTransaction } = useClaimMerkleRewardsTransaction({
    onSuccess: () => {
      setTimeout(() => {
        dispatch({ type: 'update-claim-status', payload: UiTransactionStatuses.COMPLETED })
        toast.success(
          'Rewards claimed successfully, token values can take up to several minutes to update',
          SUCCESS_TOAST_CONFIG,
        )
        dispatch({ type: 'update-fees-claimed', payload: true })
        if (isOwner) {
          revalidateUser(userWalletAddress)
        }
      }, delayPerNetwork[clientChainId])
    },
    onError: () => {
      dispatch({ type: 'update-claim-status', payload: UiTransactionStatuses.FAILED })
      toast.error('Failed to claim fees', ERROR_TOAST_CONFIG)
    },
    network: chainIdToSDKNetwork(clientChainId),
    publicClient,
  })

  const { merklOptInTransaction } = useMerklOptInTransaction({
    onSuccess: () => {
      setTimeout(() => {
        dispatch({ type: 'update-merkl-status', payload: UiTransactionStatuses.COMPLETED })
        dispatch({
          type: 'update-merkl-is-authorized-per-chain',
          payload: {
            ...merklIsAuthorizedPerChain,
            [clientChainId]: true,
          },
        })
        toast.success('Merkl approval successful', SUCCESS_TOAST_CONFIG)
        handleOptInOpenClose()
      }, delayPerNetwork[clientChainId])
    },
    onError: () => {
      dispatch({ type: 'update-merkl-status', payload: UiTransactionStatuses.FAILED })
      toast.error('Merkl approval failed', ERROR_TOAST_CONFIG)
    },
    network: chainIdToSDKNetwork(clientChainId),
    publicClient,
  })

  const handleMerklOptInAccept = (chainId: SupportedNetworkIds) => {
    if (Number(clientChainId) !== Number(chainId)) {
      setChain({ chain: SDKChainIdToAAChainMap[chainId] })

      return
    }
    dispatch({ type: 'update-merkl-status', payload: UiTransactionStatuses.PENDING })
    merklOptInTransaction().catch((err) => {
      dispatch({ type: 'update-merkl-status', payload: UiTransactionStatuses.FAILED })
      toast.error('Failed to approve Merkl', ERROR_TOAST_CONFIG)
      // eslint-disable-next-line no-console
      console.error('Error approving Merkl', err)
    })
  }

  const handleClaimRewards = async () => {
    dispatch({ type: 'update-claim-status', payload: UiTransactionStatuses.PENDING })
    if (!isOptInOpen && !merklIsAuthorizedOnBase) {
      handleOptInOpenClose()

      return
    }

    await claimMerkleRewardsTransaction().catch((err) => {
      toast.error('Failed to claim rewards', ERROR_TOAST_CONFIG)
      // eslint-disable-next-line no-console
      console.error('Error claiming rewards', err)
    })
  }

  const buttonLabel = useMemo(() => {
    return getMerklClaimRewardsButtonLabel({ claimStatus: state.claimStatus })
  }, [state.claimStatus])

  const claimingInProgress =
    state.claimStatus === UiTransactionStatuses.PENDING ||
    state.claimStatus === UiTransactionStatuses.COMPLETED

  return (
    <>
      <DataModule
        dataBlock={{
          title: 'Rewards claimable now',
          value: rewardsLabel,
          subValue: usdcRewardsAmountWithTokenBreakdownTooltip,
          titleSize: 'medium',
          valueSize: 'large',
        }}
        actionable={
          <Button
            variant="unstyled"
            onClick={handleClaimRewards}
            disabled={
              !hasRewardsToClaim ||
              isSettingChain ||
              state.feesClaimed ||
              !isOwner ||
              claimingInProgress
            }
          >
            <Text variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              {buttonLabel}
            </Text>
          </Button>
        }
      />
      {isMobile ? (
        <MobileDrawer isOpen={isOptInOpen} onClose={handleOptInOpenClose} height="auto">
          <ClaimDelegateOptInMerkl
            onAccept={() => handleMerklOptInAccept(SupportedNetworkIds.Base)}
            onReject={handleOptInOpenClose}
            merklStatus={state.merklStatus}
          />
        </MobileDrawer>
      ) : (
        <Modal openModal={isOptInOpen} closeModal={handleOptInOpenClose}>
          <ClaimDelegateOptInMerkl
            onAccept={() => handleMerklOptInAccept(SupportedNetworkIds.Base)}
            onReject={handleOptInOpenClose}
            merklStatus={state.merklStatus}
          />
        </Modal>
      )}
    </>
  )
}

const YourTotalSumr: FC<YourTotalSumrProps> = ({ rewardsData, sumrStakedV2, sumrPriceUsd }) => {
  const rawTotalSumr =
    Number(rewardsData.sumrBalances.total) +
    Number(rewardsData.sumrBalances.vested) +
    Number(rewardsData.sumrStakeDelegate.stakedAmount) +
    Number(rewardsData.sumrToClaim.aggregatedRewards.total) +
    sumrStakedV2

  const rawTotalSumrUSD = rawTotalSumr * sumrPriceUsd

  const totalSumr = formatCryptoBalance(rawTotalSumr)
  const totalSumrUSD = formatFiatBalance(rawTotalSumrUSD)

  return (
    <DataModule
      gradientBackground
      dataBlock={{
        title: 'Your Total $SUMR (Accrued + Staked + In your wallet)',
        titleWrapperStyles: {
          whiteSpace: 'unset',
        },
        value: totalSumr,
        subValue: `$${totalSumrUSD}`,
        titleSize: 'medium',
        valueSize: 'large',
      }}
    />
  )
}

const YourDelegate: FC<YourDelegateProps> = ({ rewardsData, state }) => {
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const { walletAddress } = useParams()
  const resolvedWalletAddress = walletAddress as string
  const { userWalletAddress } = useUserWallet()
  const { openAuthModal } = useAuthModal()

  const sumrDelegatedTo =
    state.delegatee?.toLowerCase() ?? rewardsData.sumrStakeDelegate.delegatedToV2.toLowerCase()

  const rewardsDataDelegatee = rewardsData.tallyDelegates.find(
    (item) => item.userAddress.toLowerCase() === sumrDelegatedTo,
  )

  const resolvedDelegateTitle = getDelegateTitle({
    tallyDelegate: rewardsDataDelegatee,
    currentDelegate: sumrDelegatedTo,
  })

  const value = sumrDelegatedTo === ADDRESS_ZERO ? 'No delegate' : resolvedDelegateTitle

  // const votingPower = Number(
  //   rewardsData.tallyDelegates.find((item) => item.userAddress.toLowerCase() === sumrDelegatedTo)
  //     ?.votePower ?? 1,
  // )

  const subValue =
    sumrDelegatedTo !== ADDRESS_ZERO ? null : 'You have not delegated in Governance V2'

  const handleChangeDelegateEventButton = () => {
    buttonClickEventHandler(`portfolio-sumr-rewards-change-delegate`)
  }

  const handleConnect = () => {
    buttonClickEventHandler(`portfolio-sumr-rewards-change-delegate-connect`)
    if (!userWalletAddress) {
      openAuthModal()
    }
  }

  return (
    <DataModule
      dataBlock={{
        title: 'Your delegate',
        value,
        titleSize: 'medium',
        valueSize: 'large',
        subValue,
      }}
      actionable={
        !userWalletAddress ? (
          <Button variant="unstyled" onClick={handleConnect}>
            <Text variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              Change delegate
            </Text>
          </Button>
        ) : (
          <Link
            href={`/delegate/${walletAddress}`}
            prefetch
            onClick={handleChangeDelegateEventButton}
          >
            <Button
              variant="unstyled"
              disabled={userWalletAddress.toLowerCase() !== resolvedWalletAddress.toLowerCase()}
            >
              <Text variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
                Change delegate
              </Text>
            </Button>
          </Link>
        )
      }
    />
  )
}

export const PortfolioRewardsCardsV2: FC<PortfolioRewardsCardsV2Props> = ({
  rewardsData,
  state,
  sumrStakedV2,
  sumrPriceUsd,
  claimableRewards,
  viewWalletAddress,
}) => {
  const hasSumrInOldModule = Number(rewardsData.sumrStakeDelegate.stakedAmount) > 0.01
  const { userWalletAddress } = useUserWallet()

  return (
    <div className={classNames.portfolioRewardsCardsWrapper}>
      <div className={classNames.cardWrapper}>
        <YourTotalSumr
          rewardsData={rewardsData}
          sumrStakedV2={sumrStakedV2}
          sumrPriceUsd={sumrPriceUsd}
        />
      </div>
      <div className={classNames.cardWrapper}>
        <YourDelegate rewardsData={rewardsData} state={state} />
      </div>
      <div className={classNames.cardWrapper}>
        <SumrAvailableToClaim rewardsData={rewardsData} sumrPriceUsd={sumrPriceUsd} />
      </div>
      {hasSumrInOldModule ? (
        <div className={classNames.cardWrapper}>
          <SumrInOldStakingModule rewardsData={rewardsData} />
        </div>
      ) : (
        <div className={classNames.cardWrapper}>
          <ClaimMerkleRewards
            claimableRewards={claimableRewards}
            userWalletAddress={userWalletAddress}
            viewWalletAddress={viewWalletAddress}
            merklIsAuthorizedPerChain={rewardsData.sumrToClaim.merklIsAuthorizedPerChain}
          />
        </div>
      )}
      {/* <div className={clsx(classNames.cardWrapper, classNames.cardWrapperFullWidth)}>
        <SumrPriceBar />
      </div> */}
    </div>
  )
}
