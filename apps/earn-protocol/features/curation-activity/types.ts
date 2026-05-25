import { type CurationEvent } from '@/graphql/clients/position-history/client'

export type VaultCurationEvent = Pick<
  CurationEvent,
  'action' | 'valueBefore' | 'valueAfter' | 'caller' | 'timestamp' | 'targetContract' | 'hash'
>
