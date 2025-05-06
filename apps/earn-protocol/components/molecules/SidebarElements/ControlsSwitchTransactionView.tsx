import { useMemo } from 'react'
import { GradientBox, Icon, Text } from '@summerfi/app-earn-ui'
import {
  type SDKChainId,
  type SDKVaultishType,
  type TokenSymbolsList,
  type VaultApyData,
} from '@summerfi/app-types'
import { formatDecimalAsPercent, subgraphNetworkToSDKId } from '@summerfi/app-utils'
import clsx from 'clsx'
import { capitalize } from 'lodash-es'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'

import controlsSwitchTransactionViewStyles from './ControlsSwitchTransactionView.module.scss'

const VaultBoxContent = ({
  title,
  tokenName,
  chainId,
  risk,
  apy,
}: {
  title: string
  tokenName: TokenSymbolsList
  chainId: SDKChainId
  risk: string
  apy?: number
}) => (
  <>
    <Text variant="p4semi" className={controlsSwitchTransactionViewStyles.vaultBoxFromTo}>
      {title}
    </Text>
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      <Icon tokenName={tokenName} size={44} />
      <div style={{ position: 'absolute', top: '-3px', left: '-3px' }} data-testid="vault-network">
        {networkSDKChainIdIconMap(chainId)}
      </div>
    </div>
    <Text variant="h5" style={{ color: 'var(--color-text-primary)' }}>
      {tokenName}
    </Text>
    <Text variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
      {capitalize(risk)} Risk
    </Text>
    <div className={controlsSwitchTransactionViewStyles.divider} />
    {apy && (
      <Text variant="p4semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
        Live&nbsp;APY:&nbsp;{formatDecimalAsPercent(apy)}
      </Text>
    )}
  </>
)

type ControlsSwitchTransactionViewProps = {
  currentVault: SDKVaultishType
  vaultsList: SDKVaultishType[]
  selectedSwitchVault: `${string}-${number}`
  vaultsApyByNetworkMap: {
    [key: `${string}-${number}`]: VaultApyData
  }
}

export const ControlsSwitchTransactionView = ({
  currentVault,
  vaultsList,
  selectedSwitchVault,
  vaultsApyByNetworkMap,
}: ControlsSwitchTransactionViewProps) => {
  const vaultChainId = subgraphNetworkToSDKId(currentVault.protocol.network)
  const selectedVault = useMemo(() => {
    const [selectedVaultId] = selectedSwitchVault.split('-')

    return vaultsList.find((vault) => vault.id === selectedVaultId) as SDKVaultishType
  }, [selectedSwitchVault, vaultsList])

  const currentLiveApy = vaultsApyByNetworkMap[`${currentVault.id}-${vaultChainId}`].apy
  const selectedLiveApy = vaultsApyByNetworkMap[`${selectedVault.id}-${vaultChainId}`].apy

  return (
    <div className={controlsSwitchTransactionViewStyles.vaultsWrapper}>
      <div
        className={clsx(
          controlsSwitchTransactionViewStyles.vaultBox,
          controlsSwitchTransactionViewStyles.vaultBoxCurrent,
        )}
      >
        <VaultBoxContent
          title="From"
          chainId={vaultChainId}
          tokenName={currentVault.inputToken.symbol.toUpperCase() as TokenSymbolsList}
          risk={capitalize(currentVault.customFields?.risk ?? 'Lower')}
          apy={currentLiveApy}
        />
      </div>
      <div className={controlsSwitchTransactionViewStyles.arrowBox}>
        <Icon iconName="arrow_forward" size={20} />
      </div>
      <GradientBox selected style={{ cursor: 'initial' }}>
        <div className={clsx(controlsSwitchTransactionViewStyles.vaultBox)}>
          <VaultBoxContent
            title="To"
            chainId={vaultChainId}
            tokenName={selectedVault.inputToken.symbol.toUpperCase() as TokenSymbolsList}
            risk={capitalize(selectedVault.customFields?.risk ?? 'Lower')}
            apy={selectedLiveApy}
          />
        </div>
      </GradientBox>
    </div>
  )
}
