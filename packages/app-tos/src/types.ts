export enum TOSStatus {
  INIT = 'init',
  WAITING_FOR_SIGNATURE = 'waitingForSignature',
  WAITING_FOR_ACCEPTANCE = 'waitingForAcceptance',
  WAITING_FOR_ACCEPTANCE_UPDATED = 'waitingForAcceptanceUpdated',
  LOADING = 'loading',
  DONE = 'done',
  RETRY = 'retry',
}

type TOSInitializedStep = {
  status: TOSStatus.INIT
}

type TOSWaitingForSignatureStep = {
  status: TOSStatus.WAITING_FOR_SIGNATURE
  action: () => void
}

type TOSWaitingForAcceptanceStep = {
  status: TOSStatus.WAITING_FOR_ACCEPTANCE
  action: () => void
}

type TOSWaitingForAcceptanceUpdatedStep = {
  status: TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED
  action: () => void
}

type TOSLoadingStep = {
  status: TOSStatus.LOADING
  previousStatus:
    | TOSStatus.WAITING_FOR_SIGNATURE
    | TOSStatus.WAITING_FOR_ACCEPTANCE
    | TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED
}

type TOSFinishedStep = {
  status: TOSStatus.DONE
}

type TOSRetryStep = {
  status: TOSStatus.RETRY
  error: string
  action: () => void
}

export type TOSState =
  | TOSInitializedStep
  | TOSWaitingForSignatureStep
  | TOSWaitingForAcceptanceStep
  | TOSWaitingForAcceptanceUpdatedStep
  | TOSLoadingStep
  | TOSFinishedStep
  | TOSRetryStep

export type TOSSignMessage = (data: string, account: string) => Promise<string>

export type TOSInput = {
  signMessage: TOSSignMessage
  chainId: number
  walletAddress: string
  version: string
  isGnosisSafe: boolean
  host?: string
}
