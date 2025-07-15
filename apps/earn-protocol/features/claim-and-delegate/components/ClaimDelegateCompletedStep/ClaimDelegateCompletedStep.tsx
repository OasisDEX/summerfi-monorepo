import type { FC } from 'react'
import { useChain } from '@account-kit/react'
import {
  Button,
  Card,
  DataBlock,
  Icon,
  LoadableAvatar,
  SUMR_CAP,
  Text,
  useLocalConfig,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'
import {
  ADDRESS_ZERO,
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
  safeBTOA,
} from '@summerfi/app-utils'
import { useParams } from 'next/navigation'

import { getDelegateTitle } from '@/features/claim-and-delegate/helpers'
import { useDecayFactor } from '@/features/claim-and-delegate/hooks/use-decay-factor'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'

import classNames from './ClaimDelegateCompletedStep.module.css'

interface ClaimedCardProps {
  hasClaimed: boolean
  externalData: ClaimDelegateExternalData
  chainId: SDKChainId
  estimatedSumrPrice: number
}

const ClaimedCard: FC<ClaimedCardProps> = ({
  hasClaimed,
  externalData,
  chainId,
  estimatedSumrPrice,
}) => {
  const claimedSumrRaw = externalData.sumrToClaim.claimableAggregatedRewards.perChain[chainId] ?? 0

  if (!hasClaimed) {
    return (
      <Card className={classNames.cardWrapper}>
        <DataBlock
          title="Claimed"
          titleSize="medium"
          value="No rewards claimed"
          valueSize="large"
          subValueSize="small"
          valueStyle={{ color: 'var(--earn-protocol-secondary-60)' }}
          subValueStyle={{ color: 'var(--earn-protocol-secondary-40)' }}
        />
      </Card>
    )
  }

  const claimedSumr = (
    <>
      {formatCryptoBalance(claimedSumrRaw)}{' '}
      <Text as="span" variant="p3semiColorful">
        $SUMR
      </Text>
    </>
  )

  const claimedSumrUSD = `$${formatFiatBalance(claimedSumrRaw * estimatedSumrPrice)}`

  return (
    <Card className={classNames.cardWrapper}>
      <DataBlock
        title="Claimed"
        titleSize="medium"
        value={claimedSumr}
        valueSize="largeColorful"
        subValue={claimedSumrUSD}
        subValueSize="small"
      />
      <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
        $SUMR claimed from earning Summer.fi Pro $RAYS Lazy Summer Protocol deposits.
      </Text>
    </Card>
  )
}

interface PotentialEarningCardProps {
  externalData: ClaimDelegateExternalData
  state: ClaimDelegateState
  totalDelegated: number
}

const PotentialEarningCard: FC<PotentialEarningCardProps> = ({
  externalData,
  state,
  totalDelegated,
}) => {
  const { decayFactor } = useDecayFactor(state.delegatee)

  const apy = (
    <>
      {formatDecimalAsPercent(
        externalData.sumrStakingInfo.sumrStakingApy * (decayFactor ?? 1),
      ).replace('%', '')}{' '}
      <Text as="span" variant="p3semi" style={{ color: 'var(--earn-protocol-success-100)' }}>
        %APY
      </Text>
    </>
  )

  const sumrPerYear = `${formatFiatBalance(totalDelegated * Number(externalData.sumrStakingInfo.sumrStakingApy * (decayFactor ?? 1)))} $SUMR/yr`

  return (
    <Card className={classNames.cardWrapper}>
      <DataBlock
        title="Potential Earning"
        titleSize="medium"
        value={apy}
        valueStyle={{ color: 'var(--earn-protocol-success-100)' }}
        valueSize="large"
        subValue={sumrPerYear}
        subValueSize="small"
      />
      <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
        $SUMR rewards earned by staking ($SUMR) tokens in Lazy Summer Governance.
      </Text>
    </Card>
  )
}

interface TotalStakedCardProps {
  externalData: ClaimDelegateExternalData
  state: ClaimDelegateState
  estimatedSumrPrice: number
}

const TotalStakedCard: FC<TotalStakedCardProps> = ({ externalData, state, estimatedSumrPrice }) => {
  const totalStakedRaw =
    Number(externalData.sumrStakeDelegate.stakedAmount) + Number(state.stakeChangeAmount ?? 0)

  const totalStaked = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-8)' }}>
      <Icon tokenName="SUMR" />
      <Text as="span" variant="h4">
        {formatCryptoBalance(totalStakedRaw)}
      </Text>
    </div>
  )

  const totalStakedUSD = `$${formatFiatBalance(totalStakedRaw * estimatedSumrPrice)}`

  return (
    <Card className={classNames.cardWrapper}>
      <DataBlock
        title="Total staked"
        titleSize="medium"
        value={totalStaked}
        valueSize="largeColorful"
        subValue={totalStakedUSD}
        subValueSize="small"
      />
    </Card>
  )
}

