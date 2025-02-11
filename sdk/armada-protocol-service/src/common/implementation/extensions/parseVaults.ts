import { GetVaultsQuery, GetVaultQuery } from '@summerfi/subgraph-manager-common'

// changes ETH to WETH for the vault token symbols
const changeWethToEth = (vault: GetVaultsQuery['vaults'][number] | GetVaultQuery['vault']) => {
  return vault
    ? {
        ...vault,
        inputToken: {
          ...vault.inputToken,
          symbol: vault.inputToken.symbol === 'WETH' ? 'ETH' : vault.inputToken.symbol,
        },
      }
    : {}
}

export const parseVaults = ({ vaults }: GetVaultsQuery) => {
  return {
    vaults: vaults.map(changeWethToEth),
  } as GetVaultsQuery
}

export const parseVault = (vault: GetVaultQuery) => {
  return {
    vault: changeWethToEth(vault.vault),
  } as GetVaultQuery
}
