import { IPool, IPoolId, IProtocol, ProtocolName } from "@summerfi/sdk-common/protocols"
import { TokenSymbol, Price, CurrencySymbol, AddressValue , Address, Position, Token } from "@summerfi/sdk-common/common"
import { PublicClient} from "viem"
import {
    VAT_ABI,
    SPOT_ABI,
    JUG_ABI,
    DOG_ABI,
    ILK_REGISTRY,
    ORACLE_ABI,
    POOL_DATA_PROVIDER, LENDING_POOL_ABI
} from "./abis"
import {AaveV3ContractNames, SparkContractNames, MakerContractNames} from '@summerfi/deployment-types'

export type IPositionId = string & { __positionID: never }

type ExtendedMakerContractNames = MakerContractNames | 'IlkRegistry'
type MakerAbiMap = {
    Dog: typeof DOG_ABI
    Vat: typeof VAT_ABI
    McdJug: typeof JUG_ABI
    Spot: typeof SPOT_ABI
    IlkRegistry: typeof ILK_REGISTRY
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
    Oracle: typeof ORACLE_ABI
    PoolDataProvider: typeof POOL_DATA_PROVIDER
    SparkLendingPool:  typeof LENDING_POOL_ABI
};

type SparkAddressAbiMap = {
    [K in SparkContractNames]: {
        address: AddressValue;
        abi: SparkAbiMap[K];
    };
};

type AaveV3AbiMap = {
    Oracle: typeof ORACLE_ABI
    PoolDataProvider: typeof POOL_DATA_PROVIDER
    AavePool:  typeof LENDING_POOL_ABI
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

export interface ProtocolManagerContext {
    provider: PublicClient,
    contractProvider: IContractProvider
    tokenService: ITokenService,
    priceService: IPriceService
}

export enum ChainId {
    Mainnet = 1,
    Optimism = 10,
    Arbitrum = 42161,
    Sepolia = 31337,
}

export interface ProtocolPlugin<GenericPoolId extends IPoolId> {
    supportedChains: ChainId[]
    getPool: (poolId: GenericPoolId) => Promise<IPool>
    getPositionId: (positionId: string) => IPositionId
    getPosition: (positionId: IPositionId) => Promise<Position>
}


/*
In order to get pool from protocol we need to know:

    Maker:
    ilk (ETH-A, WBTC-A, etc)

    Aave | Spark:
    eMode (0 - none, 1 - eth correlated, 2 - usd correlated)

    in aave in general we have just one big pool, however we came to the conculsion
    that enabling eMode changes bahavior of a pool siginificantly, (avaialble assets, max ltvs are different)
    so we can assume that eMode category can be assigned as a pool id. Having that
    we will return all prices for all assets, rates for all debt tokens, 
    and ltv for collaterals in that pool regardless of the position debt and collateral.
    In my opinion such approuch best describes the reality of the protocol and matches our
    needs.

    Ajna
    poolId (pool address)

    Morpho
    marketId (market hex)

    Questions:

    - How to distinguish if we want to get lending or supply pool?

Getting pos

*/