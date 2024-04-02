import { IPool } from '@summerfi/sdk-common/protocols'

export interface IProtocolManager {
  getPool: (poolId: unknown) => Promise<IPool>
  getPosition: () => void
}
