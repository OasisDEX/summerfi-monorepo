import { AddressValue } from '@summerfi/sdk-common'

export type AAVEv3LikeAbiInfo = {
  address: AddressValue
  abi: unknown
}

export type AAVEv3LikeAbiMap = {
  [key: string]: AAVEv3LikeAbiInfo
}
