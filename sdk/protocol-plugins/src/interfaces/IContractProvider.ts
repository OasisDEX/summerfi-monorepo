import {
    AddressValue,
} from '@summerfi/sdk-common/common'
import {
    ProtocolName,
    IProtocol,
} from '@summerfi/sdk-common/protocols'
import {
    AaveV3ContractNames,
    SparkContractNames,
    MakerContractNames,
} from '@summerfi/deployment-types'
import {
    VAT_ABI,
    SPOT_ABI,
    JUG_ABI,
    DOG_ABI,
    ILK_REGISTRY_ABI,
    SPARK_ORACLE_ABI,
    SPARK_POOL_DATA_PROVIDER_ABI,
    SPARK_LENDING_POOL_ABI,
    AAVEV3_ORACLE_ABI,
    AAVEV3_POOL_DATA_PROVIDER_ABI,
    AAVEV3_LENDING_POOL_ABI,
} from './abis'

type ExtendedMakerContractNames = MakerContractNames | 'IlkRegistry'

type MakerAbiMap = {
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

type MakerAddressAbiMap = {
    [K in ExtendedMakerContractNames]: {
        address: AddressValue
        abi: MakerAbiMap[K]
    }
}

type SparkAbiMap = {
    Oracle: typeof SPARK_ORACLE_ABI
    PoolDataProvider: typeof SPARK_POOL_DATA_PROVIDER_ABI
    SparkLendingPool: typeof SPARK_LENDING_POOL_ABI
}

type SparkAddressAbiMap = {
    [K in SparkContractNames]: {
        address: AddressValue
        abi: SparkAbiMap[K]
    }
}

type AaveV3AbiMap = {
    Oracle: typeof AAVEV3_ORACLE_ABI
    PoolDataProvider: typeof AAVEV3_POOL_DATA_PROVIDER_ABI
    AavePool: typeof AAVEV3_LENDING_POOL_ABI
    AaveL2Encoder: null
}

type AaveV3AddressAbiMap = {
    [K in AaveV3ContractNames]: {
        address: AddressValue
        abi: AaveV3AbiMap[K]
    }
}

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