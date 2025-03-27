import { type MigrationReducerAction, type MigrationState, MigrationSteps } from './types'

export const migrationState: MigrationState = {
  step: MigrationSteps.INIT,
  approveStatus: undefined,
  migrationStatus: undefined,
  walletAddress: '0x0', // dummy, invalid address for init
}

export const migrationReducer = (prevState: MigrationState, action: MigrationReducerAction) => {
  switch (action.type) {
    case 'update-step':
      return {
        ...prevState,
        step: action.payload,
      }
    case 'update-approve-status':
      return {
        ...prevState,
        approveStatus: action.payload,
      }
    case 'update-migration-status':
      return {
        ...prevState,
        migrationStatus: action.payload,
      }
    default:
      return prevState
  }
}
