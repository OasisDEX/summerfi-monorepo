// WORKAROUND: re-exporting protocol-plugins to give FE access to protocol plugins types

export {
  AaveV3LendingPoolId,
  AaveV3LendingPosition,
  AaveV3LendingPositionId,
  isAaveV3LendingPoolId,
  type IAaveV3LendingPoolId,
  AaveV3Protocol,
} from '@summerfi/protocol-plugins/plugins/aave-v3'
export { EmodeType } from '@summerfi/protocol-plugins/plugins/common'
export {
  MakerLendingPoolId,
  MakerLendingPosition,
  type MakerLendingPositionParameters,
  MakerLendingPositionId,
  type MakerLendingPositionIdParameters,
  isMakerLendingPoolId,
  type IMakerLendingPoolId,
  MakerProtocol,
} from '@summerfi/protocol-plugins/plugins/maker'
export {
  MorphoLendingPoolId,
  MorphoLendingPosition,
  MorphoLendingPositionId,
  isMorphoLendingPoolId,
  type IMorphoLendingPoolId,
  MorphoProtocol,
} from '@summerfi/protocol-plugins/plugins/morphoblue'
export {
  SparkLendingPoolId,
  SparkLendingPosition,
  SparkLendingPositionId,
  isSparkLendingPoolId,
  type ISparkLendingPoolId,
  SparkProtocol,
} from '@summerfi/protocol-plugins/plugins/spark'
