import { Card, SkeletonLine, Text } from '@summerfi/app-earn-ui'

/**
 * Shared loading skeleton for the RWA vault admin tabs (roles / rounds / transfers / whitelist).
 * These tabs are client-driven (ClientSideSdkWrapper) and previously transitioned through a blank
 * frame, unlike the standard-vault tabs which each ship a `loading.tsx` skeleton. This gives them a
 * matching titled-card skeleton so the navigation feels consistent. Generic on purpose — the panels
 * differ (table / round cards / forms) but all read as a titled card of rows while loading.
 */
export const PanelRwaLoading = ({ title }: { title: string }) => {
  return (
    <Card variant="cardSecondary">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        <Text as="h5" variant="h5">
          {title}
        </Text>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonLine key={index} width="100%" height="20px" />
            ))}
          </div>
        </Card>
      </div>
    </Card>
  )
}
