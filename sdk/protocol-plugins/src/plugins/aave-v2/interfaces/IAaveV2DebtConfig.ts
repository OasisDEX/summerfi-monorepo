import { IDebtConfig } from '@summerfi/sdk-common/protocols'

export interface IAaveV2DebtConfig extends IDebtConfig {
    borrowingEnabled: boolean
}
