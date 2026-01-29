import { Button, Card, Input, SkeletonLine, Text } from '@summerfi/app-earn-ui'

import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'

import panelAssetManagementStyles from './PanelAssetManagement.module.css'

export const PanelAssetManagementLoading = () => {
  return (
    <Card
      variant="cardSecondary"
      className={panelAssetManagementStyles.panelAssetManagementWrapper}
    >
      <div className={panelAssetManagementStyles.assetManagementBlocks}>
        <div className={panelAssetManagementStyles.statsSection}>
          <Card style={{ flexDirection: 'column' }}>
            <Text variant="p3semi" style={{ opacity: 0.7 }}>
              Vault Assets Balance
            </Text>
            <Text variant="h4">
              <SkeletonLine width={100} height={20} style={{ margin: '10px 0' }} />
            </Text>
          </Card>
          <Card style={{ flexDirection: 'column' }}>
            <Text variant="p3semi" style={{ opacity: 0.7 }}>
              Connected Wallet Deposits
            </Text>
            <Text variant="h4">
              <SkeletonLine width={100} height={20} style={{ margin: '10px 0' }} />
            </Text>
          </Card>
        </div>

        <div className={panelAssetManagementStyles.actionsSection}>
          <Card style={{ flexDirection: 'column' }}>
            <div className={panelAssetManagementStyles.actionCardHeader}>
              <Text variant="p3semi" style={{ opacity: 0.7 }}>
                Deposit
              </Text>
              <Text variant="p4" style={{ opacity: 0.6 }}>
                <SkeletonLine width={200} height={20} />
              </Text>
            </div>
            <div className={panelAssetManagementStyles.actionCardContent}>
              <Input
                variant="dark"
                inputWrapperStyles={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                }}
                placeholder="Amount to deposit"
              />
              <Button variant="primarySmall" disabled>
                Add deposit transaction
              </Button>
            </div>
          </Card>

          <Card style={{ flexDirection: 'column' }}>
            <div className={panelAssetManagementStyles.actionCardHeader}>
              <Text variant="p3semi" style={{ opacity: 0.7 }}>
                Withdraw
              </Text>
              <Text variant="p4" style={{ opacity: 0.6 }}>
                <SkeletonLine width={200} height={20} />
              </Text>
            </div>
            <div className={panelAssetManagementStyles.actionCardContent}>
              <Input
                variant="dark"
                inputWrapperStyles={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                }}
                placeholder="Amount to withdraw"
              />
              <Button variant="primarySmall" disabled>
                Add withdraw transaction
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue transactionQueue={[]} chainId={1} isLoading />
    </Card>
  )
}
