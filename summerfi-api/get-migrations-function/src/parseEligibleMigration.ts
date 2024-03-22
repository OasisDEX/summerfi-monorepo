import { ProtocolMigrationAssets } from './types'
import { getDominantCollAsset } from './getDominantCollAsset'
import { PortfolioMigration } from '@summerfi/serverless-shared'

export const parseEligibleMigration = ({
  debtAssets,
  collAssets,
  chainId,
  protocolId,
  positionAddress,
  walletAddress,
  positionAddressType,
}: ProtocolMigrationAssets): PortfolioMigration | undefined => {
  const hasOneDebtAsset = debtAssets.length === 1
  const dominantCollAsset = getDominantCollAsset(collAssets)
  const hasOneDominantCollAsset = dominantCollAsset !== undefined

  if (hasOneDebtAsset && hasOneDominantCollAsset) {
    return {
      chainId,
      protocolId,
      debtAsset: debtAssets[0],
      collateralAsset: dominantCollAsset,
      positionAddress,
      walletAddress,
      positionAddressType,
    }
  }
  return undefined
}
