import { useMemo } from 'react'
import { type VaultApyData } from '@summerfi/app-types'
import dayjs from 'dayjs'

export const useApyUpdatedAt = ({
  vaultApyData,
}: {
  vaultApyData: VaultApyData
}): {
  apyUpdatedAtLabel: string
  apyUpdatedAtAltLabel: string
} => {
  return useMemo(() => {
    if (vaultApyData.apyTimestamp) {
      const dateNow = dayjs()
      const dateApyTimestamp = dayjs.unix(vaultApyData.apyTimestamp)

      const minutesDisplayCutoff = 10

      // If the dateApyTimestamp is more than
      // minutesDisplayCutoff minutes ago, show '>minutesDisplayCutoff'
      if (dateApyTimestamp.isBefore(dayjs().subtract(minutesDisplayCutoff, 'minute'))) {
        return {
          apyUpdatedAtLabel: `>${minutesDisplayCutoff}`,
          apyUpdatedAtAltLabel: dateApyTimestamp.format('DD/MM/YYYY HH:mm:ss'),
        }
      }

      return {
        apyUpdatedAtLabel: dateApyTimestamp.isValid()
          ? String(dateNow.diff(dateApyTimestamp, 'minutes'))
          : 'n/a',
        apyUpdatedAtAltLabel: dateApyTimestamp.isValid()
          ? dateApyTimestamp.format('DD/MM/YYYY HH:mm:ss')
          : 'n/a',
      }
    }

    return {
      apyUpdatedAtLabel: 'n/a',
      apyUpdatedAtAltLabel: 'n/a',
    }
  }, [vaultApyData.apyTimestamp])
}
