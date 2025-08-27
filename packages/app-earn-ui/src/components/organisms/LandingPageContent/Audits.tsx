import { type ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'

import auditsStyles from './Audits.module.css'

const AuditBlock = ({
  description,
  image,
  auditUrl,
  onAuditClick,
}: {
  description: string
  image: StaticImageData
  auditUrl: string
  onAuditClick: () => void
}) => {
  return (
    <div className={auditsStyles.auditBlock}>
      <Image src={image} alt={description} className={auditsStyles.auditBlockImage} />
      <Text variant="p2" as="p" className={auditsStyles.auditDescription}>
        {description}
      </Text>
      <Link href={auditUrl} target="_blank" rel="noreferrer" onClick={onAuditClick}>
        <WithArrow>
          <Text variant="p2semi">Learn more</Text>
        </WithArrow>
      </Link>
      <hr />
    </div>
  )
}

export const Audits = ({
  chainSecurityLogo,
  prototechLabsLogo,
  onAuditClick,
}: {
  chainSecurityLogo: StaticImageData
  prototechLabsLogo: StaticImageData
  onAuditClick: (auditId: string) => void
}): ReactNode => {
  const handleAuditClick = (auditId: string) => () => {
    onAuditClick(auditId)
  }

  return (
    <div>
      <div className={auditsStyles.auditsHeaderWrapper}>
        <Text variant="p2semiColorful" as="p">
          Audits
        </Text>
        <Text variant="h2" className={auditsStyles.auditsHeader}>
          Top tier security & audits
        </Text>
      </div>
      <div className={auditsStyles.auditBlocksWrapper}>
        <AuditBlock
          auditUrl="https://www.chainsecurity.com/smart-contract-audit-reports"
          image={chainSecurityLogo}
          description="ChainSecurity works with top-tier DeFi protocols, research institutions, central banks, and large organizations."
          onAuditClick={handleAuditClick('chain-security')}
        />
        <AuditBlock
          auditUrl="https://www.prototechlabs.dev/"
          image={prototechLabsLogo}
          description="Prototech Labs is a DeFi & Web3 professional services consultancy helping businesses, DAOs, and protocols implement innovative blockchain solutions."
          onAuditClick={handleAuditClick('prototech-labs')}
        />
      </div>
    </div>
  )
}
