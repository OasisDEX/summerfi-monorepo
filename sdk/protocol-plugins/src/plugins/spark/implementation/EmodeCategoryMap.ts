import { EmodeType } from '../../common/enums/EmodeType'

// TODO: this is only correct for Mainnet, each network has its own category map

export const sparkEmodeCategoryMap: Record<EmodeType, number> = {
  [EmodeType.None]: 0,
  [EmodeType.ETHCorrelated]: 1,
  [EmodeType.Stablecoins]: 2,
}
