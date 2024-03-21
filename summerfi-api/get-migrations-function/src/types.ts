import {
  Address,
  ChainId,
  PortfolioMigrationAddressType,
  PortfolioMigrationAsset,
  ProtocolId,
} from '@summerfi/serverless-shared/domain-types'

export type ProtocolMigrationAssets = {
  debtAssets: PortfolioMigrationAsset[]
  collAssets: PortfolioMigrationAsset[]
  chainId: ChainId
  protocolId: ProtocolId
  positionAddress: Address
  walletAddress: Address
  positionAddressType: PortfolioMigrationAddressType
}
