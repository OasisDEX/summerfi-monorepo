// WORKAROUND: re-exporting protocol-plugins to give FE access to protocol plugins types
export { Chain } from './implementation/Chain'
export { ChainsManagerClient } from './implementation/ChainsManager'
export { makeSDK } from './implementation/MakeSDK'
export { PortfolioManager } from './implementation/PortfolioManager'
export { ProtocolsManagerClient } from './implementation/ProtocolsManagerClient'
export { SDKManager } from './implementation/SDKManager'
export { TokensManagerClient } from './implementation/TokensManagerClient'
export { UserClient } from './implementation/UserClient'
export { UsersManager } from './implementation/UsersManager'
export type { IArmadaManagerClient } from './interfaces/ArmadaManager/IArmadaManagerClient'
export type { IChain } from './interfaces/IChain'
export type { IChainsManagerClient } from './interfaces/IChainsManager'
export type { IProtocolsManagerClient } from './interfaces/IProtocolsManagerClient'
export type { IPortfolioManager } from './interfaces/IPortfolioManager'
export type { ISDKManager } from './interfaces/ISDKManager'
export type { ITokensManagerClient } from './interfaces/ITokensManagerClient'
export type { IUserClient } from './interfaces/IUserClient'
export type { IUsersManager } from './interfaces/IUsersManager'
export { PositionUtils } from './utils/PositionUtils'
export {
  AaveV3LendingPoolId,
  AaveV3LendingPosition,
  AaveV3LendingPositionId,
  isAaveV3LendingPoolId,
  type IAaveV3LendingPoolId,
  AaveV3Protocol,
  type IAaveV3Protocol,
  EmodeType,
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
  MorphoLendingPoolId,
  MorphoLendingPosition,
  MorphoLendingPositionId,
  isMorphoLendingPoolId,
  type IMorphoLendingPoolId,
  MorphoProtocol,
  type IMorphoProtocol,
  SparkLendingPoolId,
  SparkLendingPosition,
  SparkLendingPositionId,
  isSparkLendingPoolId,
  type ISparkLendingPoolId,
  SparkProtocol,
  type ISparkProtocol,
} from '@summerfi/protocol-plugins'
