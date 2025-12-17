import { type ReactNode } from 'react'

export type VaultRiskParameters = {
  id: string
  parameter: string
  value: number
  token?: string
  action?: ReactNode
}
