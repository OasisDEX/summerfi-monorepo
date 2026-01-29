export type Role = {
  id: string
  name: string
  owner: `0x${string}`
  targetContract: string
  institution: {
    id: string
  }
}

export type RolesResponse = {
  roles: Role[]
}
