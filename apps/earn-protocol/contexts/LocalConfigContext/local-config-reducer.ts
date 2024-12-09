export interface SumrNetApyConfig {
  withSumr: boolean
  dilutedValuation: string
}

export enum LocalConfigDispatchActions {
  UPDATE_SUMR_NET_APY_CONFIG = 'UPDATE_SUMR_NET_APY_CONFIG',
}

export type LocalConfigActions = {
  type: LocalConfigDispatchActions.UPDATE_SUMR_NET_APY_CONFIG
  payload: SumrNetApyConfig
}

export interface LocalConfigState {
  sumrNetApyConfig: SumrNetApyConfig
}

export const localConfigReducer = (prevState: LocalConfigState, action: LocalConfigActions) => {
  switch (action.type) {
    case LocalConfigDispatchActions.UPDATE_SUMR_NET_APY_CONFIG:
      return {
        ...prevState,
        sumrNetApyConfig: {
          ...prevState.sumrNetApyConfig,
          ...action.payload,
        },
      }
    default:
      return prevState
  }
}
