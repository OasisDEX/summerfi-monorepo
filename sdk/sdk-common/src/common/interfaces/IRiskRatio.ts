import { IPercentage } from './IPercentage'

export enum RiskRatioType {
  LTV = 'LTV',
  CollateralizationRatio = 'CollateralizationRatio',
  Multiple = 'Multiple',
}

export interface IRiskRatio {
  type: RiskRatioType
  ratio: IPercentage
}
