import { type FC } from 'react'
import { Card, Dropdown, Icon, Text } from '@summerfi/app-earn-ui'
import {
  type DropdownRawOption,
  type SDKVaultishType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { subgraphNetworkToSDKId, supportedSDKNetwork } from '@summerfi/app-utils'

import { VaultSwitchBox } from '@/components/molecules/SidebarElements/VaultSwitchBox'
import { DCAWizardStepCard } from '@/features/dca/components/DCAWizard/DCAWizardStepCard'

import classNames from '@/features/dca/components/dca.module.css'

interface StepVaultSelectorProps {
  hasEligiblePair: boolean
  sourceVault: SDKVaultishType
  targetVault: SDKVaultishType
  sourceOptions: DropdownRawOption[]
  targetOptions: DropdownRawOption[]
  selectedSource: DropdownRawOption
  selectedTarget: DropdownRawOption
  pairError: string | null
  onSelectVault: (side: 'source' | 'target', option: DropdownRawOption) => void
  onSwapVaults: () => void
}

export const StepVaultSelector: FC<StepVaultSelectorProps> = ({
  hasEligiblePair,
  sourceVault,
  targetVault,
  sourceOptions,
  targetOptions,
  selectedSource,
  selectedTarget,
  pairError,
  onSelectVault,
  onSwapVaults,
}) => {
  return (
    <DCAWizardStepCard title="Step 2 - Choose your Starting and Target Vault">
      <div className={classNames.vaultSelectorRow}>
        <div
          className={`${classNames.vaultSelectorContent} ${classNames.vaultSelectorContentSource}`}
        >
          {!hasEligiblePair ? (
            <Text as="p" variant="p3">
              No eligible ETH and stablecoin vault pair is available on this network yet.
            </Text>
          ) : (
            <Dropdown
              asCard
              noArrow
              options={sourceOptions}
              dropdownValue={selectedSource}
              onChange={(option) => onSelectVault('source', option)}
              dropdownWrapperClassName={`${classNames.vaultDropdownWrapper} ${classNames.vaultDropdownWrapperFrom}`}
              dropdownSelectedClassName={classNames.vaultDropdownWrapperFrom}
            >
              <VaultSwitchBox
                title="From"
                chainId={subgraphNetworkToSDKId(supportedSDKNetwork(sourceVault.protocol.network))}
                tokenName={sourceVault.inputToken.symbol as TokenSymbolsList}
                risk={
                  sourceVault.isDaoManaged ? 'higher' : (sourceVault.customFields?.risk ?? 'lower')
                }
                wrapperStyle={{ background: 'transparent' }}
                isDaoManaged={sourceVault.isDaoManaged}
              />
            </Dropdown>
          )}
        </div>

        <button
          type="button"
          onClick={onSwapVaults}
          className={classNames.vaultSelectorBridge}
          aria-label="Swap vaults"
          title="Swap vaults"
        >
          <Icon iconName="arrow_forward" size={20} />
        </button>

        <div className={classNames.vaultSelectorContent}>
          {!hasEligiblePair ? (
            <Text as="p" variant="p3">
              No eligible ETH and stablecoin vault pair is available on this network yet.
            </Text>
          ) : (
            <Dropdown
              asCard
              noArrow
              options={targetOptions}
              dropdownValue={selectedTarget}
              onChange={(option) => onSelectVault('target', option)}
              dropdownWrapperClassName={`${classNames.vaultDropdownWrapper} ${classNames.vaultDropdownWrapperTo}`}
              dropdownSelectedClassName={classNames.vaultDropdownWrapper}
            >
              <VaultSwitchBox
                title="To"
                chainId={subgraphNetworkToSDKId(supportedSDKNetwork(targetVault.protocol.network))}
                tokenName={targetVault.inputToken.symbol as TokenSymbolsList}
                wrapperStyle={{ background: 'transparent' }}
                risk={
                  targetVault.isDaoManaged ? 'higher' : (targetVault.customFields?.risk ?? 'lower')
                }
                isDaoManaged={targetVault.isDaoManaged}
              />
            </Dropdown>
          )}
        </div>
      </div>
      {pairError ? (
        <Card variant="cardWarning">
          <Text as="p" variant="p3">
            {pairError}
          </Text>
        </Card>
      ) : null}
    </DCAWizardStepCard>
  )
}
