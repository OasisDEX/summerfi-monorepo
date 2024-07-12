import { AbiContractType } from '../enums/AbiContractType'
import { ContractAbi } from '../types/ContractAbi'

/**
 * @name IAbiProvider
 * @description Interface for the ABI provider. It returns an ABI for a given contract type
 */
export interface IAbiProvider {
  /**
   * @name getAbi
   * @description Returns the specified ABI for the given contract type
   *
   * @param contractType The type of contract to get the ABI for
   *
   * @returns ContractAbi The Abi of the contract
   */
  getAbi(params: { type: AbiContractType }): Promise<ContractAbi>
}
