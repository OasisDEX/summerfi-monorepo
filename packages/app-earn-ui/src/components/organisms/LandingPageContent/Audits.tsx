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
}: {
  description: string
  image: StaticImageData
  auditUrl: string
}) => {
  return (
    <div className={auditsStyles.auditBlock}>
      <Image src={image} alt={description} className={auditsStyles.auditBlockImage} />
      <Text variant="p2" as="p" className={auditsStyles.auditDescription}>
        {description}
      </Text>
      <Link href={auditUrl} target="_blank" rel="noreferrer">
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
  sherlockLogo,
  noHeader,
  fullWidth,
}: {
  chainSecurityLogo?: StaticImageData
  prototechLabsLogo?: StaticImageData
  sherlockLogo?: StaticImageData
  noHeader?: boolean
  fullWidth?: boolean
}): ReactNode => {
  return (
    <div>
      <div
        className={auditsStyles.auditsHeaderWrapper}
        style={{
          maxWidth: fullWidth ? '100%' : undefined,
          width: fullWidth ? '100%' : undefined,
          margin: fullWidth ? '0 auto' : undefined,
          padding: fullWidth ? '0' : undefined,
        }}
      >
        {!noHeader && (
          <Text variant="p2semiColorful" as="p">
            Audits
          </Text>
        )}
        <Text variant="h2" className={auditsStyles.auditsHeader}>
          Top tier security & audits
        </Text>
      </div>
      <div
        className={auditsStyles.auditBlocksWrapper}
        style={{
          maxWidth: fullWidth ? '100%' : undefined,
          width: fullWidth ? '100%' : undefined,
          margin: fullWidth ? '0 auto' : undefined,
          padding: fullWidth ? '0' : undefined,
        }}
      >
        {chainSecurityLogo && (
          <AuditBlock
            auditUrl="https://docs.summer.fi/summer.fi/audits"
            image={chainSecurityLogo}
            description="ChainSecurity works with top-tier DeFi protocols, research institutions, central banks, and large organizations."
          />
        )}
        {prototechLabsLogo && (
          <AuditBlock
            auditUrl="https://docs.summer.fi/summer.fi/audits"
            image={prototechLabsLogo}
            description="Prototech Labs is a DeFi & Web3 professional services consultancy helping businesses, DAOs, and protocols implement innovative blockchain solutions."
          />
        )}
        {sherlockLogo && (
          <AuditBlock
            auditUrl="https://docs.summer.fi/summer.fi/audits"
            image={sherlockLogo}
            description="Sherlock secures leading Web3 protocols, elite independent security experts, DAOs, and top-tier DeFi projects. "
          />
        )}
      </div>
    </div>
  )
}
