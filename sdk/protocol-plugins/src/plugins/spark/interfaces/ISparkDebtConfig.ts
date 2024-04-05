import { IDebtConfig } from '@summerfi/sdk-common/protocols'

export interface ISparkDebtConfig extends IDebtConfig {
  borrowingEnabled: boolean
}
