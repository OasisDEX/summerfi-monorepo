'use client'
import { type CSSProperties, type FC } from 'react'
import { Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import classNames from './SumrTransferabilityCounter.module.css'

interface SumrTransferabilityCounterProps {
  wrapperStyles?: CSSProperties
}

export const SumrTransferabilityCounter: FC<SumrTransferabilityCounterProps> = ({
  wrapperStyles,
}) => {
  return (
    <div className={classNames.sumrTransferabilityCounterWrapper} style={wrapperStyles}>
      <Text as="p" variant="p3semi" className={classNames.heading}>
        SUMR transferability governance discussion
      </Text>

      <Text as="div" variant="p3" className={classNames.textualWrapper}>
        The waiting period is over. Please check forum discussion for more details.
        <WithArrow as="p">
          <Link
            href="https://forum.summer.fi/t/rfc-when-and-under-what-circumstances-should-sumr-transfers-be-enabled/242"
            target="_blank"
            style={{ color: 'var(--earn-protocol-primary-100)' }}
          >
            Transferability discussion
          </Link>
        </WithArrow>
      </Text>
    </div>
  )
}
