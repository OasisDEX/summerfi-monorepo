import { type SDKVaultishType } from '@summerfi/app-types'

export const getArkNiceName = (
  ark: SDKVaultishType['arks'][number],
  acc?: string[],
): string | null | false => {
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
      (acc ?? []).filter((item) => item.toLowerCase() === morphoArkName.toLowerCase()).length > 0
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
}
