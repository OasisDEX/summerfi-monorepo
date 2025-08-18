import { PanelActivity } from '@/features/panels/vaults/components/PanelActivity/PanelActivity'

export default async function InstitutionVaultActivityPage() {
  // simulate loading state
  // eslint-disable-next-line no-promise-executor-return
  const _dummy = await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate loading delay

  return <PanelActivity />
}
