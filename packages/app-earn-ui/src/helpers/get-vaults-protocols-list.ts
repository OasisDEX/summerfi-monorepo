import { type SDKVaultsListType } from '@summerfi/app-types'

import { getArkNiceName } from '@/helpers/get-ark-nice-name'

/**
 * Extracts and returns a unique list of protocol names from a list of vaults
 *
 * This function processes vault data to extract protocol names from ark configurations,
 * handling special cases for different protocol naming patterns:
 * - ERC4626 protocols (e.g., "ERC4626-Euler_Prime-usdc-1" -> "Euler Prime")
 * - Morpho Vaults (e.g., "MorphoVault-usdc-Flagship_USDC-1" -> "Morpho Flagship")
 * - Standard protocols (e.g., "AaveV3-usdc-1" -> "AaveV3")
 *
 * @param vaultsList - List of vaults containing ark configurations
 * @returns An array of unique protocol names
 */
export const getVaultsProtocolsList = (vaultsList: SDKVaultsListType): string[] => {
  return [
    ...new Set(
      vaultsList.reduce<string[]>(
        (acc, { arks }) => [
          // converting a list which looks like `protocolName-token-chainId`
          // into a unique list of protocols for all vaults
          ...acc,
          ...arks
            .map((ark) => {
              return getArkNiceName(ark, acc)
            })
            .filter((arkName): arkName is string => Boolean(arkName)),
        ],
        [],
      ),
    ),
  ]
}
