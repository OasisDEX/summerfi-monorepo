import { type ReactNode } from 'react'
import {
  type IArmadaPosition,
  type NetworkIds,
  type RiskType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type VaultApyData,
} from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import clsx from 'clsx'

import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Risk } from '@/components/atoms/Risk/Risk'
import { Text } from '@/components/atoms/Text/Text'
import { VaultTitle } from '@/components/molecules/VaultTitle/VaultTitle'

import controlsSwitchStyles from './ControlsSwitch.module.scss'

const VaultSwitchCardDataBlock = ({ title, value }: { title: string; value?: string }) => {
  return value ? (
    <>
      <Text variant="p3semi" style={{ color: 'var(--color-text-primary-hover)' }}>
        {title}
      </Text>
      <Text variant="h5" style={{ color: 'var(--color-text-primary-hover)' }}>
        {value}
      </Text>
    </>
  ) : null
}

const VaultSwitchCard = ({
  token,
  chainId,
  risk,
  positionBalance,
  apy30d,
  apyLive,
}: {
  token: string
  positionBalance?: string
  apy30d?: number
  apyLive?: number
  risk?: RiskType
  chainId: NetworkIds
}) => {
  return (
    <Card className={clsx(controlsSwitchStyles.cardWrapper)}>
      <div className={controlsSwitchStyles.titleRow}>
        <VaultTitle symbol={token} titleVariant="h5" iconSize={32} networkId={chainId} />
        <Risk risk={risk ?? 'lower'} variant="p3semi" />
      </div>
      <div className={controlsSwitchStyles.dataRow}>
        <div className={controlsSwitchStyles.dataRowColumn}>
          <VaultSwitchCardDataBlock title="Balance" value={positionBalance} />
          <VaultSwitchCardDataBlock
            title="30d APY"
            value={apy30d ? formatDecimalAsPercent(apy30d) : 'n/a'}
          />
        </div>
        <div className={controlsSwitchStyles.dataRowColumn}>
          <VaultSwitchCardDataBlock
            title="Live APY"
            value={apyLive ? formatDecimalAsPercent(apyLive) : 'n/a'}
          />
        </div>
      </div>
    </Card>
  )
}

export const ControlsSwitch = ({
  currentPosition,
  currentVault,
  potentialVaults,
  chainId,
  vaultsApyByNetworkMap,
}: {
  currentPosition: IArmadaPosition
  currentVault: SDKVaultishType
  potentialVaults: SDKVaultsListType
  chainId: NetworkIds
  vaultsApyByNetworkMap: {
    [key: `${string}-${number}`]: VaultApyData
  }
}): ReactNode => {
  const currentVaultApy = vaultsApyByNetworkMap[`${currentVault.id}-${chainId}`]

  return (
    <div>
      <div className={controlsSwitchStyles.positionAndVaultsListWrapper}>
        <Text variant="p3semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
          Your position
        </Text>
        <VaultSwitchCard
          token={currentPosition.amount.token.symbol}
          positionBalance={`${formatCryptoBalance(currentPosition.amount.amount)} ${
            currentPosition.amount.token.symbol
          }`}
          apyLive={currentVaultApy.apy}
          risk={currentVault.customFields?.risk ?? 'lower'}
          chainId={chainId}
        />
        <div className={controlsSwitchStyles.arrowForward}>
          <Icon iconName="arrow_forward" color="#777576" size={14} />
        </div>
        <Text variant="p3semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
          Switch to a new position
        </Text>
        {potentialVaults.map((vault) => (
          <VaultSwitchCard
            key={vault.id}
            token={vault.inputToken.symbol}
            risk={vault.customFields?.risk ?? 'lower'}
            apy30d={vaultsApyByNetworkMap[`${vault.id}-${chainId}`].sma30d ?? 0}
            apyLive={
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              vaultsApyByNetworkMap[`${vault.id}-${chainId}`].apy ?? 0
            }
            chainId={chainId}
          />
        ))}
      </div>
    </div>
  )
}
