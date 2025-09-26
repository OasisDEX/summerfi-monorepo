import { type UserRole } from '@summerfi/summer-protocol-institutions-db'
import dayjs from 'dayjs'

import { getUserRoleColor } from '@/helpers/get-user-role-color'

export const institutionsInternalUsersDisplayRow = (v: unknown, accessor?: string) => {
  if (accessor === 'userSub') {
    const sub = v as string

    return `${sub.slice(0, 4)}...${sub.slice(-4)}`
  }
  if (accessor === 'users') return ''
  if (accessor === 'role')
    return (
      <span style={{ fontWeight: 'bold', color: getUserRoleColor(v as UserRole) }}>
        {v as string}
      </span>
    )
  if (accessor === 'institutionId') return ''
  if (v === null || v === undefined) return ''
  if (v instanceof Date) return dayjs(v).format('YYYY-MM-DD HH:mm:ss')
  if (typeof v === 'object') return JSON.stringify(v)

  return String(v)
}
