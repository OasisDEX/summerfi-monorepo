import { ProtocolId } from '@summerfi/serverless-shared'

// do not use this, its just for backwards compatibility
export enum LendingProtocol {
  AaveV2 = 'aavev2',
  AaveV3 = 'aavev3',
  Ajna = 'ajna',
  Maker = 'maker',
  MorphoBlue = 'morphoblue',
  SparkV3 = 'sparkv3',
}

// do not use this, its just for backwards compatibility!!!
export const lendingProtocolMap = {
  [ProtocolId.AAVE_V2]: LendingProtocol.AaveV2,
  [ProtocolId.AAVE_V3]: LendingProtocol.AaveV3,
  [ProtocolId.AJNA]: LendingProtocol.Ajna,
  [ProtocolId.MAKER]: LendingProtocol.Maker,
  [ProtocolId.MORPHO_BLUE]: LendingProtocol.MorphoBlue,
  [ProtocolId.SPARK]: LendingProtocol.SparkV3,
}
