import { MerchandiseFaq } from '@/features/merchandise/components/MerchandiseFaq/MerchandiseFaq'
import { MerchandiseForm } from '@/features/merchandise/components/MerchandiseForm/MerchandiseForm'
import { MerchandiseHeading } from '@/features/merchandise/components/MerchandiseHeading/MerchandiseHeading'
import { MerchandiseImages } from '@/features/merchandise/components/MerchandiseImages/MerchandiseImages'
import { type MerchandiseType } from '@/features/merchandise/types'

import classNames from './MerchandisePageView.module.css'

interface MerchandisePageViewProps {
  type: MerchandiseType
  walletAddress: string
}

export const MerchandisePageView = ({ type, walletAddress }: MerchandisePageViewProps) => {
  return (
    <div className={classNames.merchandisePageViewWrapper}>
      <div className={classNames.merchandisePageViewMainContent}>
        <div className={classNames.merchandisePageViewMainContentLeft}>
          <MerchandiseHeading type={type} walletAddress={walletAddress} />
          <MerchandiseForm type={type} walletAddress={walletAddress} />
        </div>
        <MerchandiseImages type={type} />
      </div>
      <MerchandiseFaq />
    </div>
  )
}
