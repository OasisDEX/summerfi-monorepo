import { Card } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import sectionCardStyles from './SectionCard.module.css'

export const SectionCard = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <Card className={clsx(sectionCardStyles.sectionCard, className)}>{children}</Card>
}
