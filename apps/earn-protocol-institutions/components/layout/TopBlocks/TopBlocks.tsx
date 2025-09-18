import { Card, DataBlock } from '@summerfi/app-earn-ui'

import topBlocksStyles from './TopBlocks.module.css'

type TopBlocksProps = {
  blocks: {
    title: string
    value: string | number
    colorful?: boolean
  }[]
}

export const TopBlocks = ({ blocks }: TopBlocksProps) => {
  return (
    <div className={topBlocksStyles.topBlocksWrapper}>
      {blocks.map((block) => (
        <Card key={block.title} variant={block.colorful ? 'cardGradientFull' : 'cardSecondary'}>
          <DataBlock
            title={block.title}
            titleSize="medium"
            titleStyle={
              block.colorful
                ? {
                    color: 'var(--color-text-secondary)',
                  }
                : {}
            }
            value={block.value}
            valueSize="large"
          />
        </Card>
      ))}
    </div>
  )
}
