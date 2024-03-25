import { Percentage } from '@summerfi/sdk-common/common'
import { type ISwapManager } from '@summerfi/swap-common/interfaces'

export interface RefinanceDependencies {
    swapManager: ISwapManager
    getSummerFee: () => Percentage
}