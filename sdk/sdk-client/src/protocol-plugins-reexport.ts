// WORKAROUND: re-exporting protocol-plugins to give FE access to protocol plugins types

export {
  MakerLendingPoolId,
  MakerPosition,
  MakerPositionId,
  isMakerLendingPoolId,
} from '@summerfi/protocol-plugins/plugins/maker'
export {
  SparkLendingPoolId,
  SparkPosition,
  SparkPositionId,
  isSparkLendingPoolId,
} from '@summerfi/protocol-plugins/plugins/spark'
export {
  AaveV3LendingPoolId,
  AaveV3Position,
  AaveV3PositionId,
  isAaveV3LendingPoolId,
} from '@summerfi/protocol-plugins/plugins/aave-v3'
export {
  MorphoLendingPoolId,
  MorphoPosition,
  MorphoPositionId,
  isMorphoLendingPoolId,
} from '@summerfi/protocol-plugins/plugins/morphoblue'
export { EmodeType } from '@summerfi/protocol-plugins/plugins/common'
