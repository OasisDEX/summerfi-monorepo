import { morphoBlueAbi } from '@summerfi/abis'
import { MorphoBlueContractNames } from '@summerfi/deployment-types'
import { AddressValue } from '@summerfi/sdk-common'

type MorphoAbiMap = {
  MorphoBlue: typeof morphoBlueAbi
  AdaptiveCurveIrm: undefined
}

export type MorphoAddressAbiMap = {
  [K in MorphoBlueContractNames]: {
    address: AddressValue
    abi: MorphoAbiMap[K]
  }
}
