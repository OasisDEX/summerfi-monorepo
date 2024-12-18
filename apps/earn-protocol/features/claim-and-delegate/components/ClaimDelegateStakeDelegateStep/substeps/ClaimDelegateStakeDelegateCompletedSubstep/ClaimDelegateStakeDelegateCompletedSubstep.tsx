import type { Dispatch, FC } from 'react'
import { Button, Card, DataBlock, Icon, LoadableAvatar, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { sumrDelegates } from '@/features/claim-and-delegate/consts'
import type {
  ClaimDelegateReducerAction,
  ClaimDelegateState,
  ClamDelegateExternalData,
} from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateStakeDelegateCompletedSubstep.module.scss'

interface ClaimDelegateStakeDelegateCompletedSubstepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClamDelegateExternalData
}

export const ClaimDelegateStakeDelegateCompletedSubstep: FC<
  ClaimDelegateStakeDelegateCompletedSubstepProps
> = ({ state, externalData }) => {
  const { walletAddress } = useParams()

  const claimedSumr = (
    <>
      {formatCryptoBalance(externalData.sumrEarned)}{' '}
      <Text as="span" variant="p3semiColorful">
        $SUMR
      </Text>
    </>
  )
  const claimedSumrUSD = `$${formatFiatBalance(Number(externalData.sumrEarned) * Number(externalData.sumrPrice))}`

  const apy = (
    <>
      {formatDecimalAsPercent(externalData.sumrApy).replace('%', '')}{' '}
      <Text as="span" variant="p3semi" style={{ color: 'var(--earn-protocol-success-100)' }}>
        %APY
      </Text>
    </>
  )
  const sumrPerYear = `${formatFiatBalance((Number(externalData.sumrDelegated) + Number(externalData.sumrEarned)) * Number(externalData.sumrApy))} $SUMR/yr`

  if (state.delegatee === undefined) {
    // eslint-disable-next-line no-console
    console.error('Delegatee is undefined')

    return null
  }

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
                {Number(externalData.sumrDelegated) + Number(externalData.sumrEarned)}
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
                name={btoa(state.delegatee)}
                variant="pixel"
                colors={['#B90061', '#EC58A2', '#F8A4CE', '#FFFFFF']}
              />
              <Text as="h4" variant="h4">
                {sumrDelegates.find((item) => item.address === state.delegatee)?.title}
              </Text>
            </div>
          </div>
        </div>
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          $SUMR voting power delegated to make Lazy Summer Protocol Governance decisions.
        </Text>
      </Card>
      <Link href={`/earn/portfolio/${walletAddress}`}>
        <Button variant="primarySmall">Go to $SUMR Overview</Button>
      </Link>
    </div>
  )
}
