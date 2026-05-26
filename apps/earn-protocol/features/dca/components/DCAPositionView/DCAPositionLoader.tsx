'use client'

import { type FC } from 'react'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import { type IDcaStrategy } from '@summerfi/sdk-common'

import { sdkApiUrl } from '@/constants/sdk'
import { DCAPositionView } from '@/features/dca/components/DCAPositionView/DCAPositionView'
import { type DCAResolvedPair } from '@/features/dca/lib/types'

import classNames from '@/features/dca/components/dca.module.css'

interface DCAPositionLoaderProps {
  order: IDcaStrategy
  pair: DCAResolvedPair
}

export const DCAPositionLoader: FC<DCAPositionLoaderProps> = ({ order, pair }) => {
  return (
    <div className={classNames.pageWrapper}>
      <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
        <DCAPositionView order={order} pair={pair} />
      </SDKContextProvider>
    </div>
  )
}
