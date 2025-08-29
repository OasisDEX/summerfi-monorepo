'use client'
import {
  createContext,
  type Dispatch,
  type FC,
  type ReactNode,
  useContext,
  useReducer,
} from 'react'
import isEmpty from 'lodash-es/isEmpty'

import {
  type LocalConfigActions,
  localConfigReducer,
  type LocalConfigState,
} from '@/contexts/LocalConfigContext/local-config-reducer'

type LocalConfigType = {
  state: LocalConfigState
  dispatch: Dispatch<LocalConfigActions>
}

const defaultLocalConfig: LocalConfigState = {
  sumrNetApyConfig: {
    withSumr: true,
    dilutedValuation: '250000000',
  },
  slippageConfig: {
    slippage: '0.1',
  },
}

const LocalConfigContext = createContext<LocalConfigType>({
  state: defaultLocalConfig,
  dispatch: () => {},
})

/**
 * LocalConfigContextProvider is used to properly handle SSR, since cookies can be used both on client and server side.
 * Additionally, this provider maintains the global state of the local config.
 */
export const LocalConfigContextProvider: FC<{
  value: Partial<LocalConfigState>
  children: ReactNode
}> = ({ value, children }) => {
  const resolvedInitialState: LocalConfigState = {
    sumrNetApyConfig:
      value.sumrNetApyConfig && !isEmpty(value.sumrNetApyConfig)
        ? value.sumrNetApyConfig
        : defaultLocalConfig.sumrNetApyConfig,
    slippageConfig:
      value.slippageConfig && !isEmpty(value.slippageConfig)
        ? value.slippageConfig
        : defaultLocalConfig.slippageConfig,
  }
  const [state, dispatch] = useReducer(localConfigReducer, resolvedInitialState)

  return (
    <LocalConfigContext.Provider value={{ state, dispatch }}>
      {children}
    </LocalConfigContext.Provider>
  )
}

export const useLocalConfig = (): LocalConfigType => {
  return useContext(LocalConfigContext)
}
