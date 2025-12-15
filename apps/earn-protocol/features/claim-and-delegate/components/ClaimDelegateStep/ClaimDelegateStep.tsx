import { type ChangeEvent, type Dispatch, type FC, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain, useUser } from '@account-kit/react'
import {
  AccountKitAccountType,
  Button,
  Card,
  DataBlock,
  Dropdown,
  ERROR_TOAST_CONFIG,
  Input,
  SDKChainIdToAAChainMap,
  SUCCESS_TOAST_CONFIG,
  Text,
  useClientChainId,
  useUserWallet,
  WithArrow,
} from '@summerfi/app-earn-ui'
import {
  type DropdownRawOption,
  SupportedNetworkIds,
  UiTransactionStatuses,
} from '@summerfi/app-types'
import { ADDRESS_ZERO, formatPercent } from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { type TallyDelegate } from '@/app/server-handlers/tally'
import { MAX_MULTIPLE } from '@/constants/sumr-staking-v2'
import { ClaimDelegateActionCard } from '@/features/claim-and-delegate/components/ClaimDelegateActionCard/ClaimDelegateActionCard'
import { ClaimDelegateCard } from '@/features/claim-and-delegate/components/ClaimDelegateCard/ClaimDelegateCard'
import { mergeDelegatesData } from '@/features/claim-and-delegate/consts'
import { getDelegateTitle } from '@/features/claim-and-delegate/helpers'
import { useSumrDelegateTransaction } from '@/features/claim-and-delegate/hooks/use-sumr-delegate-transaction'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'
import { revalidateUser } from '@/helpers/revalidation-handlers'

import { getChangeDelegateButtonLabel } from './getDelegateButtonLabel'
import { DelegateSortOptions, getDelegateSortOptions } from './sort-options'
import { ClaimDelegateAction } from './types'

import classNames from './ClaimDelegateStep.module.css'

const getIsCardFaded = ({ address, state }: { address: string; state: ClaimDelegateState }) => {
  return (
    state.delegatee !== ADDRESS_ZERO && state.delegatee?.toLowerCase() !== address.toLowerCase()
  )
}

const fetchDelegatesBySearchValue = async (searchValue: string): Promise<TallyDelegate[]> => {
  try {
    const response = await fetch(`/earn/api/tally/delegates?ensOrAddressOrName=${searchValue}`)

    return response.json()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching delegates by search value:', error)

    return []
  }
}

interface ClaimDelegateStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
  isJustDelegate?: boolean
}

