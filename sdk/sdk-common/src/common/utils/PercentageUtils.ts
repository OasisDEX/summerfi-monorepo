import { IPercentageData } from '../interfaces/IPercentage'

export function percentageAsFraction(percentage: IPercentageData): number {
  return percentage.value / 100
}
