import { AddressValue, Price } from '@summerfi/sdk-common/common'

export type ISpotPriceMapRecord = Record<AddressValue, Price>

export interface ISpotPriceMap {
  record: ISpotPriceMapRecord
}
