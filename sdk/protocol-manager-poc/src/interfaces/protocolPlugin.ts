import { TokenSymbol, Price, CurrencySymbol } from "@summerfi/sdk-common/common"
import { IPool, IPoolId } from "@summerfi/sdk-common/protocols"
import { Address, Position, Token } from "@summerfi/sdk-common/common"
import {PublicClient} from "viem"

export type IPositionId = string & { __positionID: never }

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