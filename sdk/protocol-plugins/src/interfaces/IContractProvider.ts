import { ProtocolName, IProtocol } from '@summerfi/sdk-common/protocols'
import { AaveV3AddressAbiMap } from '../aave-v3/types/AaveV3AddressAbiMap'
import { MakerAddressAbiMap } from '../maker/types/MakerAddressAbiMap'
import { SparkAddressAbiMap } from '../spark/types/SparkAddressAbiMap'

// TODO: Replace with real implementations when available
type AaveV2AddressAbiMap = Record<string, never>
type AjnaAddressAbiMap = Record<string, never>
type MorphoBlueAbiMap = Record<string, never>

export type AddressAbiMapsByProtocol = {
  [ProtocolName.Spark]: SparkAddressAbiMap
  [ProtocolName.AAVEv3]: AaveV3AddressAbiMap
  [ProtocolName.AAVEv2]: AaveV2AddressAbiMap
  [ProtocolName.Maker]: MakerAddressAbiMap
  [ProtocolName.Ajna]: AjnaAddressAbiMap
  [ProtocolName.MorphoBlue]: MorphoBlueAbiMap
}

export interface IContractProvider {
  getContractDef: <P extends IProtocol['name'], K extends keyof AddressAbiMapsByProtocol[P]>(
    contractKey: K,
    protocol: P,
  ) => AddressAbiMapsByProtocol[P][K]
}
