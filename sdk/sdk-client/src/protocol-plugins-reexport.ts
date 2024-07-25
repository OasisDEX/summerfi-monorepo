// WORKAROUND: re-exporting protocol-plugins to give FE access to protocol plugins types

export {
  AaveV3LendingPoolId,
  AaveV3LendingPosition,
  AaveV3LendingPositionId,
  isAaveV3LendingPoolId,
  type IAaveV3LendingPoolId,
} from '@summerfi/protocol-plugins/plugins/aave-v3'
export { EmodeType } from '@summerfi/protocol-plugins/plugins/common'
export {
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  isMakerLendingPoolId,
  type IMakerLendingPoolId,
} from '@summerfi/protocol-plugins/plugins/maker'
export {
  MorphoLendingPoolId,
  MorphoLendingPosition,
  MorphoLendingPositionId,
  isMorphoLendingPoolId,
  type IMorphoLendingPoolId,
} from '@summerfi/protocol-plugins/plugins/morphoblue'
export {
  SparkLendingPoolId,
  SparkLendingPosition,
  SparkLendingPositionId,
  isSparkLendingPoolId,
  type ISparkLendingPoolId,
} from '@summerfi/protocol-plugins/plugins/spark'
