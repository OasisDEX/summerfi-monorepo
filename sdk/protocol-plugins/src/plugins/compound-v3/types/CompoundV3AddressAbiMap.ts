// ABIs and Protocol contracts
import { CompoundV3ContractNames } from '@summerfi/deployment-types'
import { AddressValue } from '@summerfi/sdk-common/common'
import { cometAbi } from '../abis/CompoundV3ABIS'

export type CompoundV3AbiMap = {
  Comet: typeof cometAbi
}

export type CompoundV3AddressAbiMap = {
  [K in CompoundV3ContractNames]: {
    address: AddressValue
    abi: CompoundV3AbiMap[K]
  }
}
