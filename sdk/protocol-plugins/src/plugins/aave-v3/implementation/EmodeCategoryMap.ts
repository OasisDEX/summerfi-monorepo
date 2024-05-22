import { EmodeType } from '../../common/enums/EmodeType'

// TODO: this is only correct for Mainnet, each network has its own category map

export const aaveV3EmodeCategoryMap: Record<EmodeType, number> = Object.keys(EmodeType).reduce<
  Record<EmodeType, number>
>(
  (accumulator, key, index) => {
    accumulator[EmodeType[key as keyof typeof EmodeType]] = index
    return accumulator
  },
  {} as Record<EmodeType, number>,
)
