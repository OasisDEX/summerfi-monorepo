import { type Dispatch, type SetStateAction } from 'react'
import { type TOSState } from '@summerfi/app-types'
import type { ColumnType } from 'kysely'

export type TOSSignMessage = (data: string) => Promise<string | undefined>

export type TOSInput = {
  signMessage: TOSSignMessage
  chainId: number
  walletAddress?: string
  /**
   * The version must be in the following format: {name}_version-DD.MM.YYYY
   */
  version: string
  cookiePrefix: string
  isGnosisSafe: boolean
  host?: string
  forceDisconnect?: () => void
}

export interface TOSVerifyAcceptance {
  acceptance: boolean
  updated?: boolean
  authorized?: boolean
}

export type TosUpdate = Dispatch<SetStateAction<TOSState>>

/**
 * SERVER TYPES
 */
type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface TosApproval {
  address: string
  chainId: Generated<number>
  docVersion: string
  message: Generated<string>
  signature: Generated<string>
  signDate: Timestamp
}

export type TOSRequiredDB = {
  tosApproval: TosApproval
}

export interface TOSRequestContext {
  params: {
    version: string
    walletAddress: string
    cookiePrefix: string
  }
}
