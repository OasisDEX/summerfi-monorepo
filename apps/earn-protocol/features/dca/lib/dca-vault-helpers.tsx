import { VaultTitleDropdownContent } from '@summerfi/app-earn-ui'
import { type DropdownRawOption, type SDKVaultishType } from '@summerfi/app-types'

import { ETH_TOKEN_SYMBOLS, STABLE_TOKEN_SYMBOLS } from '@/features/dca/lib/dca-wizard-constants'

import classNames from '@/features/dca/components/dca.module.css'

export const getVaultUniqueId = (vault: SDKVaultishType): string =>
  `${vault.id}-${vault.protocol.network}-${vault.isDaoManaged ? 'dao' : 'ba'}`

export const getVaultSymbol = (vault: SDKVaultishType): string =>
  vault.inputToken.symbol.toUpperCase()

export const isStablecoinVault = (vault: SDKVaultishType): boolean => {
  const symbol = getVaultSymbol(vault)

  return STABLE_TOKEN_SYMBOLS.some((allowedSymbol) => allowedSymbol === symbol)
}

export const isEthVault = (vault: SDKVaultishType): boolean => {
  const symbol = getVaultSymbol(vault)

  return ETH_TOKEN_SYMBOLS.some((allowedSymbol) => allowedSymbol === symbol)
}

export const isEligibleDcaVault = (vault: SDKVaultishType): boolean =>
  isStablecoinVault(vault) || isEthVault(vault)

export const getVaultRole = (vault: SDKVaultishType): 'stable' | 'eth' | null => {
  if (isStablecoinVault(vault)) return 'stable'
  if (isEthVault(vault)) return 'eth'

  return null
}

export const dedupeVaults = (vaults: SDKVaultishType[]): SDKVaultishType[] => {
  const seen = new Map<string, SDKVaultishType>()

  for (const vault of vaults) {
    const uniqueId = getVaultUniqueId(vault)

    if (!seen.has(uniqueId)) {
      seen.set(uniqueId, vault)
    }
  }

  return [...seen.values()]
}

export const mapVaultToOption = (vault: SDKVaultishType): DropdownRawOption => ({
  value: getVaultUniqueId(vault),
  content: <VaultTitleDropdownContent vault={vault} isDaoManaged={vault.isDaoManaged} />,
})

export const makeDropdownOptions = (vaults: SDKVaultishType[]): DropdownRawOption[] => {
  const regularVaults = vaults.filter((vault) => !vault.isDaoManaged && !vault.isRwaVault)
  const daoManagedVaults = vaults.filter((vault) => vault.isDaoManaged)
  const rwaVaults = vaults.filter((vault) => vault.isRwaVault)

  return [
    ...(daoManagedVaults.length > 0
      ? [
          {
            value: 'dao-managed-vaults',
            content: (
              <div className={classNames.vaultDropdownSeparator}>DAO Risk-Managed Vaults</div>
            ),
            isSeparator: true,
          },
          ...daoManagedVaults.map(mapVaultToOption),
        ]
      : []),
    ...(regularVaults.length > 0
      ? [
          {
            value: 'other-vaults',
            content: (
              <div className={classNames.vaultDropdownSeparator}>
                Risk-Managed by Block Analitica
              </div>
            ),
            isSeparator: true,
          },
          ...regularVaults.map(mapVaultToOption),
        ]
      : []),
    ...(rwaVaults.length > 0
      ? [
          {
            value: 'permissioned-rwa-vaults',
            content: (
              <div className={classNames.vaultDropdownSeparator}>Permissioned RWA Vaults</div>
            ),
            isSeparator: true,
          },
          ...rwaVaults.map(mapVaultToOption),
        ]
      : []),
  ]
}
