import { Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import styles from './page.module.css' // Assuming you have a CSS module for styling

export default function CookiePolicyPage() {
  return (
    <div className={styles.cookiesPageWrapper}>
      <div className={styles.contentWrapper}>
        <Text as="h3" variant="h3" style={{ marginBottom: 'var(--spacing-space-small)' }}>
          Cookie Policy
        </Text>
        <Text as="p" variant="p2semi">
          Last Updated: 17 July 2025
        </Text>{' '}
        <Text as="p" variant="p2" className={styles.p2}>
          This Policy provides our Cookie Policy regarding the nature, purpose, use, and sharing of
          personal data or other information collected from the users through cookies and other
          tracking technologies on the summer.fi website and other websites which use subdomains of
          summer.fi (the &quot;Site&quot;). We are committed to protecting and respecting your
          privacy. Please read this carefully as this Cookie Policy is legally binding when you use
          the Site.
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          As used in this Cookie Policy, &quot;we&quot;, &quot;us&quot; or &quot;our&quot; refers to
          Oazo Apps Limited, a company incorporated and registered in England, United Kingdom. You
          can reach us with any requests relating to this Cookie Policy via the contact details
          provided below.
        </Text>
        <Text as="h4" variant="h4" style={{ marginTop: 'var(--spacing-space-small)' }}>
          Data processing in connection with the Site
        </Text>
        <Text as="h5" variant="h5">
          Use of Cookies and Similar Technologies
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          The Site is using cookies. Cookies are small text files that are placed on your computer
          by websites that you visit. They are widely used in order to make websites work, or work
          more efficiently, as well as to provide information to the owners of the site. Cookies are
          typically stored on your computer&apos;s hard drive. Information collected from cookies is
          used by us to evaluate the effectiveness of our Site and analyze trends. The information
          collected from cookies allows us to determine such things as which parts of the Site are
          most visited and difficulties our visitors may experience in accessing the Site. With this
          knowledge, we can improve the quality of your experience on the Site by recognizing and
          delivering more of the most desired features and information, as well as by resolving
          access difficulties.
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          We use third party service providers, to assist us in better understanding the use of our
          Site. Our service providers will place cookies on the hard drive of your computer (or use
          similar tracking technologies, together: &quot;Cookies&quot;) and will receive information
          that we select that will educate us on such things as how visitors navigate around our
          Site. This information is aggregated to provide statistical data about our users&apos;
          Browse actions and patterns, and does not personally identify individuals. This
          information may include:
        </Text>
        <ul className={styles.list}>
          <Text as="li" variant="p2" className={styles.p2}>
            Computer or mobile device information,
          </Text>

          <Text as="li" variant="p2" className={styles.p2}>
            Website usage information, such as:
          </Text>
          <ul className={styles.list} style={{ listStyleType: 'circle' }}>
            <Text as="li" variant="p2" className={styles.p2}>
              Page views,
            </Text>
            <Text as="li" variant="p2" className={styles.p2}>
              Account changes (i.e. connecting a wallet)
            </Text>
            <Text as="li" variant="p2" className={styles.p2}>
              Button clicks,
            </Text>
            <Text as="li" variant="p2" className={styles.p2}>
              Input form changes,
            </Text>
            <Text as="li" variant="p2" className={styles.p2}>
              Errors.
            </Text>
          </ul>
        </ul>
        <Text as="p" variant="p2" className={styles.p2}>
          Our service providers analyses this information and provides us with aggregate reports.
          The information and analysis provided by our service providers will be used to assist us
          in better understanding our visitors&apos; interests in our Site and how to better serve
          those interests, as well as help ensure secure use of the website for all users. If you
          want to avoid using cookies altogether, you can disable cookies in your browser or express
          your choices in the cookie management interface. However, disabling cookies might make it
          impossible for you to use certain features of the Site. Your use of the Site with a
          browser that is configured to accept cookies constitutes acceptance of our and third-party
          cookies.
        </Text>
        <Text as="h4" variant="h4" style={{ marginTop: 'var(--spacing-space-small)' }}>
          Your rights
        </Text>
        <Text as="h5" variant="h5">
          Right to access
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          As a data subject you have the right to obtain from us free information about your
          personal data processed at any time and a copy of this information. Furthermore, you will
          have access to the following information: the purposes of the processing; the categories
          of personal data concerned; where possible, the envisaged period for which the personal
          data will be processed, or, if not possible, the criteria used to determine that period;
          the existence of the right to request from us rectification or erasure of personal data,
          or restriction of processing of personal data concerning you, or to object to such
          processing; the existence of the right to lodge a complaint with a supervisory authority;
          where the personal data are not collected directly from you, any available information as
          to their source; and the existence of automated decision-making, including profiling, and,
          at least in those cases, meaningful information about the logic involved, as well as the
          significance and envisaged consequences of such processing for you.
        </Text>
        <Text as="h5" variant="h5">
          Right to rectification
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          You have the right to obtain from us, without undue delay, the rectification of inaccurate
          personal data concerning you. Taking into account the purposes of the processing, you
          shall have the right to have incomplete personal data completed, including by means of
          providing a supplementary statement.
        </Text>
        <Text as="h5" variant="h5">
          Right to be forgotten
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          You have the right to obtain from us the erasure of personal data concerning you as soon
          as possible, and we shall have the obligation to erase personal data without undue delay
          where required by the law, including when:
        </Text>
        <ul className={styles.list}>
          <Text as="li" variant="p2" className={styles.p2}>
            the personal data is no longer necessary in relation to the purposes for which they were
            collected or otherwise processed;
          </Text>
          <Text as="li" variant="p2" className={styles.p2}>
            there is no longer a legal ground for the processing;
          </Text>
          <Text as="li" variant="p2" className={styles.p2}>
            you object to the processing and there are no overriding legitimate grounds for the
            processing;
          </Text>
          <Text as="li" variant="p2" className={styles.p2}>
            the personal data has been unlawfully processed;
          </Text>
          <Text as="li" variant="p2" className={styles.p2}>
            the personal data must be erased for compliance with a legal obligation in accordance
            with the applicable law to which we are subject.
          </Text>
        </ul>
        <Text as="h5" variant="h5">
          Right to restriction of processing
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          You have the right to obtain from us the restriction of processing where one of the
          following applies:
        </Text>
        <ul className={styles.list}>
          <Text as="li" variant="p2" className={styles.p2}>
            the accuracy of the personal data is contested by you, for a period enabling us to
            verify the accuracy of the personal data;
          </Text>

          <Text as="li" variant="p2" className={styles.p2}>
            the processing is unlawful and you oppose the erasure of the personal data and requests
            instead the restriction of their use instead;
          </Text>

          <Text as="li" variant="p2" className={styles.p2}>
            we no longer needs the personal data for the purposes of the processing, but they are
            required by you for the establishment, exercise or defense of legal claims; and/o
          </Text>

          <Text as="li" variant="p2" className={styles.p2}>
            you have objected to processing pursuant to applicable laws.
          </Text>
        </ul>
        <Text as="h5" variant="h5">
          Right to object
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          You have the right to object, on grounds relating to your particular situation, at any
          time, to the processing of personal data concerning you. We shall no longer process the
          personal data in the event of the objection, unless we can demonstrate reasonable grounds
          for the processing, which override the interests, rights and freedoms of you, or for the
          establishment, exercise or defense of legal claims.
        </Text>
        <Text as="h5" variant="h5">
          Right to withdraw data protection consent
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          You have the right to withdraw your consent to the processing of your personal data at any
          time. The Company, in turn, reserves the right to terminate your access to the Site and
          Services at any time and for any reason.
        </Text>
        <Text as="h4" variant="h4" style={{ marginTop: 'var(--spacing-space-small)' }}>
          International transfers
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          Please note that we are entitled to transfer your personal data may be transferred outside
          the EU/EEA/UK to third parties for the purposes of the data processing and external access
          by you of services provided by those third parties including to jurisdictions not offering
          the same level of data protection. In such circumstances, we ensure that such transfers
          are subject to appropriate safeguards. As personal data processors, they are obliged to
          protect data privacy to the same extent as we ourselves. We choose the processors
          carefully to ensure compliance with applicable laws.
        </Text>
        <Text as="h4" variant="h4" style={{ marginTop: 'var(--spacing-space-small)' }}>
          Data security
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          We use appropriate technical and organizational security measures to protect your personal
          data. Our security measures are continuously improved in line with technical developments.
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          Please note that any data transmission on the Internet (e.g. communication by email) is
          generally not secure and we accept no liability for data transmitted to us via the
          Internet. Unfortunately, absolute protection is not technically possible. This information
          does not apply to the websites of third parties and the corresponding links given on the
          Site. We assume no responsibility and liability for these.
        </Text>
        <Text as="h4" variant="h4" style={{ marginTop: 'var(--spacing-space-small)' }}>
          Third party cookies
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          When you use the website, you may also be sent third party cookies.
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          Our advertisers and service providers may send you cookies. They may use the information
          they obtain from your use of their cookies:
        </Text>
        <ul className={styles.list}>
          <Text as="li" variant="p2" className={styles.p2}>
            to track your browser across multiple websites
          </Text>
          <Text as="li" variant="p2" className={styles.p2}>
            to build a profile of your web surfing
          </Text>
          <Text as="li" variant="p2" className={styles.p2}>
            to target advertisements which may be of particular interest to you.
          </Text>
        </ul>
        <Text as="p" variant="p2" className={styles.p2}>
          In addition to the information we provide in this Cookie Policy, you can find out more
          information about your online choices at{' '}
          <Link
            href="http://www.youronlinechoices.com/uk/opt-out-help"
            target="_blank"
            rel="noopener noreferrer"
          >
            http://www.youronlinechoices.com/uk/opt-out-help
          </Link>
          .
        </Text>
        <Text as="h4" variant="h4" style={{ marginTop: 'var(--spacing-space-small)' }}>
          How to manage your cookie preferences?
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          We have set out below the ways you can manage your cookie preferences across your browser
          and your mobile device:
        </Text>
        <Text as="h5" variant="h5">
          Browser Cookies
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          You can prevent storage of cookies on your browser by refusing cookies or by changing your
          browser settings. Most browsers will tell you how to stop accepting new cookies, how to be
          notified when you receive a new cookie, and how to disable existing cookies. Please note
          that when you disable cookies, some features and services on the Site may not function
          properly and may cancel opt-outs that rely on cookies, such as web analytics.
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          You can find out how to manage cookies on popular browsers by following these links:
        </Text>
        <ul className={styles.list}>
          <Link
            href="https://support.google.com/chrome/answer/95647?hl=en"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text as="li" variant="p2" className={styles.p2}>
              Google Chrome
            </Text>
          </Link>
          <Link
            href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40c9-933e-0c7f-d5e1d2e6de1c"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text as="li" variant="p2" className={styles.p2}>
              Microsoft Edge
            </Text>
          </Link>
          <Link
            href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text as="li" variant="p2" className={styles.p2}>
              Mozilla Firefox
            </Text>
          </Link>
          <Link
            href="https://support.microsoft.com/en-us/topic/how-to-delete-cookie-files-in-internet-explorer-b593ae4d-93d3-9874-1234-a034293910c5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text as="li" variant="p2" className={styles.p2}>
              Microsoft Internet Explorer
            </Text>
          </Link>
          <Link
            href="https://help.opera.com/en/latest/security-and-privacy/#clearBrowseData"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text as="li" variant="p2" className={styles.p2}>
              Opera
            </Text>
          </Link>
          <Link
            href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text as="li" variant="p2" className={styles.p2}>
              Apple Safari
            </Text>
          </Link>
        </ul>
        <Text as="h5" variant="h5">
          Mobile Device Cookies
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          On your mobile device, your operating system may provide you with additional options to
          opt-out of interest based advertising or to otherwise reset your mobile identifiers. For
          example, you may use the &quot;Limit Ad Tracking&quot; setting (on iOS devices) or a
          setting to &quot;Opt-out of Interest-Based Ads&quot; (on Android) which allows you to
          limit the use of information about your use of apps for purposes of serving ads targeted
          to your interests.
        </Text>
        <Text as="h5" variant="h5">
          Private Browse
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          The &quot;Private Browse&quot; mode, offered today by all browsers, mainly allows you to
          browse the Internet without keeping a history of the pages visited or downloads. As far as
          cookies are concerned, all those recorded during your Browse will be deleted when you
          close your browser. It is therefore not a solution that allows you to refuse cookies;
          however, their life span is limited to the duration of your Browse.
        </Text>
        <Text as="h4" variant="h4" style={{ marginTop: 'var(--spacing-space-small)' }}>
          Cookies List
        </Text>
        <Text as="h5" variant="h5">
          Strictly necessary cookies
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          These cookies are necessary for the operation of the website and cannot be disabled in our
          systems. They are usually set in response to actions you have taken that constitute a
          request for services, such as setting your privacy preferences, logging in or filling in
          forms. You can set your browser to block or be informed of the existence of these cookies,
          but some parts of the website may be affected. These cookies do not store any personally
          identifying information.
        </Text>
        <div style={{ overflowX: 'auto', marginBottom: 'var(--spacing-space-medium)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Cookie subgroup
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Domain
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Cookie(s) name
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Purpose
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Summer.fi</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>First party</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Next-i18next</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Sets the language setting of the application
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Session</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Text as="h5" variant="h5">
          Performance cookies
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          These cookies allow us to determine the number of visits and sources of traffic, in order
          to measure and improve the performance of our website. They also help us to identify the
          most/least visited pages and to evaluate how visitors navigate the website. All
          information collected by these cookies is aggregated and therefore anonymised. If you do
          not accept these cookies, we will not be informed of your visit to our site.
        </Text>
        <div style={{ overflowX: 'auto', marginBottom: 'var(--spacing-space-medium)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Cookie subgroup
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Domain
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Cookie(s) name
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Purpose
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Groove</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third party</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>_ga_B62KEY1NJQ</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Analytics of the knowledge base
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>22 months</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Groove</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third party</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>_gat</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Analytics of the knowledge base
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>22 months</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Groove</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third party</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>_ga</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Analytics of the knowledge base
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>22 months</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Groove</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third party</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>_gid</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Analytics of the knowledge base
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>22 months</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Groove</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third party</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>_groove_session_2</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Analytics of the knowledge base
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Session</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Mixpanel</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third party</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  mp_5372a8300dc764fd08c9bd883eaf6
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Analytics for Summer.fi
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>12 months</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Mixpanel</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third party</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  mp_b10850880cb0a8557d878c2e602
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Analytics for Summer.fi
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>12 months</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Mixpanel</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third party</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  mp_eceeaac79053a2f9538c8e404607c4
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Analytics for Summer.fi
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>12 months</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Text as="h5" variant="h5">
          Cookies for targeted advertising
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          These cookies may be set within our website by our advertising partners. They may be used
          by these companies to profile your interests and serve you relevant advertisements on
          other websites. They do not store personal data directly, but are based on the unique
          identification of your browser and Internet device. If you do not allow these cookies,
          your advertising will be less targeted.
        </Text>
        <div style={{ overflowX: 'auto', marginBottom: 'var(--spacing-space-medium)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Cookie subgroup
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Domain
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Cookie(s) name
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Purpose
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Adroll</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third party</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>__adroll_fpc</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Marketing (retargeting)
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>12 months</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Adroll</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third party</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>__ar_v4</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Marketing (retargeting)
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>12 months</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Text as="h4" variant="h4" style={{ marginTop: 'var(--spacing-space-small)' }}>
          Amendments to this Policy
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          We may amend this Cookie Policy at any time by posting the amended version on the Site
          including the effective date of the amended version. We will post the updated Cookie
          Policy on the Site, and ask for your consent to the changes when legally required.
        </Text>
        <Text as="h4" variant="h4" style={{ marginTop: 'var(--spacing-space-small)' }}>
          Conflict or Inconsistency
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          In the event of any conflict or inconsistency between this Cookie Policy and any
          non-English language translation thereof, the terms and provisions of this Cookie Policy
          shall control.
        </Text>
        <Text as="h4" variant="h4" style={{ marginTop: 'var(--spacing-space-small)' }}>
          Contact
        </Text>
        <Text as="p" variant="p2" className={styles.p2}>
          Please contact us with questions, comments, or concerns regarding our Cookie Policy as
          well as with any requests at <Link href="mailto:legal@summer.fi">legal@summer.fi</Link>.
        </Text>
      </div>
    </div>
  )
}
