import { AddressValue } from '@summerfi/sdk-common'

/**
 * Contains the contract address and ABI for a given contract
 *
 * Used as a return type for the `getContractDef` method in the different plugins
 */
export type ContractInfo = {
  address: AddressValue
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  abi: any
}
