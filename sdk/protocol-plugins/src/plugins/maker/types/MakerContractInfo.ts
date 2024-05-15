import { AddressValue } from '@summerfi/sdk-common'
import { MakerAbiMap } from '../abis/MakerAbiMap'
import { MakerContractNames } from '@summerfi/deployment-types'

export type MakerContractInfo<K extends MakerContractNames> = {
  address: AddressValue
  abi: (typeof MakerAbiMap)[K]
}
