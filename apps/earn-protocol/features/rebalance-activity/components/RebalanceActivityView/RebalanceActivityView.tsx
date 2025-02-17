'use client'
import { type FC, useMemo, useState } from 'react'
import {
  GenericMultiselect,
  getTwitterShareUrl,
  HeadingWithCards,
  TableCarousel,
  useCurrentUrl,
  useMobileCheck,
  useQueryParams,
} from '@summerfi/app-earn-ui'
import { type SDKGlobalRebalancesType, type SDKVaultsListType } from '@summerfi/app-types'
import { getRebalanceSavedGasCost, getRebalanceSavedTimeInHours } from '@summerfi/app-utils'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { RebalanceActivityTable } from '@/features/rebalance-activity/components/RebalanceActivityTable/RebalanceActivityTable'
import {
  getRebalanceActivityHeadingCards,
  rebalanceActivityHeading,
} from '@/features/rebalance-activity/components/RebalanceActivityView/cards'
import { rebalanceActivityTableCarouselData } from '@/features/rebalance-activity/components/RebalanceActivityView/carousel'
import { mapMultiselectOptions } from '@/features/rebalance-activity/table/filters/mappers'

import classNames from './RebalanceActivityView.module.scss'

interface RebalanceActivityViewProps {
  vaultsList: SDKVaultsListType
  rebalancesList: SDKGlobalRebalancesType
  searchParams?: { [key: string]: string[] }
}

export const RebalanceActivityView: FC<RebalanceActivityViewProps> = ({
  vaultsList,
  rebalancesList,
  searchParams,
}) => {
  const { setQueryParams } = useQueryParams()
  const [strategyFilter, setStrategyFilter] = useState<string[]>(searchParams?.strategies ?? [])
  const [tokenFilter, setTokenFilter] = useState<string[]>(searchParams?.tokens ?? [])
  const [protocolFilter, setProtocolFilter] = useState<string[]>(searchParams?.protocols ?? [])
  const currentUrl = useCurrentUrl()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const { strategiesOptions, tokensOptions, protocolsOptions } = useMemo(
    () => mapMultiselectOptions(vaultsList),
    [vaultsList],
  )

  const genericMultiSelectFilters = [
    {
      options: strategiesOptions,
      label: 'Strategies',
      onChange: (strategies: string[]) => {
        setQueryParams({ strategies })
        setStrategyFilter(strategies)
      },
      initialValues: strategyFilter,
    },
    {
      options: tokensOptions,
      label: 'Tokens',
      onChange: (tokens: string[]) => {
        setQueryParams({ tokens })
        setTokenFilter(tokens)
      },
      initialValues: tokenFilter,
    },
    {
      options: protocolsOptions,
      label: 'Protocols',
      onChange: (protocols: string[]) => {
        setQueryParams({ protocols })
        setProtocolFilter(protocols)
      },
      initialValues: protocolFilter,
    },
  ]

  const totalItems = vaultsList.reduce((acc, vault) => acc + Number(vault.rebalanceCount), 0)

  const savedTimeInHours = useMemo(() => getRebalanceSavedTimeInHours(totalItems), [totalItems])
  const savedGasCost = useMemo(() => getRebalanceSavedGasCost(vaultsList), [vaultsList])

  const cards = useMemo(
    () => getRebalanceActivityHeadingCards({ totalItems, savedGasCost, savedTimeInHours }),
    [totalItems, savedGasCost, savedTimeInHours],
  )

  return (
    <div className={classNames.wrapper}>
      <HeadingWithCards
        title={rebalanceActivityHeading.title}
        description={rebalanceActivityHeading.description}
        cards={cards}
        social={{
          linkToCopy: currentUrl,
          linkToShare: getTwitterShareUrl({
            url: currentUrl,
            text: 'Check out how much time and money has been saved by the Lazy Summer AI Powered Agents keeping the protocol optimized!',
          }),
        }}
      />
      <div className={classNames.filtersWrapper}>
        {genericMultiSelectFilters.map((filter) => (
          <GenericMultiselect
            key={filter.label}
            options={filter.options}
            label={filter.label}
            onChange={filter.onChange}
            initialValues={filter.initialValues}
            style={{ width: isMobile ? '100%' : 'fit-content' }}
          />
        ))}
      </div>
      <RebalanceActivityTable
        initialRebalancesList={rebalancesList}
        customRow={{
          idx: 3,
          content: <TableCarousel carouselData={rebalanceActivityTableCarouselData} />,
        }}
        filters={{
          strategyFilter,
          tokenFilter,
          protocolFilter,
        }}
      />
    </div>
  )
}
