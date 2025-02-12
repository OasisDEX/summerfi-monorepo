'use client'
import React, { useState } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import styles from './InfoAccordion.module.scss'

interface InfoAccordionProps {
  header: string
  children: React.ReactNode
}

export const InfoAccordion: React.FC<InfoAccordionProps> = ({ header, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleAccordion = () => setIsOpen(!isOpen)

  return (
    <div className={styles.infoAccordion}>
      <div className={styles.header} onClick={toggleAccordion} style={{ cursor: 'pointer' }}>
        <Text variant="p3semi" as="p">
          {header}
        </Text>
        <Text variant="p3semi" as="p">
          {isOpen ? '-' : '+'}
        </Text>
      </div>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  )
}

export default InfoAccordion
