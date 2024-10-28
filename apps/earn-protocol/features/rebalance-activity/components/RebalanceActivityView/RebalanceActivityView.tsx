'use client'

import { type FC, useMemo } from 'react'
import { HeadingWithCards, Table, TableCarousel } from '@summerfi/app-earn-ui'

import { rebalancingActivityColumns } from '@/features/rebalance-activity/table/columns'
import { rebalancingActivityMapper } from '@/features/rebalance-activity/table/mapper'
import { type RebalancingActivityRawData } from '@/features/rebalance-activity/table/types'

import classNames from './RebalanceActivityView.module.scss'

const carouselData = [
  {
    title: 'Reduced costs',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus massa ac sapien eleifend.',
    link: {
      label: 'Add to position',
      href: '/',
    },
  },
  {
    title: 'Optimized Yield',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus massa ac sapien eleifend.',
    link: {
      label: 'Add to position',
      href: '/',
    },
  },
  {
    title: 'Saved Time',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus massa ac sapien eleifend.',
    link: {
      label: 'Add to position',
      href: '/',
    },
  },
]

interface RebalanceActivityViewProps {
  rawData: RebalancingActivityRawData[]
}

export const RebalanceActivityView: FC<RebalanceActivityViewProps> = ({ rawData }) => {
  const rows = useMemo(() => rebalancingActivityMapper(rawData), [rawData])

  return (
    <div className={classNames.wrapper}>
      <HeadingWithCards
        title="Lazy Summer Global Rebalance Activity"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam quis risus eget."
        cards={[
          {
            title: 'Rebalance actions',
            value: '3,213',
            description:
              'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
          },
          {
            title: 'User saved time',
            value: '2,184 hours',
            description:
              'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
          },
          {
            title: 'Gas cost savings',
            value: '1.23m',
            description:
              'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
          },
        ]}
      />
      <Table
        rows={rows}
        columns={rebalancingActivityColumns}
        customRow={{
          idx: 1,
          content: <TableCarousel carouselData={carouselData} />,
        }}
      />
    </div>
  )
}
