import capitalize from 'lodash-es/capitalize'

import { MerchandiseFormStatus, type MerchandiseType } from '@/features/merchandise/types'

export const getMerchandiseButtonLabel = ({
  merchFormStatus,
  type,
}: {
  merchFormStatus: MerchandiseFormStatus
  type: MerchandiseType
}) => {
  switch (merchFormStatus) {
    case MerchandiseFormStatus.IDLE:
      return `Claim ${capitalize(type)}`
    case MerchandiseFormStatus.LOADING:
      return `Claiming ${capitalize(type)}...`
    case MerchandiseFormStatus.SUCCESS:
      return `Claimed ${capitalize(type)}`
    case MerchandiseFormStatus.ERROR:
      return `Retry to claim ${capitalize(type)}`
    default:
      // Fallback case, should not happen
      return `Claim ${capitalize(type)}`
  }
}
