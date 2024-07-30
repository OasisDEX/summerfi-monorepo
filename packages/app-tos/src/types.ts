import { type Dispatch, type SetStateAction } from 'react'
import { type TOSState } from '@summerfi/app-types'

export type TOSSignMessage = (data: string) => Promise<string | undefined>

export type TOSInput = {
  signMessage: TOSSignMessage
  chainId: number
  walletAddress?: string
  version: string
  isGnosisSafe: boolean
  host?: string
}

export interface TOSVerifyAcceptance {
  acceptance: boolean
  updated?: boolean
  authorized?: boolean
}

export type TosUpdate = Dispatch<SetStateAction<TOSState>>
