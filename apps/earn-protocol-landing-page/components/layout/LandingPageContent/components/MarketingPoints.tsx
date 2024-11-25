import { type ReactNode } from 'react'

import marketingPointsStyles from './MarketingPoints.module.scss'

export const MarketingPoints = ({ children }: { children: ReactNode }) => (
  // this just wraps the blocks and adds proper spacing between them
  <div className={marketingPointsStyles.flexGapped}>{children}</div>
)
