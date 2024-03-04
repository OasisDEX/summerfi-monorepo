import { ConfigEntry } from '~deployment-types/common/configEntry'

export function isConfigEntry(entry: unknown): entry is ConfigEntry {
  return typeof entry === 'object' && entry !== null && 'name' in entry
}
