import type { ArmadaMigrationType } from '../enums'
import type { IFiatCurrencyAmount, IPercentage, ITokenAmount } from '../interfaces'

export type ArmadaMigratablePositionApy = {
  // position id
  positionId: string
  // current annual percentage yield
  apy: IPercentage | null
  // 7day average annual percentage yield
  apy7d: IPercentage | null
}
