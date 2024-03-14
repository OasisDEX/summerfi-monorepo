import { TokenAmount, TokenSymbol, Price, CurrencySymbol } from "@summerfi/sdk-common/common"
import type { LendingPool } from "@summerfi/sdk-common/protocols"
import { IPoolId, ProtocolName, IProtocol } from "@summerfi/sdk-common/protocols"
import { Address, Position, Token, AddressValue } from "@summerfi/sdk-common/common"
import {PublicClient} from "viem"
import {AaveV3ContractNames, SparkContractNames, MakerContractNames} from '@summerfi/deployment-types'
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
    AAVEV3_LENDING_POOL_ABI
} from "./abis"

export type IPositionId = string & { __positionID: never }

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
        address: AddressValue;
        abi: MakerAbiMap[K];
    };
};

type SparkAbiMap = {
    Oracle: typeof SPARK_ORACLE_ABI
    PoolDataProvider: typeof SPARK_POOL_DATA_PROVIDER_ABI
    SparkLendingPool:  typeof SPARK_LENDING_POOL_ABI
};

type SparkAddressAbiMap = {
    [K in SparkContractNames]: {
        address: AddressValue;
        abi: SparkAbiMap[K];
    };
};

type AaveV3AbiMap = {
    Oracle: typeof AAVEV3_ORACLE_ABI
    PoolDataProvider: typeof AAVEV3_POOL_DATA_PROVIDER_ABI
    AavePool:  typeof AAVEV3_LENDING_POOL_ABI
    AaveL2Encoder: null
};

type AaveV3AddressAbiMap = {
    [K in AaveV3ContractNames]: {
        address: AddressValue;
        abi: AaveV3AbiMap[K];
    };
};

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
        protocol: P
    ) => AddressAbiMapsByProtocol[P][K];
}

export interface ITokenService {
    getTokenByAddress: (address: Address) => Promise<Token>
    getTokenBySymbol: (symbol: TokenSymbol) => Promise<Token>
}

export interface IPriceService {
    getPrice: (args: {baseToken: Token, quoteToken: Token | CurrencySymbol}) => Promise<Price>
    getPriceUSD: (token: Token) => Promise<Price>
}

export function tokenAmountFromBaseUnit({amount, token}: {amount: string, token: Token}): TokenAmount {
    return TokenAmount.createFromBaseUnit({token, amount})
}

export interface ProtocolManagerContext {
    provider: PublicClient,
    tokenService: ITokenService,
    priceService: IPriceService
    contractProvider: IContractProvider
}

export enum ChainId {
    Mainnet = 1,
    Optimism = 10,
    Arbitrum = 42161,
    Sepolia = 31337,
}

export interface ProtocolPlugin<GenericPoolId extends IPoolId> {
    protocol: GenericPoolId['protocol']['name']
    supportedChains: ChainId[]
    getPool: (poolId: unknown, ctx: ProtocolManagerContext) => Promise<LendingPool>
    getPositionId: (positionId: string) => IPositionId
    getPosition: (positionId: IPositionId, ctx: ProtocolManagerContext) => Promise<Position>
    isPoolId: (candidate: unknown) => asserts candidate is GenericPoolId
}
