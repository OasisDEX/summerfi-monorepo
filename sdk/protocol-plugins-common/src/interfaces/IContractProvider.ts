import { ProtocolName } from '@summerfi/sdk-common'

export interface IContractProvider {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  getContractDef(contractName: string, protocolName: ProtocolName): any
}
