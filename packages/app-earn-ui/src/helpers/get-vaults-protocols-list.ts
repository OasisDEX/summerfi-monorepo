import { type SDKVaultsListType } from '@summerfi/app-types'

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
              if (ark.name === 'BufferArk' || !ark.name) {
                return null
              }

              const arkNameArray = ark.name.split('-')

              // special case for ERC4626
              if (ark.name.startsWith('ERC4626')) {
                // examples
                // ERC4626-Euler_Prime-usdc-1
                // ERC4626-Gearbox-weth-1
                return `${arkNameArray[1]}`.replaceAll(/_+/gu, ' ')
              }
              // special case for MorphoVault
              if (ark.name.startsWith('MorphoVault')) {
                // examples
                // MorphoVault-usdc-Flagship_USDC-1
                // MorphoVault-weth-Steakhouse_WETH-1
                const morphoArkName = `Morpho ${arkNameArray[2].split('_')[0]}`

                if (
                  acc.filter((item) => item.toLowerCase() === morphoArkName.toLowerCase()).length >
                  0
                ) {
                  return false
                }

                return morphoArkName
              }

              // the rest should be like this:
              // AaveV3-usdc-1
              // CompoundV3-usdt-1
              // Spark-weth-1
              return arkNameArray[0]
            })
            .filter((arkName): arkName is string => Boolean(arkName)),
        ],
        [],
      ),
    ),
  ]
}
