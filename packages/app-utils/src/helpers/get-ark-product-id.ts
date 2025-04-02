import { type ArkDetailsType, type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'

export const getArkProductId = (
  ark: SDKVaultishType['arks'][number] | SDKVaultType['arks'][number],
): string | false => {
  if (!ark.details || ark.name === 'BufferArk') {
    return false
  }
  const parsedDetails = JSON.parse(ark.details as string) as ArkDetailsType

  if (!('pool' in parsedDetails)) {
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

type ArkType = SDKVaultishType['arks'] | SDKVaultType['arks']

export const getArkProductIdList = (arks: ArkType) => {
  return arks.map(getArkProductId).filter(Boolean) as `${string}-${string}-${string}-${string}`[]
}

export const getArkByProductId = (arks: ArkType) => {
  return (productId: string): ArkType[number] | undefined => {
    return arks.find((ark) => getArkProductId(ark) === productId)
  }
}
