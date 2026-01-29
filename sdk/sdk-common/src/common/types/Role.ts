export type Role = {
  id: string
  name: string
  owner: string
  targetContract: string
  institution: {
    id: string
  }
}

export type RolesResponse = {
  roles: Role[]
}
