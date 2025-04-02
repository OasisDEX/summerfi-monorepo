export interface SumrNetApyConfig {
  withSumr: boolean
  dilutedValuation: string
}

export interface SlippageConfig {
  slippage: string
}

export enum LocalConfigDispatchActions {
  UPDATE_SUMR_NET_APY_CONFIG = 'UPDATE_SUMR_NET_APY_CONFIG',
  UPDATE_SLIPPAGE_CONFIG = 'UPDATE_SLIPPAGE_CONFIG',
}

export type LocalConfigActions =
  | {
      type: LocalConfigDispatchActions.UPDATE_SUMR_NET_APY_CONFIG
      payload: SumrNetApyConfig
    }
  | {
      type: LocalConfigDispatchActions.UPDATE_SLIPPAGE_CONFIG
      payload: SlippageConfig
    }

export interface LocalConfigState {
  sumrNetApyConfig: SumrNetApyConfig
  slippageConfig: SlippageConfig
}

export const localConfigReducer = (
  prevState: LocalConfigState,
  action: LocalConfigActions,
): LocalConfigState => {
  switch (action.type) {
    case LocalConfigDispatchActions.UPDATE_SUMR_NET_APY_CONFIG:
      return {
        ...prevState,
        sumrNetApyConfig: {
          ...prevState.sumrNetApyConfig,
          ...action.payload,
          dilutedValuation: action.payload.dilutedValuation.replaceAll(',', ''),
        },
      }
    case LocalConfigDispatchActions.UPDATE_SLIPPAGE_CONFIG:
      return {
        ...prevState,
        slippageConfig: {
          ...prevState.slippageConfig,
          slippage: action.payload.slippage.replaceAll(',', ''),
        },
      }
    default:
      return prevState
  }
}
