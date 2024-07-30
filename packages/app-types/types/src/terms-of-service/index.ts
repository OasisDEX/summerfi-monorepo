export enum TOSStatus {
  INIT = 'init',
  WAITING_FOR_SIGNATURE = 'waitingForSignature',
  WAITING_FOR_ACCEPTANCE = 'waitingForAcceptance',
  WAITING_FOR_ACCEPTANCE_UPDATED = 'waitingForAcceptanceUpdated',
  LOADING = 'loading',
  DONE = 'done',
  RETRY = 'retry',
}

export type TOSInitializedStep = {
  status: TOSStatus.INIT
}

export type TOSWaitingForSignatureStep = {
  status: TOSStatus.WAITING_FOR_SIGNATURE
  action: () => void
}

export type TOSWaitingForAcceptanceStep = {
  status: TOSStatus.WAITING_FOR_ACCEPTANCE
  action: () => void
}

export type TOSWaitingForAcceptanceUpdatedStep = {
  status: TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED
  action: () => void
}

export type TOSLoadingStep = {
  status: TOSStatus.LOADING
  previousStatus:
    | TOSStatus.WAITING_FOR_SIGNATURE
    | TOSStatus.WAITING_FOR_ACCEPTANCE
    | TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED
}

export type TOSFinishedStep = {
  status: TOSStatus.DONE
}

export type TOSRetryStep = {
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
