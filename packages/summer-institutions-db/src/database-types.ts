import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type UserRole = 'RoleAdmin' | 'SuperAdmin' | 'Viewer'

export interface GlobalAdmins {
  createdAt: Generated<Timestamp>
  id: Generated<number>
  userSub: string
}

export interface Institutions {
  createdAt: Generated<Timestamp>
  displayName: string
  id: Generated<number>
  logoFile: Buffer | null
  logoUrl: Generated<string>
  name: string
}

export interface InstitutionUsers {
  createdAt: Generated<Timestamp>
  id: Generated<number>
  institutionId: number
  role: UserRole | null
  userSub: string
}

export interface Database {
  globalAdmins: GlobalAdmins
  institutions: Institutions
  institutionUsers: InstitutionUsers
}
