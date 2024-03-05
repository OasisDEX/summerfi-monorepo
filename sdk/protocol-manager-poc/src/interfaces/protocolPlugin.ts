import { Percentage } from "@summerfi/sdk-common/common"
import { IPool, LendingPool, PoolType, ProtocolName, /* IPoolId */ } from "@summerfi/sdk-common/protocols"
import { /* PositionId, */ Address, ChainInfo, Position, Token } from "@summerfi/sdk-common/common"
import { PublicClient, stringToHex } from "viem"
import { BigNumber } from 'bignumber.js'

export type IPoolId = string & { __poolId: never }
export type IPositionId = string & { __positionID: never }

export interface ProtocolManagerContext {
    provider: PublicClient,
}

export interface CreateProtocolPlugin {
    (ctx: ProtocolManagerContext): ProtocolPlugin
}

export enum ChainId {
    Mainnet = 1,
    Optimism = 10,
    Arbitrum = 42161,
    Sepolia = 31337,
}

export interface ProtocolPlugin {
    supportedChains: ChainId[]
    getPoolId: (poolId: string) => IPoolId
    getPool: (poolId: IPoolId) => Promise<IPool>
    getPositionId: (positionId: string) => IPositionId
    getPosition: (positionId: IPositionId) => Promise<Position>
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

const VAT_ABI = [{ "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": true, "inputs": [{ "indexed": true, "internalType": "bytes4", "name": "sig", "type": "bytes4" }, { "indexed": true, "internalType": "bytes32", "name": "arg1", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "arg2", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "arg3", "type": "bytes32" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "LogNote", "type": "event" }, { "constant": true, "inputs": [], "name": "Line", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "cage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "can", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "dai", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "debt", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "usr", "type": "address" }], "name": "deny", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "ilk", "type": "bytes32" }, { "internalType": "bytes32", "name": "what", "type": "bytes32" }, { "internalType": "uint256", "name": "data", "type": "uint256" }], "name": "file", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "what", "type": "bytes32" }, { "internalType": "uint256", "name": "data", "type": "uint256" }], "name": "file", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "ilk", "type": "bytes32" }, { "internalType": "address", "name": "src", "type": "address" }, { "internalType": "address", "name": "dst", "type": "address" }, { "internalType": "uint256", "name": "wad", "type": "uint256" }], "name": "flux", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "i", "type": "bytes32" }, { "internalType": "address", "name": "u", "type": "address" }, { "internalType": "int256", "name": "rate", "type": "int256" }], "name": "fold", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "ilk", "type": "bytes32" }, { "internalType": "address", "name": "src", "type": "address" }, { "internalType": "address", "name": "dst", "type": "address" }, { "internalType": "int256", "name": "dink", "type": "int256" }, { "internalType": "int256", "name": "dart", "type": "int256" }], "name": "fork", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "i", "type": "bytes32" }, { "internalType": "address", "name": "u", "type": "address" }, { "internalType": "address", "name": "v", "type": "address" }, { "internalType": "address", "name": "w", "type": "address" }, { "internalType": "int256", "name": "dink", "type": "int256" }, { "internalType": "int256", "name": "dart", "type": "int256" }], "name": "frob", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "address", "name": "", "type": "address" }], "name": "gem", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "i", "type": "bytes32" }, { "internalType": "address", "name": "u", "type": "address" }, { "internalType": "address", "name": "v", "type": "address" }, { "internalType": "address", "name": "w", "type": "address" }, { "internalType": "int256", "name": "dink", "type": "int256" }, { "internalType": "int256", "name": "dart", "type": "int256" }], "name": "grab", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "rad", "type": "uint256" }], "name": "heal", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "usr", "type": "address" }], "name": "hope", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "ilks", "outputs": [{ "internalType": "uint256", "name": "Art", "type": "uint256" }, { "internalType": "uint256", "name": "rate", "type": "uint256" }, { "internalType": "uint256", "name": "spot", "type": "uint256" }, { "internalType": "uint256", "name": "line", "type": "uint256" }, { "internalType": "uint256", "name": "dust", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "ilk", "type": "bytes32" }], "name": "init", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "live", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "src", "type": "address" }, { "internalType": "address", "name": "dst", "type": "address" }, { "internalType": "uint256", "name": "rad", "type": "uint256" }], "name": "move", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "usr", "type": "address" }], "name": "nope", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "usr", "type": "address" }], "name": "rely", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "sin", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes32", "name": "ilk", "type": "bytes32" }, { "internalType": "address", "name": "usr", "type": "address" }, { "internalType": "int256", "name": "wad", "type": "int256" }], "name": "slip", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "u", "type": "address" }, { "internalType": "address", "name": "v", "type": "address" }, { "internalType": "uint256", "name": "rad", "type": "uint256" }], "name": "suck", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "address", "name": "", "type": "address" }], "name": "urns", "outputs": [{ "internalType": "uint256", "name": "ink", "type": "uint256" }, { "internalType": "uint256", "name": "art", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "vice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "wards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }] as const
const SPOT_ABI = [{"inputs":[{"internalType":"address","name":"vat_","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":true,"inputs":[{"indexed":true,"internalType":"bytes4","name":"sig","type":"bytes4"},{"indexed":true,"internalType":"address","name":"usr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"arg1","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"arg2","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"ilk","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"val","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"spot","type":"uint256"}],"name":"Poke","type":"event"},{"constant":false,"inputs":[],"name":"cage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"deny","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"},{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"uint256","name":"data","type":"uint256"}],"name":"file","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"uint256","name":"data","type":"uint256"}],"name":"file","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"},{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"address","name":"pip_","type":"address"}],"name":"file","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"ilks","outputs":[{"internalType":"contract PipLike","name":"pip","type":"address"},{"internalType":"uint256","name":"mat","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"live","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"par","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"poke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"rely","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vat","outputs":[{"internalType":"contract VatLike","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}] as const
const JUG_ABI = [{"inputs":[{"internalType":"address","name":"vat_","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":true,"inputs":[{"indexed":true,"internalType":"bytes4","name":"sig","type":"bytes4"},{"indexed":true,"internalType":"address","name":"usr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"arg1","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"arg2","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"LogNote","type":"event"},{"constant":true,"inputs":[],"name":"base","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"deny","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"drip","outputs":[{"internalType":"uint256","name":"rate","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"},{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"uint256","name":"data","type":"uint256"}],"name":"file","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"uint256","name":"data","type":"uint256"}],"name":"file","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"address","name":"data","type":"address"}],"name":"file","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"ilks","outputs":[{"internalType":"uint256","name":"duty","type":"uint256"},{"internalType":"uint256","name":"rho","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"rely","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vat","outputs":[{"internalType":"contract VatLike","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"vow","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}] as const 
const DOG_ABI = [{"inputs":[{"internalType":"address","name":"vat_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"ilk","type":"bytes32"},{"indexed":true,"internalType":"address","name":"urn","type":"address"},{"indexed":false,"internalType":"uint256","name":"ink","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"art","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"due","type":"uint256"},{"indexed":false,"internalType":"address","name":"clip","type":"address"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"Bark","type":"event"},{"anonymous":false,"inputs":[],"name":"Cage","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"usr","type":"address"}],"name":"Deny","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"ilk","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"rad","type":"uint256"}],"name":"Digs","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"data","type":"uint256"}],"name":"File","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":false,"internalType":"address","name":"data","type":"address"}],"name":"File","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"ilk","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"data","type":"uint256"}],"name":"File","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"ilk","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":false,"internalType":"address","name":"clip","type":"address"}],"name":"File","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"usr","type":"address"}],"name":"Rely","type":"event"},{"inputs":[],"name":"Dirt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"Hole","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"},{"internalType":"address","name":"urn","type":"address"},{"internalType":"address","name":"kpr","type":"address"}],"name":"bark","outputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"chop","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"deny","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"},{"internalType":"uint256","name":"rad","type":"uint256"}],"name":"digs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"},{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"uint256","name":"data","type":"uint256"}],"name":"file","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"uint256","name":"data","type":"uint256"}],"name":"file","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"address","name":"data","type":"address"}],"name":"file","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"},{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"address","name":"clip","type":"address"}],"name":"file","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"ilks","outputs":[{"internalType":"address","name":"clip","type":"address"},{"internalType":"uint256","name":"chop","type":"uint256"},{"internalType":"uint256","name":"hole","type":"uint256"},{"internalType":"uint256","name":"dirt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"live","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"rely","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vat","outputs":[{"internalType":"contract VatLike","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vow","outputs":[{"internalType":"contract VowLike","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}] as const 
const ILK_REGISTRY = [{"inputs":[{"internalType":"address","name":"vat_","type":"address"},{"internalType":"address","name":"dog_","type":"address"},{"internalType":"address","name":"cat_","type":"address"},{"internalType":"address","name":"spot_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"AddIlk","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"usr","type":"address"}],"name":"Deny","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":false,"internalType":"address","name":"data","type":"address"}],"name":"File","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"ilk","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":false,"internalType":"address","name":"data","type":"address"}],"name":"File","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"ilk","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"data","type":"uint256"}],"name":"File","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"ilk","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"what","type":"bytes32"},{"indexed":false,"internalType":"string","name":"data","type":"string"}],"name":"File","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"NameError","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"usr","type":"address"}],"name":"Rely","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"RemoveIlk","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"SymbolError","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"UpdateIlk","type":"event"},{"inputs":[{"internalType":"address","name":"adapter","type":"address"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cat","outputs":[{"internalType":"contract CatLike","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"class","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"dec","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"deny","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dog","outputs":[{"internalType":"contract DogLike","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"},{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"uint256","name":"data","type":"uint256"}],"name":"file","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"},{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"string","name":"data","type":"string"}],"name":"file","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"address","name":"data","type":"address"}],"name":"file","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"},{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"address","name":"data","type":"address"}],"name":"file","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"gem","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"pos","type":"uint256"}],"name":"get","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"ilkData","outputs":[{"internalType":"uint96","name":"pos","type":"uint96"},{"internalType":"address","name":"join","type":"address"},{"internalType":"address","name":"gem","type":"address"},{"internalType":"uint8","name":"dec","type":"uint8"},{"internalType":"uint96","name":"class","type":"uint96"},{"internalType":"address","name":"pip","type":"address"},{"internalType":"address","name":"xlip","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"info","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"class","type":"uint256"},{"internalType":"uint256","name":"dec","type":"uint256"},{"internalType":"address","name":"gem","type":"address"},{"internalType":"address","name":"pip","type":"address"},{"internalType":"address","name":"join","type":"address"},{"internalType":"address","name":"xlip","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"join","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"list","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"end","type":"uint256"}],"name":"list","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"pip","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"pos","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_ilk","type":"bytes32"},{"internalType":"address","name":"_join","type":"address"},{"internalType":"address","name":"_gem","type":"address"},{"internalType":"uint256","name":"_dec","type":"uint256"},{"internalType":"uint256","name":"_class","type":"uint256"},{"internalType":"address","name":"_pip","type":"address"},{"internalType":"address","name":"_xlip","type":"address"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"name":"put","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"rely","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"remove","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"removeAuth","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"spot","outputs":[{"internalType":"contract SpotLike","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"update","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vat","outputs":[{"internalType":"contract VatLike","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ilk","type":"bytes32"}],"name":"xlip","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}] as const 

const PRESISION = {
    WAD: 18,
    RAY: 27,
    RAD: 45,
}

const PRESISION_BI = {
    WAD: 10n ** 18n,
    RAY: 10n ** 27n,
    RAD: 10n ** 45n,
}

function amountFromWei(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.WAD))
}

function amountFromRay(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.RAY))
}

