import { EmodeType } from '@summerfi/sdk-common/protocols'

export const sparkEmodeCategoryMap: Record<EmodeType, bigint> = Object.keys(EmodeType).reduce<
  Record<EmodeType, bigint>
>(
  (accumulator, key, index) => {
    accumulator[EmodeType[key as keyof typeof EmodeType]] = BigInt(index)
    return accumulator
  },
  {} as Record<EmodeType, bigint>,
)
