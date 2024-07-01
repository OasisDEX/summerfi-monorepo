import { morphoBlueAbi } from '@summerfi/abis'
import { MorphoBlueContractNames } from '@summerfi/deployment-types'
import { AddressValue } from '@summerfi/sdk-common/common'

type MorphoBlueAbiMap = {
  MorphoBlue: typeof morphoBlueAbi
  AdaptiveCurveIrm: undefined
}

export type MorphoBlueAddressAbiMap = {
  [K in MorphoBlueContractNames]: {
    address: AddressValue
    abi: MorphoBlueAbiMap[K]
  }
}
