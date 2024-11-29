// WORKAROUND: re-exporting protocol-plugins to give FE access to protocol plugins types

export {
  AaveV3LendingPoolId,
  AaveV3LendingPosition,
  AaveV3LendingPositionId,
  isAaveV3LendingPoolId,
  type IAaveV3LendingPoolId,
  AaveV3Protocol,
  type IAaveV3Protocol,
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
  type IMakerProtocol,
  type ILKType,
} from '@summerfi/protocol-plugins/plugins/maker'
export {
  MorphoLendingPoolId,
  MorphoLendingPosition,
  MorphoLendingPositionId,
  isMorphoLendingPoolId,
  type IMorphoLendingPoolId,
  MorphoProtocol,
  type IMorphoProtocol,
} from '@summerfi/protocol-plugins/plugins/morphoblue'
export {
  SparkLendingPoolId,
  SparkLendingPosition,
  SparkLendingPositionId,
  isSparkLendingPoolId,
  type ISparkLendingPoolId,
  SparkProtocol,
  type ISparkProtocol,
} from '@summerfi/protocol-plugins/plugins/spark'

// another workaround to re-export the protocol service - FE needs classes for superjson to be registered
export * from '@summerfi/armada-protocol-common'
export * from '@summerfi/armada-protocol-service'
