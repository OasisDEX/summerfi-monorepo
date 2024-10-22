import type { OasisPosition } from './types'

export interface IFeeManagerClient {
  GetPosition(id: string): Promise<OasisPosition | undefined>
}
