import { type ReactNode } from 'react'
import {
  type IconNamesList,
  type SDKVaultishType,
  SupportedSDKNetworks,
  type VaultApyData,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  subgraphNetworkToId,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import Link from 'next/link'

import { AdditionalBonusLabel } from '@/components/atoms/AdditionalBonusLabel/AdditionalBonusLabel'
import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Risk } from '@/components/atoms/Risk/Risk'
import { SkeletonLine } from '@/components/atoms/SkeletonLine/SkeletonLine'
import { Text } from '@/components/atoms/Text/Text'
import { VaultTitle } from '@/components/molecules/VaultTitle/VaultTitle'
import { getDisplayToken } from '@/helpers/get-display-token'
import { getSumrTokenBonus } from '@/helpers/get-sumr-token-bonus'
import { getVaultUrl } from '@/helpers/get-vault-url'

import vaultCardHomepageStyles from './VaultCardHomepage.module.css'

const DataBlock = ({
  title,
  contentDesktop,
  contentMobile,
  primary = false,
  titleIcon,
}: {
  title: string
  titleIcon?: IconNamesList
  contentDesktop: ReactNode
  contentMobile: ReactNode
  primary?: boolean
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Text
          as="p"
          variant="p3semi"
          style={{ color: 'var(--earn-protocol-secondary-40)' }}
          className={vaultCardHomepageStyles.dataBlockDesktop}
        >
          {title}
        </Text>
        <Text
          as="p"
          variant="p4semi"
          style={{ color: 'var(--earn-protocol-secondary-40)' }}
          className={vaultCardHomepageStyles.dataBlockMobile}
        >
          {title}
        </Text>
        {titleIcon ? (
          <Icon
            iconName={titleIcon}
            size={16}
            style={{ color: 'var(--earn-protocol-secondary-40)', margin: '0 0 0 1px' }}
          />
        ) : null}
      </div>
      <div
        className={clsx(vaultCardHomepageStyles.dataBlockDesktop, {
          [vaultCardHomepageStyles.dataPrimary]: primary,
          [vaultCardHomepageStyles.dataSecondary]: !primary,
        })}
      >
        {contentDesktop}
      </div>
      <div
        className={clsx(vaultCardHomepageStyles.dataBlockMobile, {
          [vaultCardHomepageStyles.dataPrimary]: primary,
          [vaultCardHomepageStyles.dataSecondary]: !primary,
        })}
      >
        {contentMobile}
      </div>
    </div>
  )
}

const VaultCardLoading = ({
  selected = true,
  onSelect,
}: {
  selected?: boolean
  onSelect?: () => void
}) => {
  return (
    <Card
      className={clsx(vaultCardHomepageStyles.vaultCardHomepageWrapper, {
        [vaultCardHomepageStyles.vaultCardHomepageWrapperSelected]: selected,
      })}
      style={{
        cursor: selected ? 'auto' : 'pointer',
      }}
      onClick={!selected ? onSelect : undefined}
    >
      <div
        className={clsx(vaultCardHomepageStyles.vaultCardHomepageContentWrapper, {
          [vaultCardHomepageStyles.vaultCardHomepageContentWrapperSelected]: selected,
        })}
      >
        <div className={vaultCardHomepageStyles.vaultCardHomepageTitleWrapper}>
          <VaultTitle symbol="" networkName={SupportedSDKNetworks.Mainnet} isVaultCard isLoading />
        </div>
        <div className={vaultCardHomepageStyles.vaultCardHomepageDatablocksWrapper}>
          <div className={vaultCardHomepageStyles.vaultCardHomepageDataRow}>
            <DataBlock
              title="Total assets"
              primary
              contentDesktop={
                <div style={{ display: 'flex', marginTop: '6px' }}>
                  <Text variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                    <SkeletonLine height={20} width={100} />
                  </Text>
                  &nbsp;
                  <Text
                    variant="p4semi"
                    style={{ color: 'var(--earn-protocol-secondary-40)', marginTop: '3px' }}
                  >
                    <SkeletonLine height={12} width={50} />
                  </Text>
                </div>
              }
              contentMobile={
                <div style={{ display: 'flex', marginTop: '4px' }}>
                  <Text variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                    <SkeletonLine height={18} width={100} />
                  </Text>
                  &nbsp;
                  <Text
                    variant="p4semi"
                    style={{ color: 'var(--earn-protocol-secondary-40)', marginTop: '3px' }}
                  >
                    <SkeletonLine height={12} width={50} />
                  </Text>
                </div>
              }
            />
            <DataBlock
              title="APY"
              titleIcon="stars"
              contentDesktop={
                <Text
                  as="p"
                  variant="p1semiColorful"
                  style={{ color: 'var(--earn-protocol-secondary-100)', marginTop: '6px' }}
                >
                  <SkeletonLine height={20} width={100} />
                </Text>
              }
              contentMobile={
                <Text
                  as="p"
                  variant="p2colorful"
                  style={{ color: 'var(--earn-protocol-secondary-100)', marginTop: '4px' }}
                >
                  <SkeletonLine height={18} width={70} />
                </Text>
              }
            />
          </div>
          <div className={vaultCardHomepageStyles.vaultCardHomepageDataRow}>
            <DataBlock
              title="Best for"
              primary
              contentDesktop={
                <Text
                  as="p"
                  variant="p1semi"
                  style={{ color: 'var(--earn-protocol-secondary-100)', marginTop: '6px' }}
                >
                  <SkeletonLine height={20} width={100} />
                </Text>
              }
              contentMobile={
                <Text
                  as="p"
                  variant="p2semi"
                  style={{ color: 'var(--earn-protocol-secondary-100)', marginTop: '4px' }}
                >
                  <SkeletonLine height={18} width={80} />
                </Text>
              }
            />
            <DataBlock
              title="Risk"
              titleIcon="clock"
              contentDesktop={<SkeletonLine height={20} width={100} style={{ marginTop: '6px' }} />}
              contentMobile={<SkeletonLine height={18} width={85} style={{ marginTop: '4px' }} />}
            />
          </div>
        </div>
        <Link href="#">
          <Button variant="primaryLargeColorful" disabled style={{ width: '100%' }}>
            Get started
          </Button>
        </Link>
      </div>
    </Card>
  )
}

