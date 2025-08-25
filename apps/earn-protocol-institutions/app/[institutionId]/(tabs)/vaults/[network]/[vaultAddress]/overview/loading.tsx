import { Card, LoadingSpinner } from '@summerfi/app-earn-ui'

export default function InstitutionVaultsOverviewLoadingTab() {
  return (
    <Card variant="cardSecondary">
      <LoadingSpinner size={40} style={{ margin: '40px auto' }} />
    </Card>
  )
}
