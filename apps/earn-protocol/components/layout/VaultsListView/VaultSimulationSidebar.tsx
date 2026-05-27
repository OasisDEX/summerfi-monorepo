'use client'

import { VaultSimulationForm } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'

import { type VaultSimulation } from '@/components/layout/VaultsListView/use-vault-simulation'
import { VaultsInfoSidebarBlock } from '@/components/molecules/VaultsInfoSidebarBlock/VaultsInfoSidebarBlock'

type VaultSimulationSidebarProps = {
  activeVaultData: SDKVaultishType
  isMobileOrTablet: boolean
  userWalletAddress?: string
  daoManagedVaultsEnabled: boolean
  onButtonClick: (buttonId: string) => void
  simulation: VaultSimulation
}

export const VaultSimulationSidebar = ({
  activeVaultData,
  isMobileOrTablet,
  userWalletAddress,
  daoManagedVaultsEnabled,
  onButtonClick,
  simulation,
}: VaultSimulationSidebarProps) => {
  const {
    tokenBalances,
    selectedTokenOption,
    handleTokenSelectionChangeWrapper,
    tokenOptions,
    handleAmountChange,
    onFocus,
    onBlur,
    amountDisplay,
    amountDisplayUSDWithSwap,
    manualSetAmount,
    resolvedForecastAmount,
    amountParsed,
    positionExists,
    isLoading,
  } = simulation

  return (
    <>
      <VaultSimulationForm
        vaultData={activeVaultData}
        isMobileOrTablet={isMobileOrTablet}
        tokenBalance={tokenBalances.tokenBalance}
        isTokenBalanceLoading={tokenBalances.tokenBalanceLoading}
        selectedTokenOption={selectedTokenOption}
        handleTokenSelectionChange={handleTokenSelectionChangeWrapper}
        tokenOptions={tokenOptions}
        handleAmountChange={handleAmountChange}
        inputProps={{
          onFocus,
          onBlur,
          amountDisplay,
          amountDisplayUSDWithSwap,
          manualSetAmount,
        }}
        resolvedForecastAmount={resolvedForecastAmount}
        amountParsed={amountParsed}
        isEarnApp
        positionExists={Boolean(positionExists)}
        userWalletAddress={userWalletAddress}
        isLoading={isLoading}
        onButtonClick={onButtonClick}
      />
      {daoManagedVaultsEnabled && <VaultsInfoSidebarBlock />}
    </>
  )
}
