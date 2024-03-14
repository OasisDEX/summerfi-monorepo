import { TokenAmount, TokenSymbol, Price, CurrencySymbol } from "@summerfi/sdk-common/common"
import type { LendingPool } from "@summerfi/sdk-common/protocols"
import { IPoolId, EmodeType } from "@summerfi/sdk-common/protocols"
import { /* PositionId, */ Address, Position, Token } from "@summerfi/sdk-common/common"
import {PublicClient} from "viem"
import { BigNumber } from 'bignumber.js'
import { z } from "zod"

export type IPositionId = string & { __positionID: never }

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
    protocol: GenericPoolId['protocol']['name']
    supportedChains: ChainId[]
    getPool: (poolId: unknown, ctx: ProtocolManagerContext) => Promise<LendingPool>
    getPositionId: (positionId: string) => IPositionId
    getPosition: (positionId: IPositionId, ctx: ProtocolManagerContext) => Promise<Position>
    isPoolId: (candidate: unknown) => asserts candidate is GenericPoolId
    shcema: z.ZodSchema<GenericPoolId>
}

/*
    We need some kind of address provider or contract provider that will 
    return the address of the contract together with abi

    contractProvider.getContract(MakerContracts.VAT)

*/

export const MakerContracts = {
    VAT: "0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b",
    SPOT: "0x65c79fcb50ca1594b025960e539ed7a9a6d434a3",
    JUG: "0x19c0976f590d67707e62397c87829d896dc0f1f1",
    DOG: "0x135954d155898d42c90d2a57824c690e0c7bef1b",
    ILK_REGISTRY: "0x5a464C28D19848f44199D003BeF5ecc87d090F87",
} as const

export const SparkContracts = {
    ORACLE: "0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9",
    LENDING_POOL: "0xC13e21B648A5Ee794902342038FF3aDAB66BE987",
    POOL_DATA_PROVIDER: "0xFc21d6d146E6086B8359705C8b28512a983db0cb",
} as const

const PRESISION = {
    WAD: 18,
    RAY: 27,
    RAD: 45,
}

export const PRESISION_BI = {
    WAD: 10n ** 18n,
    RAY: 10n ** 27n,
    RAD: 10n ** 45n,
}

export const UNCAPPED_SUPPLY = Number.MAX_SAFE_INTEGER.toString()

export function amountFromWei(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.WAD))
}

export function amountFromRay(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.RAY))
}

export function amountFromRad(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.RAD))
}

export const sparkEmodeCategoryMap: Record<EmodeType, bigint> = Object.keys(EmodeType).reduce<Record<EmodeType, bigint>>((accumulator, key, index) => {
    accumulator[EmodeType[key as keyof typeof EmodeType]] = BigInt(index);
    return accumulator;
}, {} as Record<EmodeType, bigint>);

