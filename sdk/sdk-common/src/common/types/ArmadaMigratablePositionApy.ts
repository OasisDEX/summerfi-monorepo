import type { IPercentage } from '../interfaces/IPercentage'

export type ArmadaMigratablePositionApy = {
  // position id
  positionId: string
  // current annual percentage yield
  apy: IPercentage | null
  // 7day SMA annual percentage yield
  apy7d: IPercentage | null
  // 30day SMA annual percentage yield
  apy30d: IPercentage | null
}
