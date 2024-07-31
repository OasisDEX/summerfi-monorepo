import {
  AaveV3LendingPosition,
  AaveV3LendingPositionId,
  isAaveV3LendingPool,
} from '@summerfi/protocol-plugins/plugins/aave-v3'
import {
  MakerLendingPosition,
  MakerLendingPositionId,
  isMakerLendingPool,
} from '@summerfi/protocol-plugins/plugins/maker'
import {
  MorphoLendingPosition,
  MorphoLendingPositionId,
  isMorphoLendingPool,
} from '@summerfi/protocol-plugins/plugins/morphoblue'
import {
  SparkLendingPosition,
  SparkLendingPositionId,
  isSparkLendingPool,
} from '@summerfi/protocol-plugins/plugins/spark'
import { TokenAmount } from '@summerfi/sdk-common'
import { ProtocolName } from '@summerfi/sdk-common/common'
import {
  ILendingPool,
  ILendingPosition,
  LendingPositionType,
} from '@summerfi/sdk-common/lending-protocols'

export function getTargetPosition(params: {
  sourcePosition: ILendingPosition
  targetPool: ILendingPool
}): ILendingPosition {
  switch (params.targetPool.id.protocol.name) {
    case ProtocolName.Maker:
      if (!isMakerLendingPool(params.targetPool)) {
        throw new Error('Pool is not MakerLendingPool')
      }

      return MakerLendingPosition.createFrom({
        subtype: LendingPositionType.Multiply,
        id: MakerLendingPositionId.createFrom({ id: '0987654321', vaultId: '123' }),
        pool: params.targetPool,
        debtAmount: TokenAmount.createFrom({
          amount: params.sourcePosition.debtAmount.amount,
          token: params.targetPool.debtToken,
        }),
        collateralAmount: TokenAmount.createFrom({
          amount: params.sourcePosition.collateralAmount.amount,
          token: params.targetPool.collateralToken,
        }),
      })
    case ProtocolName.AaveV3:
      if (!isAaveV3LendingPool(params.targetPool)) {
        throw new Error('Pool is not MakerLendingPool')
      }

      return AaveV3LendingPosition.createFrom({
        subtype: LendingPositionType.Multiply,
        id: AaveV3LendingPositionId.createFrom({ id: '0987654321' }),
        pool: params.targetPool,
        debtAmount: TokenAmount.createFrom({
          amount: params.sourcePosition.debtAmount.amount,
          token: params.targetPool.debtToken,
        }),
        collateralAmount: TokenAmount.createFrom({
          amount: params.sourcePosition.collateralAmount.amount,
          token: params.targetPool.collateralToken,
        }),
      })
    case ProtocolName.Spark:
      if (!isSparkLendingPool(params.targetPool)) {
        throw new Error('Pool is not MakerLendingPool')
      }

      return SparkLendingPosition.createFrom({
        subtype: LendingPositionType.Multiply,
        id: SparkLendingPositionId.createFrom({ id: '0987654321' }),
        pool: params.targetPool,
        debtAmount: TokenAmount.createFrom({
          amount: params.sourcePosition.debtAmount.amount,
          token: params.targetPool.debtToken,
        }),
        collateralAmount: TokenAmount.createFrom({
          amount: params.sourcePosition.collateralAmount.amount,
          token: params.targetPool.collateralToken,
        }),
      })
    case ProtocolName.MorphoBlue:
      if (!isMorphoLendingPool(params.targetPool)) {
        throw new Error('Pool is not MakerLendingPool')
      }

      return MorphoLendingPosition.createFrom({
        subtype: LendingPositionType.Multiply,
        id: MorphoLendingPositionId.createFrom({ id: '0987654321' }),
        pool: params.targetPool,
        debtAmount: TokenAmount.createFrom({
          amount: params.sourcePosition.debtAmount.amount,
          token: params.targetPool.debtToken,
        }),
        collateralAmount: TokenAmount.createFrom({
          amount: params.sourcePosition.collateralAmount.amount,
          token: params.targetPool.collateralToken,
        }),
      })
    default:
      throw new Error('Protocol not supported')
  }
}
