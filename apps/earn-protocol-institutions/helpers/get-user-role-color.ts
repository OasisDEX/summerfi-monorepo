import { type UserRole } from '@summerfi/summer-protocol-institutions-db'

export const getUserRoleColor = (role: UserRole) => {
  switch (role) {
    case 'SuperAdmin':
      return 'var(--earn-protocol-critical-100)'
    case 'RoleAdmin':
      return 'var(--earn-protocol-warning-100)'
    case 'Viewer':
      return 'var(--earn-protocol-success-100)'
    default:
      return 'var(--earn-protocol-neutral-100)'
  }
}
