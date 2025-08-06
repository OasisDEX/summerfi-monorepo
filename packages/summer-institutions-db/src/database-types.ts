import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export interface Institutions {
  displayName: string
  id: Generated<number>
  logoFile: Buffer | null
  logoUrl: Generated<string>
  name: string
}

export interface Database {
  institutions: Institutions
}
