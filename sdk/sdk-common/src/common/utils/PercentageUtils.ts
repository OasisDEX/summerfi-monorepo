import { Percentage } from "../implementation/Percentage";

export function percentageAsFraction(percentage: Percentage): number {
  return percentage.value / 100
}