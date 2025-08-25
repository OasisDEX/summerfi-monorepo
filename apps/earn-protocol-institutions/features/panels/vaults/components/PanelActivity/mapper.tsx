import { Button, Icon, TableCellText } from '@summerfi/app-earn-ui'

import { type InstitutionVaultActivityItem } from '@/types/institution-data'

import classNames from './PanelActivity.module.css'

export const activityMapper = (activity: InstitutionVaultActivityItem[]) => {
  return activity.map((item) => {
    return {
      content: {
        when: <TableCellText>{item.when}</TableCellText>,
        type: <TableCellText>{item.type}</TableCellText>,
        message: <TableCellText>{item.message}</TableCellText>,
        action: (
          <TableCellText style={{ marginLeft: '40px' }}>
            <Button
              variant="unstyled"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Icon iconName="edit" size={16} className={classNames.onEdit} />
            </Button>
          </TableCellText>
        ),
      },
    }
  })
}
