import dynamic from 'next/dynamic'

export const VaultOpenView = dynamic(() =>
  import('@/components/layout/VaultOpenView/VaultOpenViewComponent').then(
    (mod) => mod.VaultOpenViewWrapper,
  ),
)
