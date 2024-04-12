// ABIs and Protocol contracts
import {AaveV2ContractNames} from "@summerfi/deployment-types";
import { AddressValue } from '@summerfi/sdk-common/common'
import {AAVEV2_LENDING_POOL_ABI, AAVEV2_ORACLE_ABI, AAVEV2_POOL_DATA_PROVIDER_ABI} from "../abis/AaveV2ABIS";

export type AaveV2AbiMap = {
  Oracle: typeof AAVEV2_ORACLE_ABI
  PoolDataProvider: typeof AAVEV2_POOL_DATA_PROVIDER_ABI,
  AaveLendingPool: typeof AAVEV2_LENDING_POOL_ABI
  AaveWethGateway: null
}

export type AaveV2AddressAbiMap = {
  [K in AaveV2ContractNames]: {
    address: AddressValue
    abi: AaveV2AbiMap[K]
  }
}
