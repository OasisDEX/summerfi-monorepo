import type { Dispatch, FC } from 'react'
import {
  Button,
  Card,
  DataBlock,
  Icon,
  LoadableAvatar,
  SkeletonLine,
  SUMR_CAP,
  Text,
  useLocalConfig,
} from '@summerfi/app-earn-ui'
import {
  formatAddress,
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
} from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { localSumrDelegates } from '@/features/claim-and-delegate/consts'
import type {
  ClaimDelegateExternalData,
  ClaimDelegateReducerAction,
  ClaimDelegateState,
} from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'
import { type TokenBalanceData } from '@/hooks/use-token-balance'

import classNames from './ClaimDelegateStakeDelegateCompletedSubstep.module.scss'

interface ClaimDelegateStakeDelegateCompletedSubstepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
  sumrBalanceData: TokenBalanceData
}

export const ClaimDelegateStakeDelegateCompletedSubstep: FC<
  ClaimDelegateStakeDelegateCompletedSubstepProps
> = ({ state, externalData, sumrBalanceData }) => {
  const { walletAddress } = useParams()
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const claimedSumr = (
    <>
      {sumrBalanceData.tokenBalanceLoading ? (
        <SkeletonLine height="16px" width="70px" />
      ) : (
        formatCryptoBalance(sumrBalanceData.tokenBalance ?? '0')
      )}{' '}
      <Text as="span" variant="p3semiColorful">
        $SUMR
      </Text>
    </>
  )
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP
  const claimedSumrUSD = sumrBalanceData.tokenBalanceLoading ? (
    <SkeletonLine height="12px" width="40px" />
  ) : (
    `$${formatFiatBalance(Number(sumrBalanceData.tokenBalance ?? '0') * estimatedSumrPrice)}`
  )

  const apy = (
    <>
      {formatDecimalAsPercent(externalData.sumrStakingInfo.sumrStakingApy).replace('%', '')}{' '}
      <Text as="span" variant="p3semi" style={{ color: 'var(--earn-protocol-success-100)' }}>
        %APY
      </Text>
    </>
  )
  const sumrPerYear = `${formatFiatBalance((Number(externalData.sumrStakeDelegate.sumrDelegated) + Number(externalData.sumrEarned)) * Number(externalData.sumrStakingInfo.sumrStakingApy))} $SUMR/yr`

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
    externalDelegatee?.account.name !== ''
      ? externalDelegatee?.account.name
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
            title="Earning"
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
                {Number(externalData.sumrStakeDelegate.sumrDelegated) +
                  Number(externalData.sumrEarned)}
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
      <Link href={`/portfolio/${walletAddress}?tab=${PortfolioTabs.REWARDS}`}>
        <Button variant="primarySmall">Go to $SUMR Overview</Button>
      </Link>
    </div>
  )
}
