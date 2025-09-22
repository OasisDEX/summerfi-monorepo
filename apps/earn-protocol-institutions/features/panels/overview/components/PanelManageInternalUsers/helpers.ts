import dayjs from 'dayjs'

export const institutionsInternalUsersDisplayRow = (v: unknown, accessor?: string) => {
  if (accessor === 'userSub') {
    const sub = v as string

    return `${sub.slice(0, 4)}...${sub.slice(-4)}`
  }
  if (accessor === 'users') return ''
  if (accessor === 'institutionId') return ''
  if (v === null || v === undefined) return ''
  if (v instanceof Date) return dayjs(v).format('YYYY-MM-DD HH:mm:ss')
  if (typeof v === 'object') return JSON.stringify(v)

  return String(v)
}
