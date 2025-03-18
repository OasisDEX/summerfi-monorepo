import { type Deposit, type Withdraw } from '@/graphql/clients/latest-activity/client'

export type DepositOrWithdraw = Deposit | Withdraw

export type UserActivity = DepositOrWithdraw & {
  type: 'deposit' | 'withdraw'
}
