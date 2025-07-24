import capitalize from 'lodash-es/capitalize'

import { MerchandiseFormStatus, type MerchandiseType } from '@/features/merchandise/types'

export const getMerchandiseButtonLabel = ({
  status,
  type,
}: {
  status: MerchandiseFormStatus
  type: MerchandiseType
}) => {
  switch (status) {
    case MerchandiseFormStatus.IDLE:
      return `Claim ${capitalize(type)}`
    case MerchandiseFormStatus.LOADING:
      return `Claiming ${capitalize(type)}...`
    case MerchandiseFormStatus.SUCCESS:
      return `Claimed ${capitalize(type)}`
    case MerchandiseFormStatus.ERROR:
      return `Retry to claim ${capitalize(type)}`
  }
}
