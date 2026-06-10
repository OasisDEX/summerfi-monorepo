/** A granted access-control role: who holds it, on which contract, and for which institution. */
export type Role = {
  id: string
  name: string
  owner: string
  targetContract: string
  institution: {
    id: string
  }
}

/** Response wrapper carrying a list of {@link Role}s. */
export type RolesResponse = {
  roles: Role[]
}
