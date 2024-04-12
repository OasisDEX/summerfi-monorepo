// ABIs and Protocol contracts
import { AaveV2ContractNames } from '@summerfi/deployment-types'
import { AddressValue } from '@summerfi/sdk-common/common'
import {
  AAVEV2_PLACEHOLDER_ABI,
} from '../abis/AaveV2ABIS'

export type AaveV2AbiMap = {
  Placeholder: typeof AAVEV2_ABI
}

export type AaveV2AddressAbiMap = {
  [K in AaveV2ContractNames]: {
    address: AddressValue
    abi: AaveV2AbiMap[K]
  }
}
