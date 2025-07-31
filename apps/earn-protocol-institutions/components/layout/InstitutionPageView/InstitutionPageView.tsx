import { type FC } from 'react'

import styles from './InstitutionPageView.module.css'

interface InstitutionPageViewProps {
  institutionName: string
  totalValue: number
  numberOfVaults: number
  thirtyDayAvgApy: number
  allTimePerformance: number
  vaultData: {
    name: string
    asset: string
    nav: number
    aum: number
    fee: number
    inception: number
  }
}

export const InstitutionPageView: FC<InstitutionPageViewProps> = ({
  institutionName,
  totalValue,
  numberOfVaults,
  thirtyDayAvgApy,
  allTimePerformance,
  vaultData,
}) => {
  return <div className={styles.institutionPageView}>InstitutionPageView</div>
}
