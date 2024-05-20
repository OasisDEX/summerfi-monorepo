import { Footer as AppUiFooter } from '@summerfi/app-ui'
import dayjs from 'dayjs'
import { EXTERNAL_LINKS, INTERNAL_LINKS } from 'helpers/applicationLinks'
import { staticFilesRuntimeUrl } from 'helpers/staticPaths'
import getConfig from 'next/config'
import React from 'react'
import { Box, Container, Grid, Link, Text } from 'theme-ui'

const {
  publicRuntimeConfig: { buildHash, buildDate, showBuildInfo },
} = getConfig()

export function TemporaryFooter() {
  const commit = buildHash.substring(0, 10)
  const date = dayjs(buildDate).format('DD.MM.YYYY HH:MM')
  console.debug(`Build commit: ${commit} Build date: ${date}`)
  return (
    showBuildInfo && (
      <Container sx={{ maxWidth: '898px' }}>
        <Grid sx={{ color: 'text', fontSize: 2 }} columns={2}>
          <Text>
            Commit:{' '}
            <Link
              href={`${EXTERNAL_LINKS.GITHUB}/commit/${buildHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {commit}
            </Link>
          </Text>
          <Text>Build Date: {date}</Text>
        </Grid>
      </Container>
    )
  )
}

export function Footer() {
  return (
    <Box as="footer" sx={{ position: 'relative' }}>
      <Container sx={{ maxWidth: '1200px', mb: 5, pb: 0, pt: 2 }}>
        <AppUiFooter
          logo={staticFilesRuntimeUrl('/static/img/logos/logo_dark.svg')}
          lists={[
            {
              title: 'About',
              links: [
                {
                  label: 'Team',
                  url: INTERNAL_LINKS.about,
                },
                {
                  label: 'Contact',
                  url: EXTERNAL_LINKS.KB.CONTACT,
                },
                {
                  label: 'Careers',
                  url: EXTERNAL_LINKS.WORKABLE,
                },
                {
                  label: 'Privacy',
                  url: INTERNAL_LINKS.privacy,
                },
                {
                  label: 'Cookie Policy',
                  url: INTERNAL_LINKS.cookie,
                },
                {
                  label: 'Terms',
                  url: INTERNAL_LINKS.terms,
                },
                {
                  label: 'Security',
                  url: INTERNAL_LINKS.security,
                },
              ],
            },
            {
              title: 'Resources',
              links: [
                {
                  label: 'Blog',
                  url: EXTERNAL_LINKS.BLOG.MAIN,
                },
                {
                  label: 'Knowledge base',
                  url: EXTERNAL_LINKS.KB.HELP,
                },
                {
                  label: 'Bug bounty',
                  url: EXTERNAL_LINKS.BUG_BOUNTY,
                },
                {
                  label: 'Ajna rewards',
                  url: INTERNAL_LINKS.ajnaRewards,
                },
                {
                  label: 'Referrals',
                  url: INTERNAL_LINKS.referrals,
                },
                {
                  label: 'Brand assets',
                  url: INTERNAL_LINKS.brand,
                },
              ],
            },
            {
              title: 'Products',
              links: [
                {
                  label: 'Borrow',
                  url: INTERNAL_LINKS.borrow,
                },
                {
                  label: 'Multiply',
                  url: INTERNAL_LINKS.multiply,
                },
                {
                  label: 'Earn',
                  url: INTERNAL_LINKS.earn,
                },
              ],
            },
          ]}
          newsletter={{
            button: 'Subscribe →',
            description: 'Subscribe to the newsletter for updates',
            label: 'Temporarily disabled',
            title: 'Stay up to date with Summer.fi',
          }}
        />
      </Container>
      <TemporaryFooter />
    </Box>
  )
}
