import { IDebtConfig } from '@summerfi/sdk-common/protocols'

export interface IAaveV3DebtConfig extends IDebtConfig {
  borrowingEnabled: boolean
}
