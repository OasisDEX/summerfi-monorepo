import { Maybe } from '@summerfi/sdk-common'

/**
 * @type GenericAbiMap
 * @description Generic type for a map of contract ABIs, to be extended by each
 *              protocol plugin
 */
export type GenericAbiMap<ContractNames extends string> = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [K in ContractNames]: any
}

/**
 * @class ChainContractsProvider
 * @description Provides type safe contract ABIs
 *
 * Used in the protocol plugins to obtain the ABI of the different contracts and
 * to call them
 */
export class ChainContractsProvider<
  ContractNames extends string,
  ContractsAbiMap extends GenericAbiMap<ContractNames>,
> {
  private readonly contractsAbiMap: ContractsAbiMap

  /** CONSTRUCTOR */
  constructor(contractsAbiMap: ContractsAbiMap) {
    this.contractsAbiMap = contractsAbiMap
  }

  /**
   * Returns the ABI of the contract with the given name
   * @param contractName The name of the contract to get the ABI for
   * @returns The ABI of the contract with the given name
   */
  getContractAbi(contractName: ContractNames): Maybe<ContractsAbiMap[ContractNames]> {
    return this.contractsAbiMap[contractName]
  }
}
