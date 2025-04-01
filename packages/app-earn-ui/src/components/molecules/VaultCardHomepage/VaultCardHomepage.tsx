import { type ReactNode } from 'react'
import { type IconNamesList, type SDKVaultishType, type VaultApyData } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  subgraphNetworkToId,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { capitalize } from 'lodash-es'

import { AdditionalBonusLabel } from '@/components/atoms/AdditionalBonusLabel/AdditionalBonusLabel'
import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { VaultTitle } from '@/components/molecules/VaultTitle/VaultTitle'
import { getDisplayToken } from '@/helpers/get-display-token'
import { riskColors } from '@/helpers/risk-colors'

import vaultCardHomepageStyles from './VaultCardHomepage.module.scss'

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
      <div style={{ display: 'flex' }}>
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
            style={{ color: 'var(--earn-protocol-secondary-40)', margin: '1.5px 0 0 1px' }}
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

type VaultCardHomepageProps = {
  vault: SDKVaultishType
  vaultsApyByNetworkMap: {
    [key: `${string}-${number}`]: VaultApyData
  }
  selected?: boolean
  onSelect?: () => void
}

export const VaultCardHomepage = ({
  vault,
  vaultsApyByNetworkMap,
  selected = true,
  onSelect,
}: VaultCardHomepageProps) => {
  const { apy } =
    vaultsApyByNetworkMap[`${vault.id}-${subgraphNetworkToId(vault.protocol.network)}`]
  const parsedApy = formatDecimalAsPercent(apy)
  const parsedTotalValueLocked = formatCryptoBalance(
    new BigNumber(String(vault.inputTokenBalance)).div(ten.pow(vault.inputToken.decimals)),
  )
  const parsedTotalValueLockedUSD = formatCryptoBalance(
    new BigNumber(String(vault.totalValueLockedUSD)),
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
          <VaultTitle
            symbol={vault.inputToken.symbol}
            networkName={vault.protocol.network}
            isVaultCard
          />
          <AdditionalBonusLabel bonus={vault.customFields?.bonus} />
        </div>
        <div className={vaultCardHomepageStyles.vaultCardHomepageDatablocksWrapper}>
          <div className={vaultCardHomepageStyles.vaultCardHomepageDataRow}>
            <DataBlock
              title="Total assets"
              primary
              contentDesktop={
                <div style={{ display: 'flex' }}>
                  <Text variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                    {parsedTotalValueLocked}&nbsp;{getDisplayToken(vault.inputToken.symbol)}
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
                    {parsedTotalValueLocked}&nbsp;{getDisplayToken(vault.inputToken.symbol)}
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
                <Text variant="p1colorful" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
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
                  {vault.customFields?.bestFor ?? 'Optimized lending yield'}
                </Text>
              }
              contentMobile={
                <Text variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                  {vault.customFields?.bestFor ?? 'Optimized lending yield'}
                </Text>
              }
            />
            <DataBlock
              title="Risk"
              titleIcon="clock"
              contentDesktop={
                <Text
                  variant="p1semi"
                  style={{ color: riskColors[vault.customFields?.risk ?? 'lower'] }}
                >
                  {capitalize(vault.customFields?.risk ?? 'lower')} risk
                </Text>
              }
              contentMobile={
                <Text
                  variant="p2semi"
                  style={{ color: riskColors[vault.customFields?.risk ?? 'lower'] }}
                >
                  {capitalize(vault.customFields?.risk ?? 'lower')} risk
                </Text>
              }
            />
          </div>
        </div>
        <Button variant="primaryLargeColorful">Get started</Button>
      </div>
    </Card>
  )
}
