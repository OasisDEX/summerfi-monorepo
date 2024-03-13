import { TokenSymbol, Price, CurrencySymbol } from "@summerfi/sdk-common/common"
import { IPool, IPoolId, ProtocolName, IProtocol } from "@summerfi/sdk-common/protocols"
import { Address, Position, Token } from "@summerfi/sdk-common/common"
import { PublicClient} from "viem"
import { AddressValue } from "@summerfi/sdk-common/common"

import {
    VAT_ABI,
    SPOT_ABI,
    JUG_ABI,
    DOG_ABI,
    ILK_REGISTRY,
    ORACLE_ABI,
    POOL_DATA_PROVIDER, LENDING_POOL_ABI
} from "./abis"

export type IPositionId = string & { __positionID: never }

enum MakerContracts {
    VAT = 'VAT',
    SPOT = 'SPOT',
    JUG = 'JUG',
    DOG = 'DOG',
    ILK_REGISTRY = 'ILK_REGISTRY'
}

export enum AaveV3LikeContracts {
    ORACLE = "ORACLE",
    LENDING_POOL = "LENDING_POOL",
    POOL_DATA_PROVIDER = "POOL_DATA_PROVIDER"
}

// export enum AaveV3Contracts {
//     AAVEV3_ORACLE = "ORACLE",
//     AAVEV3_LENDING_POOL = "LENDING_POOL",
//     AAVEV3_POOL_DATA_PROVIDER = "POOL_DATA_PROVIDER"
// }
//
// export enum SparkContracts {
//     SPARK_ORACLE = "ORACLE",
//     SPARK_LENDING_POOL = "LENDING_POOL",
//     SPARK_POOL_DATA_PROVIDER = "POOL_DATA_PROVIDER"
// }

type MakerAddressAbiMap = {
    [MakerContracts.DOG]: {
        address: AddressValue
        abi: typeof DOG_ABI
    }
    [MakerContracts.VAT]: {
        address: AddressValue
        abi: typeof VAT_ABI
    }
    [MakerContracts.JUG]: {
        address: AddressValue
        abi: typeof JUG_ABI
    }
    [MakerContracts.SPOT]: {
        address: AddressValue
        abi: typeof SPOT_ABI
    }
    [MakerContracts.ILK_REGISTRY]: {
        address: AddressValue
        abi: typeof ILK_REGISTRY
    }
}

type SparkAddressAbiMap = {
    [AaveV3LikeContracts.ORACLE]: {
        address: AddressValue,
        abi: typeof ORACLE_ABI
    }
    [AaveV3LikeContracts.POOL_DATA_PROVIDER]: {
        address: AddressValue,
        abi: typeof POOL_DATA_PROVIDER
    }
    [AaveV3LikeContracts.LENDING_POOL]: {
        address: AddressValue,
        abi: typeof LENDING_POOL_ABI
    }
}

type AaveV3AddressAbiMap = {
    [AaveV3LikeContracts.ORACLE]: {
        address: AddressValue,
        abi: typeof ORACLE_ABI
    }
    [AaveV3LikeContracts.POOL_DATA_PROVIDER]: {
        address: AddressValue,
        abi: typeof POOL_DATA_PROVIDER
    }
    [AaveV3LikeContracts.LENDING_POOL]: {
        address: AddressValue,
        abi: typeof LENDING_POOL_ABI
    }
}

type AaveV2AddressAbiMap = {}
type AjnaAddressAbiMap = {}
type MorphoBlueAbiMap = {}

type AddressAbiMapsByProtocol = {
    [ProtocolName.Spark]: SparkAddressAbiMap
    [ProtocolName.AAVEv3]: AaveV3AddressAbiMap
    [ProtocolName.AAVEv2]: AaveV2AddressAbiMap
    [ProtocolName.Maker]: MakerAddressAbiMap
    [ProtocolName.Ajna]: AjnaAddressAbiMap
    [ProtocolName.MorphoBlue]: MorphoBlueAbiMap
}

export interface IContractProvider {
    getContractDef: <P extends IProtocol['name']>(
        contractKey: keyof AddressAbiMapsByProtocol[P],
        protocol: P
    ) => AddressAbiMapsByProtocol[P][keyof AddressAbiMapsByProtocol[P]];
}

// Implement the IContractProvider interface
// class ContractProvider implements IContractProvider {
//     getContract<K extends MakerContracts | AaveV3LikeContracts>(contractKey: K): CombinedAddressAbiMap[K] {
//         const map: CombinedAddressAbiMap = {
//             [MakerContracts.DOG]: {
//                 address: '0x...',
//                 abi: DOG_ABI,
//             },
//             [MakerContracts.VAT]: {
//                 address: '0x...',
//                 abi: ORACLE_ABI,
//             },
//             [MakerContracts.JUG]: {
//                 address: '0x...',
//                 abi: ORACLE_ABI,
//             },
//             [MakerContracts.SPOT]: {
//                 address: '0x...',
//                 abi: ORACLE_ABI,
//             },
//             [MakerContracts.ILK_REGISTRY]: {
//                 address: '0x...',
//                 abi: ORACLE_ABI,
//             },
//             [AaveV3LikeContracts.ORACLE]: {
//                 address: '0x...',
//                 abi: ORACLE_ABI,
//             },
//             [AaveV3LikeContracts.POOL_DATA_PROVIDER]: {
//                 address: '0x...',
//                 abi: POOL_DATA_PROVIDER,
//             },
//         };
//         return map[contractKey];
//     }
// }
//
// // Usage
// const provider = new ContractProvider();
// const dogContract = provider.getContract(MakerContracts.DOG);
// const oracleContract = provider.getContract(AaveV3LikeContracts.ORACLE);

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

export interface CreateProtocolPlugin<GenericPoolId extends IPoolId> {
    (ctx: ProtocolManagerContext): ProtocolPlugin<GenericPoolId>
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
    _validate: (candidate: unknown) => asserts candidate is GenericPoolId
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