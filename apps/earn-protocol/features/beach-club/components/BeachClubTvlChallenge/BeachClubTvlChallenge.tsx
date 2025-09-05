import { type Dispatch, type FC, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import {
  BeachClubRewardSimulation,
  Button,
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
  chainIdToSDKNetwork,
  formatCryptoBalance,
  formatFiatBalance,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'
import { type MerklReward } from '@summerfi/armada-protocol-common'
import { debounce } from 'lodash-es'
import { usePathname } from 'next/navigation'

import { type BeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { delayPerNetwork } from '@/constants/delay-per-network'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { BeachClubTvlChallengeRewardCard } from '@/features/beach-club/components/BeachClubTvlChallengeRewardCard/BeachClubTvlChallengeRewardCard'
import { getBeachClubClaimFeesButtonLabel } from '@/features/beach-club/helpers/get-beach-club-claim-fees-button-label'
import { useClaimBeachClubFeesTransaction } from '@/features/beach-club/hooks/use-claim-beach-club-fees-transaction'
import { type BeachClubReducerAction, type BeachClubState } from '@/features/beach-club/types'
import { ClaimDelegateOptInMerkl } from '@/features/claim-and-delegate/components/ClaimDelegateOptInMerkl/ClaimDelegateOptInMerkl'
import { useMerklOptInTransaction } from '@/features/claim-and-delegate/hooks/use-merkl-opt-in-transaction'
import { type MerklIsAuthorizedPerChain } from '@/features/claim-and-delegate/types'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'

import { getBeachClubTvlRewardsCards } from './cards'

import classNames from './BeachClubTvlChallenge.module.css'

const getFeesUSDClaimableNow = (merklRewards: MerklReward[] | undefined) => {
  if (merklRewards) {
    return merklRewards.reduce((acc, reward) => {
      return (
        acc +
        Number((Number(reward.amount) / Number(10 ** reward.token.decimals)) * reward.token.price)
      )
    }, 0)
  }

  return 0
}

interface BeachClubTvlChallengeProps {
  beachClubData: BeachClubData
  merklIsAuthorizedPerChain: MerklIsAuthorizedPerChain
  state: BeachClubState
  dispatch: Dispatch<BeachClubReducerAction>
}

export const BeachClubTvlChallenge: FC<BeachClubTvlChallengeProps> = ({
  beachClubData,
  merklIsAuthorizedPerChain,
  state,
  dispatch,
}) => {
  const pathname = usePathname()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const currentGroupTvl = Number(beachClubData.total_deposits_referred_usd ?? 0)
  const [isOptInOpen, setIsOptInOpen] = useState(false)
  const { userWalletAddress } = useUserWallet()

  const { clientChainId } = useClientChainId()
  const { publicClient } = useNetworkAlignedClient({
    overrideNetwork: sdkNetworkToHumanNetwork(chainIdToSDKNetwork(clientChainId)),
  })
  const { setChain, isSettingChain } = useChain()
  const merklIsAuthorizedOnBase = state.merklIsAuthorizedPerChain[SupportedNetworkIds.Base]

  const isOwner = userWalletAddress?.toLowerCase() === state.walletAddress.toLowerCase()

  const handleOptInOpenClose = () => setIsOptInOpen((prev) => !prev)

  const setSimulationValueCallback = debounce((value: string) => {
    EarnProtocolEvents.inputChanged({
      inputName: 'ep-beach-club-simulation-slider',
      value,
      page: pathname,
    })
  }, 1000)

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

  const { claimBeachClubFeesTransaction } = useClaimBeachClubFeesTransaction({
    onSuccess: () => {
      setTimeout(() => {
        dispatch({ type: 'update-merkl-status', payload: UiTransactionStatuses.COMPLETED })
        toast.success('Fees claimed successfully', SUCCESS_TOAST_CONFIG)
        dispatch({ type: 'update-fees-claimed', payload: true })
      }, delayPerNetwork[clientChainId])
    },
    onError: () => {
      toast.error('Failed to claim fees', ERROR_TOAST_CONFIG)
    },
    network: chainIdToSDKNetwork(clientChainId),
    publicClient,
  })

  const claimableFeesRewardsOnBase =
    beachClubData.claimableRewardsPerChain.perChain[SupportedNetworkIds.Base]

  const feesUSDclaimableNowOnBase = getFeesUSDClaimableNow(claimableFeesRewardsOnBase)

  const hasClaimableFeesRewardsOnBase = feesUSDclaimableNowOnBase > 0

  const handleClaimFees = async () => {
    await claimBeachClubFeesTransaction().catch((err) => {
      toast.error('Failed to claim fees', ERROR_TOAST_CONFIG)
      // eslint-disable-next-line no-console
      console.error('Error claiming fees', err)
    })
  }

  // chainId for now will always be Base as we support Merkl on base only
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

  const feesRewards = beachClubData.rewards
    .filter((reward) => reward.currency !== 'SUMR' && reward.currency !== 'points')
    .reduce((acc, reward) => acc + Number(reward.balance_usd), 0)

  const stats = [
    {
      id: 1,
      value: `$${formatFiatBalance(currentGroupTvl)}`,
      description: 'Cumulative TVL from referrals',
    },
    {
      id: 2,
      value: formatCryptoBalance(
        beachClubData.rewards.find((reward) => reward.currency === 'SUMR')?.balance ?? 0,
      ),
      description: 'Earned $SUMR',
    },
    {
      id: 3,
      value: `$${formatFiatBalance(feesRewards)}`,
      description: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
          Earned Fee&apos;s{' '}
          <Tooltip
            tooltip={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-space-2x-small)',
                }}
              >
                Earned fees are the total accrued fees from your Beach Club referrals to date,
                denominated in dollars.
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text as="p" variant="p3semi">
                    Claimable now: {formatFiatBalance(feesUSDclaimableNowOnBase)} USD
                  </Text>
                  <Text as="p" variant="p3semi">
                    Earned: {formatFiatBalance(feesRewards)} USD
                  </Text>
                </div>
              </div>
            }
            tooltipWrapperStyles={{ minWidth: '230px' }}
          >
            <Icon iconName="info" size={24} />
          </Tooltip>
        </div>
      ),
      cta: {
        label: getBeachClubClaimFeesButtonLabel({ state }),
        action: () => {
          if (!isOptInOpen && !merklIsAuthorizedOnBase) {
            handleOptInOpenClose()

            return
          }

          handleClaimFees()
        },
        disabled:
          isSettingChain ||
          state.claimStatus === UiTransactionStatuses.PENDING ||
          state.claimStatus === UiTransactionStatuses.COMPLETED ||
          !isOwner ||
          !hasClaimableFeesRewardsOnBase,
      },
    },
  ]

  const { defaultCards } = useMemo(
    () => getBeachClubTvlRewardsCards(currentGroupTvl),
    [currentGroupTvl],
  )

  return (
    <div className={classNames.beachClubTvlChallengeWrapper}>
      <div className={classNames.statsWrapper}>
        {stats.map((stat, idx) => (
          <div key={stat.id} className={classNames.textual}>
            <Text as="h2" variant={idx === 0 ? 'h2colorfulBeachClub' : 'h2'}>
              {stat.value}
            </Text>
            <Text as="div" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              {stat.description}
            </Text>
            {stat.cta && feesRewards > 0 && !state.feesClaimed && (
              <Button
                variant="beachClubMedium"
                onClick={stat.cta.action}
                style={{ marginTop: 'var(--spacing-space-large)' }}
                disabled={stat.cta.disabled}
              >
                <Text as="p" variant="p4semi">
                  {stat.cta.label}
                </Text>
              </Button>
            )}
          </div>
        ))}
      </div>
      {/* <div className={classNames.leaderboardLink}>
        <Link href="/" target="_blank" style={{ textAlign: 'center' }}>
          <WithArrow as="p" variant="p3semi" style={{ color: 'var(--beach-club-link)' }}>
            See leaderboard
          </WithArrow>
        </Link>
      </div> */}
      <div
        className={classNames.rewardCardsWrapper}
        style={{ marginTop: 'var(--general-space-32)' }}
      >
        {defaultCards.map((card) => (
          <BeachClubTvlChallengeRewardCard
            key={card.tvlGroup}
            {...card}
            referralCode={beachClubData.custom_code ?? beachClubData.referral_code ?? undefined}
          />
        ))}
      </div>
      <BeachClubRewardSimulation
        tvl={currentGroupTvl}
        setSimulationValueCallback={setSimulationValueCallback}
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
    </div>
  )
}
