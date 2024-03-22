import { MakerContractNames } from '@summerfi/deployment-types'
import { DOG_ABI, ILK_REGISTRY_ABI, JUG_ABI, SPOT_ABI, VAT_ABI } from '../abis/MakerABIS'
import { AddressValue } from '@summerfi/sdk-common/common'

export type MakerAbiMap = {
  Dog: typeof DOG_ABI
  Vat: typeof VAT_ABI
  McdJug: typeof JUG_ABI
  Spot: typeof SPOT_ABI
  IlkRegistry: typeof ILK_REGISTRY_ABI
  Chainlog: null
  CdpManager: null
  GetCdps: null
  Pot: null
  End: null
  McdGov: null
  FlashMintModule: null
}

export type ExtendedMakerContractNames = MakerContractNames | 'IlkRegistry'

export type MakerAddressAbiMap = {
  [K in ExtendedMakerContractNames]: {
    address: AddressValue
    abi: MakerAbiMap[K]
  }
}