type VaultCardHomepageProps = {
  vault?: SDKVaultishType
  vaultsApyByNetworkMap?: {
    [key: `${string}-${number}`]: VaultApyData
  }
  selected?: boolean
  onSelect?: () => void
  sumrPrice?: number
  isLoading?: boolean
}

export const VaultCardHomepage = ({
  vault,
  vaultsApyByNetworkMap,
  selected = true,
  onSelect,
  sumrPrice,
  isLoading,
}: VaultCardHomepageProps): React.ReactNode => {
  if (isLoading ?? !vault) {
    return <VaultCardLoading selected={selected} onSelect={onSelect} />
  }
  const {
    id,
    inputToken,
    inputTokenBalance,
    totalValueLockedUSD,
    protocol,
    customFields,
    rewardTokens,
    rewardTokenEmissionsAmount,
    rewardTokenEmissionsFinish,
  } = vault

  if (!vaultsApyByNetworkMap) {
    return null
  }
  const { apy } = vaultsApyByNetworkMap[`${id}-${subgraphNetworkToId(protocol.network)}`]
  const parsedApy = formatDecimalAsPercent(apy)
  const parsedTotalValueLocked = formatCryptoBalance(
    new BigNumber(String(inputTokenBalance)).div(ten.pow(inputToken.decimals)),
  )
  const parsedTotalValueLockedUSD = formatCryptoBalance(new BigNumber(String(totalValueLockedUSD)))
  const { sumrTokenBonus, rawSumrTokenBonus } = getSumrTokenBonus(
    rewardTokens,
    rewardTokenEmissionsAmount,
    sumrPrice,
    totalValueLockedUSD,
    rewardTokenEmissionsFinish,
  )

  return (
    <Card
      className={clsx(vaultCardHomepageStyles.vaultCardHomepageWrapper, {
        [vaultCardHomepageStyles.vaultCardHomepageWrapperSelected]: selected,
      })}
      style={{
        cursor: selected ? 'auto' : 'pointer',
      }}
      onClick={!selected ? onSelect : undefined}
    >
      <div
        className={clsx(vaultCardHomepageStyles.vaultCardHomepageContentWrapper, {
          [vaultCardHomepageStyles.vaultCardHomepageContentWrapperSelected]: selected,
        })}
      >
        <div className={vaultCardHomepageStyles.vaultCardHomepageTitleWrapper}>
          <VaultTitle symbol={inputToken.symbol} networkName={protocol.network} isVaultCard />
          <AdditionalBonusLabel
            externalTokenBonus={customFields?.bonus}
            sumrTokenBonus={rawSumrTokenBonus !== '0' ? sumrTokenBonus : undefined}
          />
        </div>
        <div className={vaultCardHomepageStyles.vaultCardHomepageDatablocksWrapper}>
          <div className={vaultCardHomepageStyles.vaultCardHomepageDataRow}>
            <DataBlock
              title="Total assets"
              primary
              contentDesktop={
                <div style={{ display: 'flex' }}>
                  <Text variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                    {parsedTotalValueLocked}&nbsp;{getDisplayToken(inputToken.symbol)}
                  </Text>
                  &nbsp;
                  <Text
                    variant="p4semi"
                    style={{ color: 'var(--earn-protocol-secondary-40)', marginTop: '3px' }}
                  >
                    ${parsedTotalValueLockedUSD}
                  </Text>
                </div>
              }
              contentMobile={
                <div style={{ display: 'flex' }}>
                  <Text variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                    {parsedTotalValueLocked}&nbsp;{getDisplayToken(inputToken.symbol)}
                  </Text>
                  &nbsp;
                  <Text
                    variant="p4semi"
                    style={{ color: 'var(--earn-protocol-secondary-40)', marginTop: '3px' }}
                  >
                    ${parsedTotalValueLockedUSD}
                  </Text>
                </div>
              }
            />
            <DataBlock
              title="APY"
              titleIcon="stars"
              contentDesktop={
                <Text
                  variant="p1semiColorful"
                  style={{ color: 'var(--earn-protocol-secondary-100)' }}
                >
                  {parsedApy}
                </Text>
              }
              contentMobile={
                <Text variant="p2colorful" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                  {parsedApy}
                </Text>
              }
            />
          </div>
          <div className={vaultCardHomepageStyles.vaultCardHomepageDataRow}>
            <DataBlock
              title="Best for"
              primary
              contentDesktop={
                <Text variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                  {customFields?.bestFor ?? 'Optimized lending yield'}
                </Text>
              }
              contentMobile={
                <Text variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                  {customFields?.bestFor ?? 'Optimized lending yield'}
                </Text>
              }
            />
            <DataBlock
              title="Risk"
              titleIcon="clock"
              contentDesktop={<Risk risk={customFields?.risk ?? 'lower'} variant="p1semi" />}
              contentMobile={<Risk risk={customFields?.risk ?? 'lower'} variant="p2semi" />}
            />
          </div>
        </div>
        <Link href={`/earn${getVaultUrl(vault)}`}>
          <Button variant="primaryLargeColorful" style={{ width: '100%' }}>
            Get started
          </Button>
        </Link>
      </div>
    </Card>
  )
}
