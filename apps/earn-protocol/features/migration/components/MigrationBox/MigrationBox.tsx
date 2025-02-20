import { type FC } from 'react'
import { Card, Expander, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import classNames from './MigrationBox.module.scss'

interface MigrationBoxProps {
  className?: string
}

export const MigrationBox: FC<MigrationBoxProps> = ({ className }) => {
  return (
    <Card
      variant="cardPrimaryColorfulBorder"
      className={clsx(classNames.migrationBoxWrapper, className)}
    >
      <Expander title={<Text variant="p2semi">Migrate to SummerFi</Text>}>dsadsadsa</Expander>
    </Card>
  )
}