export const ClaimDelegateStep: FC<ClaimDelegateStepProps> = ({
  state,
  dispatch,
  externalData,
  isJustDelegate,
}) => {
  const { walletAddress } = useParams()
  const [delegates, setDelegates] = useState<TallyDelegate[]>(externalData.tallyDelegates)
  const [action, setAction] = useState<ClaimDelegateAction>()
  const { setChain } = useChain()
  const { push } = useRouter()
  const { clientChainId } = useClientChainId()
  const [sortBy, setSortBy] = useState<DropdownRawOption>(
    getDelegateSortOptions(DelegateSortOptions.HIGHEST_VOTE_AMOUNT)[0],
  )

  const resolvedWalletAddress = (
    Array.isArray(walletAddress) ? walletAddress[0] : walletAddress
  ) as string

  const user = useUser()
  const { userWalletAddress } = useUserWallet()

  const [searchValue, setSearchValue] = useState('')

  // Simple debounce with ref
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  // Handle the actual search with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (searchValue === '') {
        setDelegates(externalData.tallyDelegates)

        return
      }

      try {
        const result = await fetchDelegatesBySearchValue(searchValue)

        setDelegates(result)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Search failed:', error)
      }
    }, 300)
  }, [searchValue, externalData.tallyDelegates])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const apy = (
    <Text as="h5" variant="h5">
      {externalData.sumrRewardApy === 0
        ? '-'
        : `Up to ${formatPercent(externalData.sumrRewardApy * MAX_MULTIPLE, { precision: 2 })} `}
      <Text as="span" variant="p4semi">
        APR
      </Text>
    </Text>
  )
  // const sumrPerYear =
  //   externalData.sumrRewardAmount === 0
  //     ? '-'
  //     : `+${formatCryptoBalance(externalData.sumrRewardAmount)} SUMR / Year`

  const { sumrDelegateTransaction } = useSumrDelegateTransaction({
    onSuccess: () => {
      dispatch({ type: 'update-delegate-status', payload: UiTransactionStatuses.COMPLETED })

      toast.success('Delegate has been updated', SUCCESS_TOAST_CONFIG)

      if (action === ClaimDelegateAction.REMOVE && !isJustDelegate) {
        dispatch({ type: 'update-delegatee', payload: ADDRESS_ZERO })
        dispatch({ type: 'update-step', payload: ClaimDelegateSteps.COMPLETED })

        return
      }
      if (action === ClaimDelegateAction.REMOVE && isJustDelegate) {
        push(`/portfolio/${userWalletAddress}?tab=${PortfolioTabs.REWARDS}`)

        return
      }
      if (isJustDelegate) {
        push(`/portfolio/${userWalletAddress}?tab=${PortfolioTabs.REWARDS}`)
      } else {
        dispatch({ type: 'update-step', payload: ClaimDelegateSteps.STAKE })
      }
    },
    onError: () => {
      dispatch({ type: 'update-delegate-status', payload: UiTransactionStatuses.FAILED })

      toast.error('Failed to update delegate', ERROR_TOAST_CONFIG)
    },
  })

  const hasStake = Number(externalData.sumrStakeDelegate.stakedAmount) > 0

  const isBase = clientChainId === SupportedNetworkIds.Base

  const handleDelegate = async (updateDelegatee?: string) => {
    const isDelegateUnchanged =
      externalData.sumrStakeDelegate.delegatedToV2.toLowerCase() ===
        updateDelegatee?.toLowerCase() &&
      externalData.sumrStakeDelegate.delegatedToV2 !== ADDRESS_ZERO

    // delegation is only supported on base
    if (!isBase) {
      // eslint-disable-next-line no-console
      setChain({ chain: SDKChainIdToAAChainMap[SupportedNetworkIds.Base] })

      return
    }

    if (isDelegateUnchanged) {
      dispatch({ type: 'update-step', payload: ClaimDelegateSteps.STAKE })

      return
    }

    if (updateDelegatee !== ADDRESS_ZERO) {
      setAction(ClaimDelegateAction.CHANGE)
    } else {
      setAction(ClaimDelegateAction.REMOVE)

      if (hasStake) {
        return
      }
    }

    dispatch({ type: 'update-delegate-status', payload: UiTransactionStatuses.PENDING })

    await sumrDelegateTransaction(updateDelegatee)
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error delegating $SUMR:', err)
      })
      .finally(() => {
        revalidateUser(userWalletAddress)
      })
  }

  const mappedSumrDelegatesData = mergeDelegatesData(delegates)

  const isChangeDelegateLoading =
    state.delegateStatus === UiTransactionStatuses.PENDING && action === ClaimDelegateAction.CHANGE

  const isRemoveDelegateLoading =
    state.delegateStatus === UiTransactionStatuses.PENDING && action === ClaimDelegateAction.REMOVE

  // self delegating is available on for EOA only
  // since we use tally that doesn't support SCA
  const isEoa = user?.type === AccountKitAccountType.EOA

  const sumrDelegatedToV1 = externalData.sumrStakeDelegate.delegatedToV1.toLowerCase()
  const sumrDelegatedToV2 =
    state.delegateStatus === UiTransactionStatuses.COMPLETED && state.delegatee
      ? state.delegatee.toLowerCase()
      : externalData.sumrStakeDelegate.delegatedToV2.toLowerCase()

  const hasDelegateeV2 = sumrDelegatedToV2 !== ADDRESS_ZERO

  const rewardsDataDelegateeV1 = externalData.tallyDelegates.find(
    (item) => item.userAddress.toLowerCase() === sumrDelegatedToV1,
  )
  const rewardsDataDelegateeV2 = externalData.tallyDelegates.find(
    (item) => item.userAddress.toLowerCase() === sumrDelegatedToV2,
  )

  const resolvedDelegateTitleV1 = getDelegateTitle({
    tallyDelegate: rewardsDataDelegateeV1,
    currentDelegate: sumrDelegatedToV1,
  })
  const resolvedDelegateTitleV2 = getDelegateTitle({
    tallyDelegate: rewardsDataDelegateeV2,
    currentDelegate: sumrDelegatedToV2,
  })

  const delegateV1 = sumrDelegatedToV1 === ADDRESS_ZERO ? 'No delegate' : resolvedDelegateTitleV1
  const delegateV2 = sumrDelegatedToV2 === ADDRESS_ZERO ? 'No delegate' : resolvedDelegateTitleV2

  return (
    <div className={classNames.claimDelegateStepWrapper}>
      <div className={classNames.leftContent}>
        <Card className={classNames.cardWrapper} style={{ marginBottom: '0' }}>
          <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            Your delegate
          </Text>
          <div className={classNames.valueWithIcon}>
            <Text as="h4" variant="h4">
              {delegateV2}
            </Text>
          </div>
        </Card>
        {!hasDelegateeV2 && (
          <Card className={classNames.cardWrapper}>
            <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Your v1 gov. delegate
            </Text>
            <div className={classNames.valueWithIcon}>
              <Text as="h5" variant="h5">
                {delegateV1}
              </Text>
            </div>
          </Card>
        )}
        <div>
          <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--general-space-4)' }}>
            Lazy Summer Governance Objectives
          </Text>
          <Text
            as="p"
            variant="p3"
            style={{
              color: 'var(--earn-protocol-secondary-40)',
              marginBottom: 'var(--general-space-4)',
            }}
          >
            Each delegate has their own values, intentions and visions for the Lazy Summer Protocol.
            Delegate your voting power to those who best align with your values.
          </Text>
          <Link href="https://forum.summer.fi/c/delegates/19" target="_blank">
            <WithArrow as="p" variant="p3">
              Learn more about Governance
            </WithArrow>
          </Link>
          <div className={classNames.spacer} />
        </div>
        <div>
          <DataBlock
            title="Staking Rewards"
            titleStyle={{
              color: 'var(--earn-protocol-secondary-100)',
              marginBottom: 'var(--general-space-8)',
            }}
            titleSize="medium"
            value={apy}
            valueStyle={{
              color: 'var(--earn-protocol-success-100)',
              marginBottom: 'var(--general-space-8)',
            }}
            valueSize="small"
            // subValue={sumrPerYear}
            subValueStyle={{
              color: 'var(--earn-protocol-primary-100)',
              marginBottom: 'var(--general-space-8)',
            }}
          />
          <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            Earn $SUMR rewards for staking and delegating your tokens.
          </Text>
        </div>
        {isEoa && (
          <div className={classNames.selfDelegateCard}>
            <ClaimDelegateCard
              title="Delegate to yourself"
              description="Be your own Delegate. Steer which yield sources and networks are onboarded, how capital is allocated, and how contributors are rewarded."
              ens=""
              address={resolvedWalletAddress}
              isActive={state.delegatee?.toLowerCase() === resolvedWalletAddress.toLowerCase()}
              handleClick={() =>
                dispatch({
                  type: 'update-delegatee',
                  payload: resolvedWalletAddress.toLowerCase(),
                })
              }
              selfDelegate
              disabled={isRemoveDelegateLoading || isChangeDelegateLoading}
              isFaded={getIsCardFaded({ address: resolvedWalletAddress, state })}
            />
          </div>
        )}
      </div>
      <div className={classNames.rightContent}>
        <div className={classNames.rightContentHeading}>
          <div className={classNames.inputWrapper}>
            <Input
              variant="withBorder"
              placeholder="Find a delegate (Name, ENS or Address)"
              className={classNames.inputCustomStyles}
              icon={{
                name: 'search_icon',
                size: 20,
                style: { color: 'var(--earn-protocol-secondary-40)' },
              }}
              onChange={handleSearch}
              value={searchValue}
            />
          </div>
          <div>
            <Dropdown
              options={getDelegateSortOptions(sortBy.value as DelegateSortOptions)}
              dropdownValue={sortBy}
              dropdownOptionsStyle={{ left: 'unset', right: 0, top: '50px' }}
              dropdownChildrenStyle={{
                borderRadius: 'var(--general-radius-8)',
                padding: 'var(--general-space-12) var(--general-space-16)',
              }}
              asPill
              onChange={setSortBy}
            >
              <Text as="p" variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
                Sort by
              </Text>
            </Dropdown>
          </div>
        </div>
        {hasStake && action === ClaimDelegateAction.REMOVE ? (
          <ClaimDelegateActionCard
            title="Unable to remove delegate"
            description="You will need to unstake if you want to continue"
            actionLabel="Remove stake"
            action={() => {
              dispatch({ type: 'update-step', payload: ClaimDelegateSteps.STAKE })
            }}
            closeAction={() => setAction(undefined)}
          />
        ) : (
          <>
            <div className={classNames.delegates}>
              {mappedSumrDelegatesData
                .sort((a, b) => {
                  if (sortBy.value === DelegateSortOptions.HIGHEST_VOTE_AMOUNT) {
                    return b.sumrAmountV2 - a.sumrAmountV2
                  }

                  return b.delegatorsCountV2 - a.delegatorsCountV2
                })
                .map((delegate) => (
                  <ClaimDelegateCard
                    key={delegate.address}
                    {...delegate}
                    isActive={state.delegatee === delegate.address}
                    handleClick={() =>
                      dispatch({ type: 'update-delegatee', payload: delegate.address })
                    }
                    disabled={isRemoveDelegateLoading || isChangeDelegateLoading}
                    isFaded={getIsCardFaded({ address: delegate.address, state })}
                  />
                ))}
              {mappedSumrDelegatesData.length === 0 && (
                <Text
                  as="p"
                  variant="p2semi"
                  style={{
                    color: 'var(--earn-protocol-secondary-40)',
                    textAlign: 'center',
                    marginTop: 'var(--general-space-32)',
                  }}
                >
                  No delegates found
                </Text>
              )}
            </div>
            <WithArrow
              as="p"
              variant="p3"
              style={{
                marginTop: 'var(--general-space-8)',
              }}
            >
              <Link
                href="https://www.tally.xyz/gov/lazy-summer-dao-official-v2/delegates"
                target="_blank"
                style={{
                  color: 'var(--earn-protocol-primary-100)',
                }}
              >
                Can&apos;t find your delegate? Visit Lazy Summer DAO on Tally
              </Link>
            </WithArrow>
          </>
        )}

        {hasStake && action === ClaimDelegateAction.REMOVE ? null : (
          <div className={classNames.buttonsWrapper}>
            <div className={classNames.buttonsGroup}>
              {hasDelegateeV2 ? null : (
                <Link href={`/portfolio/${walletAddress}?tab=${PortfolioTabs.REWARDS}`}>
                  <Button
                    variant="secondarySmall"
                    disabled={isRemoveDelegateLoading || isChangeDelegateLoading}
                  >
                    <Text variant="p3semi" as="p">
                      {isJustDelegate ? 'Go back to portfolio' : 'Claim & Forfeit staking yield'}
                    </Text>
                  </Button>
                </Link>
              )}
              <Button
                variant="primarySmall"
                style={{ paddingRight: 'var(--general-space-32)' }}
                onClick={() => handleDelegate(state.delegatee)}
                disabled={
                  isBase &&
                  (isChangeDelegateLoading ||
                    isRemoveDelegateLoading ||
                    !state.delegatee ||
                    (state.delegatee === ADDRESS_ZERO &&
                      externalData.sumrStakeDelegate.delegatedToV2 === ADDRESS_ZERO) ||
                    userWalletAddress?.toLowerCase() !== resolvedWalletAddress.toLowerCase())
                }
              >
                <WithArrow
                  style={{ color: 'var(--earn-protocol-secondary-100)' }}
                  variant="p3semi"
                  as="p"
                  isLoading={isChangeDelegateLoading}
                >
                  {getChangeDelegateButtonLabel({
                    state,
                    action,
                    isBase,
                  })}
                </WithArrow>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
