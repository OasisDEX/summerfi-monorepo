import { Ark, Arks } from '@summerfi/summer-earn-protocol-subgraph'

export type ArkDetailsType = {
  protocol: string
  type: string
  asset: string
  marketAsset: string
  pool: string
  chainId: number
}

export const getArkProductId = (ark: Ark) => {
  if (!ark.details || ark.name === 'BufferArk') {
    return false
  }
  const parsedDetails = JSON.parse(ark.details as string) as ArkDetailsType

  if (!('pool' in parsedDetails)) {
    return false
  }

  let { protocol } = parsedDetails

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

export const getArkProductIdList = (arks: Arks) => {
  return arks.map(getArkProductId).filter(Boolean) as `${string}-${string}-${string}-${string}`[]
}
