import { AbiContractType } from '../enums/AbiContractType'
import { ContractAbi } from './ContractAbi'

/** Abi record for all supported contract types */
export type ContractAbiRecord = Record<AbiContractType, ContractAbi>
