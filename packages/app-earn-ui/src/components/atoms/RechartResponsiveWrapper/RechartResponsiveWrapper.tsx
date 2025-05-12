import { type FC, type ReactNode } from 'react'

import classNames from './RechartResponsiveWrapper.module.css'

interface RechartResponsiveWrapperProps {
  children: ReactNode
  height?: string
}

export const RechartResponsiveWrapper: FC<RechartResponsiveWrapperProps> = ({
  children,
  height = '400px',
}) => (
  <div className={classNames.chartWrapper} style={{ height }}>
    <div className={classNames.chartFlexbox}>{children}</div>
  </div>
)
