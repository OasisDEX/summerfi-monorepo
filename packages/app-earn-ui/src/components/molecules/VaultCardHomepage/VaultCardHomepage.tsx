import { type ReactNode } from 'react'
import { type IconNamesList, type SDKVaultishType, type VaultApyData } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  subgraphNetworkToId,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
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

type VaultCardHomepageProps = {
  vault: SDKVaultishType
  vaultsApyByNetworkMap: {
    [key: `${string}-${number}`]: VaultApyData
  }
}

const DataBlock = ({
  title,
  content,
  primary = false,
  titleIcon,
}: {
  title: string
  titleIcon?: IconNamesList
  content: ReactNode
  primary?: boolean
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
        {title}
        {titleIcon ? <Icon iconName={titleIcon} size={16} /> : null}
      </Text>
      <div
        className={
          primary ? vaultCardHomepageStyles.dataPrimary : vaultCardHomepageStyles.dataSecondary
        }
      >
        {content}
      </div>
    </div>
  )
}

export const VaultCardHomepage = ({ vault, vaultsApyByNetworkMap }: VaultCardHomepageProps) => {
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
    <div className={vaultCardHomepageStyles.vaultCardHomepageWrapper}>
      <Card
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--general-space-32)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <VaultTitle
            symbol={vault.inputToken.symbol}
            networkName={vault.protocol.network}
            isVaultCard
          />
          <AdditionalBonusLabel bonus={vault.customFields?.bonus} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 'var(--general-space-32)',
            width: '100%',
          }}
        >
          <div className={vaultCardHomepageStyles.vaultCardHomepageDataRow}>
            <DataBlock
              title="Total assets"
              primary
              content={
                <>
                  <Text variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                    {parsedTotalValueLocked}&nbsp;{getDisplayToken(vault.inputToken.symbol)}
                  </Text>
                  <Text variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
                    ${parsedTotalValueLockedUSD}
                  </Text>
                </>
              }
            />
            <DataBlock
              title="APY"
              titleIcon="stars"
              content={
                <Text variant="p1colorful" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                  {parsedApy}
                </Text>
              }
            />
          </div>
          <div className={vaultCardHomepageStyles.vaultCardHomepageDataRow}>
            <DataBlock
              title="Best for"
              primary
              content={
                <Text variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                  {vault.customFields?.bestFor ?? 'Optimized lending yield'}
                </Text>
              }
            />
            <DataBlock
              title="Risk"
              titleIcon="clock"
              content={
                <Text
                  variant="p1semi"
                  style={{ color: riskColors[vault.customFields?.risk ?? 'lower'] }}
                >
                  {capitalize(vault.customFields?.risk ?? 'lower')} risk
                </Text>
              }
            />
          </div>
        </div>
        <Button variant="primaryLargeColorful">Get started</Button>
      </Card>
    </div>
  )
}
