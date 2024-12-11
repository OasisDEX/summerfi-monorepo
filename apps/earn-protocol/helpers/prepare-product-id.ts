import { type ArkDetailsType, type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'

export const getArkProductId = (
  ark: SDKVaultishType['arks'][number] | SDKVaultType['arks'][number],
) => {
  if (!ark.details) {
    return false
  }
  const parsedDetails = JSON.parse(ark.details as string) as ArkDetailsType

  if (!parsedDetails) {
    return false
  }

  let { protocol } = parsedDetails

  // TODO: Hardcoded values, update when arks are redeployed!!
  if (protocol === 'gearbox') {
    protocol = 'Gearbox'
  }
  if (protocol === 'fluid') {
    protocol = 'Fluid'
  }
  const assetAddress = ark.inputToken.id.toLowerCase()
  const poolAddress = parsedDetails.pool.toLowerCase()
  const chainId = String(parsedDetails.chainId).toLowerCase()

  return `${protocol}-${assetAddress}-${poolAddress}-${chainId}`
}

export const getArkProductIdList = (arks: SDKVaultishType['arks'] | SDKVaultType['arks']) => {
  return arks.map(getArkProductId).filter(Boolean) as `${string}-${string}-${string}-${string}`[]
}

export const getArkByProductId = (arks: SDKVaultishType['arks'] | SDKVaultType['arks']) => {
  return (productId: string) => {
    return arks.find((ark) => getArkProductId(ark) === productId)
  }
}
