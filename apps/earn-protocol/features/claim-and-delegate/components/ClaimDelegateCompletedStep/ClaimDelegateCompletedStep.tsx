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
} from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'
import {
  formatAddress,
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
} from '@summerfi/app-utils'
import { useParams } from 'next/navigation'

import { localSumrDelegates } from '@/features/claim-and-delegate/consts'
import { useDecayFactor } from '@/features/claim-and-delegate/hooks/use-decay-factor'
import type {
  ClaimDelegateExternalData,
  ClaimDelegateState,
} from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'

import classNames from './ClaimDelegateCompletedStep.module.scss'

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

  const { decayFactor } = useDecayFactor(state.delegatee)

  const { chain } = useChain()

  const claimedSumrRaw = externalData.sumrToClaim.perChain[chain.id] ?? 0

  const claimedSumr = (
    <>
      {formatCryptoBalance(claimedSumrRaw)}{' '}
      <Text as="span" variant="p3semiColorful">
        $SUMR
      </Text>
    </>
  )
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP
  const claimedSumrUSD = `$${formatFiatBalance(claimedSumrRaw * estimatedSumrPrice)}`

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
  const sumrClaimedStepBefore = externalData.sumrToClaim.perChain[SDKChainId.BASE] ?? 0
  // we are not refetching sumrDelegated therefore we need to add sumrClaimedStepBefore to it
  const sumrPerYear = `${formatFiatBalance((Number(externalData.sumrStakeDelegate.sumrDelegated) + Number(sumrClaimedStepBefore)) * Number(externalData.sumrStakingInfo.sumrStakingApy * (decayFactor ?? 1)))} $SUMR/yr`

  const delegatee = state.delegatee?.toLowerCase()

  if (delegatee === undefined) {
    // eslint-disable-next-line no-console
    console.error('Delegatee is undefined')

    return null
  }

  const externalDelegatee = externalData.sumrDelegates.find(
    (delegate) => delegate.account.address.toLowerCase() === delegatee,
  )

  // use name from tally api, if not fallback to local mapping
  // last resort is delegatee address
  const delegateeName =
    externalDelegatee && externalDelegatee.account.name !== ''
      ? externalDelegatee.account.name
      : localSumrDelegates.find((item) => item.address === state.delegatee)?.title ??
        formatAddress(delegatee)

  return (
    <div className={classNames.claimDelegateStakeDelegateCompletedSubstepWrapper}>
      <div className={classNames.mainContent}>
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
            $SUMR Earned from staking and delegating claimed tokens in Lazy Summer Governance.
          </Text>
        </Card>
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
                {formatCryptoBalance(
                  Number(externalData.sumrStakeDelegate.sumrDelegated) +
                    Number(sumrClaimedStepBefore),
                )}
              </Text>
            </div>
          </div>
          <div className={classNames.arrow}>
            <Icon iconName="arrow_forward" size={16} />
          </div>
          <div className={classNames.block}>
            <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              To
            </Text>
            <div className={classNames.withIcon}>
              <LoadableAvatar
                size={38}
                name={btoa(delegateeName)}
                variant="pixel"
                colors={['#B90061', '#EC58A2', '#F8A4CE', '#FFFFFF']}
              />
              <Text as="h4" variant="h4">
                {delegateeName}
              </Text>
            </div>
          </div>
        </div>
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          $SUMR voting power delegated to make Lazy Summer Protocol Governance decisions.
        </Text>
      </Card>
      {/* anchor to force full reload of portfolio page and its server fetched data */}
      <a href={`/earn/portfolio/${walletAddress}?tab=${PortfolioTabs.REWARDS}`}>
        <Button variant="primarySmall">Go to $SUMR Overview</Button>
      </a>
    </div>
  )
}
