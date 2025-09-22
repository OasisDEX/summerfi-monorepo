import { type SessionPayload } from '@/features/auth/types'

const noPrivileges = {
  canManageUsers: false,
}

export const getUserPrivileges = (session: SessionPayload, institutionId: string) => {
  const institution = session.user?.institutionsList?.find((i) => i.name === institutionId)

  if (!institution) {
    return noPrivileges
  }
  const { role } = institution

  if (role === 'SuperAdmin') {
    return {
      canManageUsers: true,
    }
  }
  if (role === 'RoleAdmin') {
    return {
      canManageUsers: true,
    }
  }

  if (role === 'Viewer') {
    return noPrivileges
  }

  // In case of unexpected role value, return no privileges
  return noPrivileges
}