interface ClaimDelegateCompletedStepProps {
  state: ClaimDelegateState
  externalData: ClaimDelegateExternalData
}

export const ClaimDelegateCompletedStep: FC<ClaimDelegateCompletedStepProps> = ({
  state,
  externalData,
}) => {
  const { walletAddress } = useParams()
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const { chain } = useChain()

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const sumrClaimedStepBefore =
    state.claimStatus === ClaimDelegateTxStatuses.COMPLETED
      ? externalData.sumrToClaim.claimableAggregatedRewards.perChain[SDKChainId.BASE] ?? 0
      : 0

  const externalDataSumrDelegated = externalData.sumrStakeDelegate.sumrDelegated

  const delegatee = state.delegatee?.toLowerCase()

  if (delegatee === undefined) {
    // eslint-disable-next-line no-console
    console.error('Delegatee is undefined')

    return null
  }

  const externalDelegatee = externalData.tallyDelegates.find(
    (delegate) => delegate.userAddress.toLowerCase() === delegatee,
  )

  const resolvedDelegateTitle = getDelegateTitle({
    tallyDelegate: externalDelegatee,
    currentDelegate: delegatee,
  })

  // if delegatee is address zero it means that user removed delegatee
  // therefore fallback to 0
  const totalDelegated =
    delegatee !== ADDRESS_ZERO
      ? // we are not refetching sumrDelegated therefore we need to add sumrClaimedStepBefore to it
        Number(externalDataSumrDelegated) + Number(sumrClaimedStepBefore)
      : 0

  return (
    <div className={classNames.claimDelegateStakeDelegateCompletedSubstepWrapper}>
      <div className={classNames.mainContent}>
        <ClaimedCard
          hasClaimed={state.claimStatus === ClaimDelegateTxStatuses.COMPLETED}
          externalData={externalData}
          chainId={chain.id}
          estimatedSumrPrice={estimatedSumrPrice}
        />

        <TotalStakedCard
          externalData={externalData}
          state={state}
          estimatedSumrPrice={estimatedSumrPrice}
        />
        <PotentialEarningCard
          externalData={externalData}
          state={state}
          totalDelegated={totalDelegated}
        />
      </div>
      <Card className={classNames.footer}>
        <div className={classNames.status}>
          <div className={classNames.block}>
            <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              Delegated
            </Text>
            <div className={classNames.withIcon}>
              <Icon tokenName="SUMR" />
              <Text as="h4" variant="h4">
                {formatCryptoBalance(totalDelegated)}
              </Text>
            </div>
          </div>
          <div className={classNames.arrow}>
            <Icon iconName="arrow_forward" size={20} />
          </div>
          <div className={classNames.block}>
            <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              To
            </Text>
            <div className={classNames.withIcon}>
              <LoadableAvatar
                size={30}
                name={safeBTOA(resolvedDelegateTitle)}
                variant="pixel"
                colors={['#B90061', '#EC58A2', '#F8A4CE', '#FFFFFF']}
              />
              <Text as="h4" variant="h4">
                {resolvedDelegateTitle}
              </Text>
            </div>
          </div>
        </div>
        <Text
          as="p"
          variant="p4semi"
          style={{
            color: 'var(--earn-protocol-secondary-40)',
            maxWidth: '440px',
            textAlign: 'center',
          }}
        >
          Total voting power lent to your chosen delegatee. Your delegatee can make decisions on
          your behalf, as part of Lazy Summer Governance.
        </Text>
      </Card>
      {/* anchor to force full reload of portfolio page and its server fetched data */}
      <a href={`/earn/portfolio/${walletAddress}?tab=${PortfolioTabs.REWARDS}`}>
        <Button variant="primaryMedium">
          <WithArrow variant="p3semi" as="p" style={{ color: 'inherit' }} reserveSpace>
            Go to portfolio
          </WithArrow>
        </Button>
      </a>
    </div>
  )
}
