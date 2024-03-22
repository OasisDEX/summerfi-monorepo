import { MakerContractNames } from '@summerfi/deployment-types'
import { CollateralConfig, DebtConfig } from '@summerfi/sdk-common/protocols'
import { Price, AddressValue } from '@summerfi/sdk-common/common'
import type { LendingPool } from '@summerfi/sdk-common/protocols'
import { DOG_ABI, ILK_REGISTRY_ABI, JUG_ABI, SPOT_ABI, VAT_ABI } from './abis'

// Lending Pool
export interface MakerPoolDebtConfig extends DebtConfig {}
export interface MakerPoolCollateralConfig extends CollateralConfig {
  nextPrice: Price
  lastPriceUpdate: Date
  nextPriceUpdate: Date
}

export type MakerLendingPool = LendingPool<MakerPoolCollateralConfig, MakerPoolDebtConfig>

// ABIs and Protocol contracts
type ExtendedMakerContractNames = MakerContractNames | 'IlkRegistry'

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

export type MakerAddressAbiMap = {
  [K in ExtendedMakerContractNames]: {
    address: AddressValue
    abi: MakerAbiMap[K]
  }
}
