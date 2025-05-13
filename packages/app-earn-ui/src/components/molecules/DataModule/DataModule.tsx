import { type FC, type ReactNode } from 'react'
import clsx from 'clsx'

import { Card, type CardVariant } from '@/components/atoms/Card/Card.tsx'
import { DataBlock, type DataBlockProps } from '@/components/molecules/DataBlock/DataBlock.tsx'

import classNames from './DataModule.module.css'

interface DataModuleProps {
  dataBlock: DataBlockProps
  actionable?: ReactNode
  cardClassName?: string
  cardVariant?: CardVariant
  gradientBackground?: boolean
}

export const DataModule: FC<DataModuleProps> = ({
  dataBlock,
  actionable,
  cardClassName,
  gradientBackground,
  cardVariant = 'cardSecondary',
}) => {
  return (
    <Card
      className={clsx(classNames.dataModuleWrapper, cardClassName, {
        [classNames.gradientBackground]: gradientBackground,
      })}
      variant={cardVariant}
    >
      <DataBlock {...dataBlock} />
      <div className={classNames.actionable}>{actionable}</div>
    </Card>
  )
}
