import { IPercentage } from '../interfaces/IPercentage'

export function percentageAsFraction(percentage: IPercentage): number {
  return percentage.value / 100
}
