import { SetupTriggerEventBody, ValidationResults } from '~types'
import { TransactionFragment } from './encode-function-for-dpm'

export interface ServiceContainer<Trigger extends SetupTriggerEventBody> {
  simulatePosition: (params: { trigger: Trigger }) => Promise<unknown>
  validate: (params: { trigger: Trigger }) => Promise<ValidationResults>
  getTransaction: (params: { trigger: Trigger }) => Promise<{
    transaction: TransactionFragment
    encodedTriggerData: `0x${string}`
  }>
}
