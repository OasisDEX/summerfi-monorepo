// WORKAROUND: re-exporting protocol-plugins to give FE access to protocol plugins types

export {
  MakerLendingPoolId,
  MakerPosition,
  MakerPositionId,
} from '@summerfi/protocol-plugins/plugins/maker'
export {
  SparkLendingPoolId,
  SparkPosition,
  SparkPositionId,
} from '@summerfi/protocol-plugins/plugins/spark'
export {
  AaveV3LendingPoolId,
  AaveV3Position,
  AaveV3PositionId,
} from '@summerfi/protocol-plugins/plugins/aave-v3'
export {
  MorphoLendingPoolId,
  MorphoPosition,
  MorphoPositionId,
} from '@summerfi/protocol-plugins/plugins/morphoblue'
export { EmodeType } from '@summerfi/protocol-plugins/plugins/common'