function amountFromRad(amount: bigint): BigNumber {
    return new BigNumber(amount.toString()).div(new BigNumber(10).pow(PRESISION.RAD))
}

export const createMakerPlugin: CreateProtocolPlugin = (ctx: ProtocolManagerContext): ProtocolPlugin => {
    return {
        supportedChains: [ChainId.Mainnet],
        getPoolId: (poolId: string): IPoolId => {
            return poolId as IPoolId
        },
        getPool: async (poolId: IPoolId): Promise<LendingPool> => {
            const ilkInHex = stringToHex(poolId, { size: 32 })

            const [
                {   0: art,         // Total Normalised Debt     [wad] needs to be multiplied by rate to get actual debt https://docs.makerdao.com/smart-contract-modules/rates-module
                    1: rate,        // Accumulated Rates         [ray]
                    2: spot,        // Price with Safety Margin  [ray]
                    3: line,        // Debt Ceiling              [rad] - max total debt
                    4: dust         // Urn Debt Floor            [rad] - minimum debt
                }, 
                {   0: _,           // Price feed address
                    1: mat          // Liquidation ratio [ray]
                }, 
                {   0: rawFee,      // Collateral-specific, per-second stability fee contribution [ray]
                    1: feeLastLevied// Time of last drip [unix epoch time]
                }, 
                {   0: clip,        // Liquidator
                    1: chop,         // Liquidation Penalty 
                    2: hole,        // Max DAI needed to cover debt+fees of active auctions per ilk [rad]
                    3: dirt         // Total DAI needed to cover debt+fees of active auctions [rad]
                },
                {   0: pos,         // Index in ilks array
                    1: join,        // DSS GemJoin adapter
                    2: gem,         // The collateral token contract
                    3: dec,         // Collateral token decimals
                    4: _class,      // Classification code (1 - clip, 2 - flip, 3+ - other)
                    5: pip,         // Token price oracle address
                    6: xlip,        // Auction contract
                    7: name,        // Token name
                    8: symbol       // Token symbol
                }
            ] = await ctx.provider.multicall({
                contracts: [
                    {
                        abi: VAT_ABI,
                        address: MakerContracts.VAT,
                        functionName: "ilks",
                        args: [ilkInHex]
                    },
                    {
                        abi: SPOT_ABI,
                        address: MakerContracts.SPOT,
                        functionName: "ilks",
                        args: [ilkInHex]
                    },
                    {
                        abi: JUG_ABI,
                        address: MakerContracts.JUG,
                        functionName: "ilks",
                        args: [ilkInHex]
                    },
                    {
                        abi: DOG_ABI,
                        address: MakerContracts.DOG,
                        functionName: "ilks",
                        args: [ilkInHex]
                    },
                    {
                        abi: ILK_REGISTRY,
                        address: MakerContracts.ILK_REGISTRY,
                        functionName: "ilkData",
                        args: [ilkInHex]
                    }
                ],
                allowFailure: false
            })

            const vatRes = {
                normalizedIlkDebt: amountFromWei(art),
                debtScalingFactor: amountFromRay(rate),
                maxDebtPerUnitCollateral: amountFromRay(spot),
                debtCeiling: amountFromRad(line),
                debtFloor: amountFromRad(dust),
            }

            const spotRes = {
                priceFeedAddress: Address.createFrom({ value: pip }),
                liquidationRatio: amountFromRay(mat),
            }

            const jugRes = { 
                rawFee: amountFromRay(rawFee),
                feeLastLevied: new BigNumber(feeLastLevied.toString()).times(1000),
            }

            const dogRes = {
                clipperAddress: Address.createFrom({ value: clip }),
                liquidationPenalty: amountFromWei(chop - PRESISION_BI.WAD),
            }

            return {
                type: PoolType.Lending,
                poolId: {
                    id: poolId as string
                },
                protocol: ProtocolName.Maker,
                collateralTokens: [], // Token[]
                debtTokens: [], // Token[]
                maxLTV: Percentage.createFrom({ percentage: 0 }),
                /*
                protocolBaseCurrency: Currency [ETH, USD, DAI etc]
                liquidationTresholds: {
                    [collateralTokenAddress]: Percantage
                }
                rates: {
                    [debtTokenAddress]: Percentage
                }
                apys: {
                    [collateralTokenAddress]: Percentage
                }
                debtCeilings: {
                    [debtTokenAddress]: TokenAmount
                }
                dustLimits: {
                    [debtTokenAddress]: TokenAmount
                }
                tokenPrices: {
                    [tokenAddress]: Price
                }

                OR 

                {
                    collaterals: {
                        [collateralTokenAddress]: {
                            price: Price
                            nextPrice: Price // only maker has this
                            priceUSD: Price
                            liquidationTreshold: Percentage
                            tokensLocked: TokenAmount
                            maxSupply: TokenAmount
                            liquidationPenalty: Percentage
                            apy: Percentage
                        }
                    }
                    debts: {
                        [debtTokenAddress]: {
                            price: Price
                            priceUSD: Price
                            rate: Percentage
                            totalBorrowed: TokenAmount
                            debtCeiling: TokenAmount
                            debtAvailable: TokenAmount
                            dustLimit: TokenAmount
                            originationFee: Percentage
                            variableRate: boolean
                        }
                    }
                }
                */
            }
        },
        getPositionId: (positionId: string): IPositionId => {
            return positionId as IPositionId
        },
        getPosition: async (positionId: IPositionId): Promise<Position> => {
            throw new Error("Not implemented")
        }
    }
}


/*
In order to get pool from protocol we need to know:

    Maker:
    ilk (ETH-A, WBTC-A, etc)

    Aave | Spark:
    eMode (0 - none, 1 - eth corelated, 2 - usd corelated) 

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