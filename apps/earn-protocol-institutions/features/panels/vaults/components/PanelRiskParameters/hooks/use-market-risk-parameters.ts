import { type Dispatch, useCallback, useState } from 'react'

import { marketRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/market-risk-parameters-table/mapper'
import { type MarketRiskParameters } from '@/features/panels/vaults/components/PanelRiskParameters/market-risk-parameters-table/types'
import { type PanelRiskParametersAction } from '@/providers/PanekRiskParametersProvider/PanelRiskParametersProvider'

/**
 * Hook to manage market risk parameters
 * @param dispatch - Dispatch function to update the state
 * @param rawData - Raw data for the market risk parameters
 * @returns {Object} Market risk parameters management utilities:
 *   - rows: Array of market risk parameters
 *   - onCancel: Function to cancel the editing of the market risk parameters
 */
export const useMarketRiskParameters = ({
  rawData,
  dispatch,
}: {
  dispatch: Dispatch<PanelRiskParametersAction>
  rawData: MarketRiskParameters[]
}) => {
  const [updatingMarketRiskItem, setUpdatingMarketRiskItem] = useState<MarketRiskParameters | null>(
    null,
  )

  const [updatingMarketRiskMarketCap, setUpdatingMarketRiskMarketCap] = useState<string>('')
  const [updatingMarketRiskImpliedCap, setUpdatingMarketRiskImpliedCap] = useState<string>('')
  const [updatingMarketRiskMaxPercentage, setUpdatingMarketRiskMaxPercentage] = useState<string>('')

  const marketEditHandler = (item: MarketRiskParameters) => {
    setUpdatingMarketRiskItem(item)
  }

  const marketEditCancel = useCallback(() => {
    setUpdatingMarketRiskItem(null)
  }, [])

  const marketSaveHandler = useCallback(
    (item: MarketRiskParameters) => {
      setUpdatingMarketRiskItem(null)
      if (
        (updatingMarketRiskMaxPercentage.length > 0 &&
          updatingMarketRiskMaxPercentage !== item.maxPercentage.toString()) ||
        (updatingMarketRiskMarketCap.length > 0 &&
          updatingMarketRiskMarketCap !== item.marketCap.toString()) ||
        (updatingMarketRiskImpliedCap.length > 0 &&
          updatingMarketRiskImpliedCap !== item.impliedCap.toString())
      ) {
        dispatch({
          type: 'edit-market-risk-item',
          payload: {
            ...item,
            maxPercentage: updatingMarketRiskMaxPercentage
              ? Number(updatingMarketRiskMaxPercentage)
              : item.maxPercentage,
            marketCap: updatingMarketRiskMarketCap
              ? Number(updatingMarketRiskMarketCap)
              : item.marketCap,
            impliedCap: updatingMarketRiskImpliedCap
              ? Number(updatingMarketRiskImpliedCap)
              : item.impliedCap,
          },
        })
      }
      setUpdatingMarketRiskMaxPercentage('')
      setUpdatingMarketRiskMarketCap('')
      setUpdatingMarketRiskImpliedCap('')
    },
    [
      updatingMarketRiskMaxPercentage,
      updatingMarketRiskMarketCap,
      updatingMarketRiskImpliedCap,
      dispatch,
    ],
  )

  const marketOnChangeMaxPercentage = useCallback((value: string) => {
    setUpdatingMarketRiskMaxPercentage(value)
  }, [])

  const marketOnChangeMarketCap = useCallback((value: string) => {
    setUpdatingMarketRiskMarketCap(value)
  }, [])

  const marketOnChangeImpliedCap = useCallback((value: string) => {
    setUpdatingMarketRiskImpliedCap(value)
  }, [])

  const onCancel = useCallback(() => {
    setUpdatingMarketRiskItem(null)
    setUpdatingMarketRiskMarketCap('')
    setUpdatingMarketRiskMaxPercentage('')
    setUpdatingMarketRiskImpliedCap('')
  }, [])

  const rows = marketRiskParametersMapper({
    rawData,
    onEdit: marketEditHandler,
    onSave: marketSaveHandler,
    onRowEditCancel: marketEditCancel,
    updatingMarketRiskItem,
    updatingMarketRiskMarketCap,
    updatingMarketRiskMaxPercentage,
    updatingMarketRiskImpliedCap,
    onChangeMaxPercentage: marketOnChangeMaxPercentage,
    onChangeMarketCap: marketOnChangeMarketCap,
    onChangeImpliedCap: marketOnChangeImpliedCap,
  })

  return {
    rows,
    onCancel,
  }
}
