import { ProtocolMigrationAssets } from './types'
import { getDominantCollAsset } from './getDominantCollAsset'
import { PortfolioMigration, ProtocolId } from '@summerfi/serverless-shared'

export const parseEligibleMigration = ({
  debtAssets,
  collAssets,
  chainId,
  protocolId: _protocolId,
  positionAddress,
  walletAddress,
  positionAddressType,
}: ProtocolMigrationAssets): PortfolioMigration | undefined => {
  const hasOneDebtAsset = debtAssets.length === 1
  const dominantCollAsset = getDominantCollAsset(collAssets)
  const hasOneDominantCollAsset = dominantCollAsset !== undefined

  // For compatibility with the old protocol ID, we change the `AAVE_V3` to `AAVE3` (that one without 'v' inside). We can remove the condition after we change the FE behavior.
  const protocolId = _protocolId === ProtocolId.AAVE_V3 ? ProtocolId.AAVE3 : _protocolId

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
