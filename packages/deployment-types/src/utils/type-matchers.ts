import {
  MiscDependencyConfigEntry,
  TokenDependencyConfigEntry,
  SystemConfigEntry,
} from '~deployment-config'

export function isDependencyConfigEntry(
  entry: unknown,
): entry is MiscDependencyConfigEntry | TokenDependencyConfigEntry {
  return typeof entry === 'object' && entry !== null && 'name' in entry && 'address' in entry
}

export function isSystemConfigEntry(entry: unknown): entry is SystemConfigEntry {
  return (
    typeof entry === 'object' && entry !== null && 'name' in entry && 'serviceRegistryName' in entry
  )
}
