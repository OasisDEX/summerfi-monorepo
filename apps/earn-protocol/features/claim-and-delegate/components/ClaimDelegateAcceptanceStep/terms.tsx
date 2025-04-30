import { type ReactNode } from 'react'
import { Text } from '@summerfi/app-earn-ui'

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--general-space-12)',
        marginTop: 'var(--general-space-12)',
      }}
    >
      {children}
    </div>
  )
}

type ListItem = ReactNode | [ReactNode, ...ListItem[]]

const List = ({ items }: { items: ListItem[] }) => {
  const renderItem = (item: ListItem) => {
    if (Array.isArray(item)) {
      const [content, ...subItems] = item

      return (
        <>
          <Text variant="p3">{content}</Text>
          {subItems.length > 0 && (
            <ul style={{ listStyleType: 'disc', paddingLeft: 'var(--general-space-24)' }}>
              {subItems.map((subItem, idx) => (
                <li key={idx}>{renderItem(subItem)}</li>
              ))}
            </ul>
          )}
        </>
      )
    }

    return <Text variant="p3">{item}</Text>
  }

  return (
    <ul style={{ listStyleType: 'disc', paddingLeft: 'var(--general-space-24)' }}>
      {items.map((item, idx) => (
        <li key={idx}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

const Paragraph = ({ children }: { children: ReactNode }) => {
  return <Text variant="p3">{children}</Text>
}

const Heading = ({ children }: { children: ReactNode }) => {
  return <Text variant="p3semi">{children}</Text>
}

export const airdropToS = {
  header: '$SUMR TOKEN AIRDROP​ TERMS & CONDITIONS​',
  lastRevised: 'Last revised: 2025-01-27',
  content:
    'BY PARTICIPATING IN THE AIRDROP, INCLUDING, BUT NOT LIMITED TO, BY INTERACTING WITH ANY SERVICES OR USING A WALLET (AS DEFINED BELOW) PURSUANT TO THE TERMS AND PROCESSES DESCRIBED HEREIN, PARTICIPANT (AS DEFINED BELOW) ACKNOWLEDGES THAT PARTICIPANT HAS READ, UNDERSTOOD, AND AGREED TO THESE TOKEN AIRDROP TERMS & CONDITIONS IN THEIR ENTIRETY. THE PARTICIPANT IS RESPONSIBLE FOR MAKING THEIR OWN DECISION IN RESPECT OF THEIR PARTICIPATION IN THE AIRDROP AND ANY RECEIPT OF TOKENS ENABLED THEREBY. ANY PARTICIPATION IN THE AIRDROP IS SOLELY AT THE PARTICIPANT’S OWN RISK AND IT IS THE PARTICIPANT’S SOLE RESPONSIBILITY TO SEEK APPROPRIATE PROFESSIONAL, LEGAL, TAX, AND OTHER ADVICE IN RESPECT OF THE AIRDROP AND ANY RECEIPT OF THE TOKENS PRIOR TO PARTICIPATING IN THE AIRDROP AND PRIOR TO RECEIVING ANY TOKENS. BY PARTICIPATING IN THE AIRDROP, PARTICIPANT EXPRESSLY ACKNOWLEDGES AND ASSUMES ALL RISKS RELATED THERETO, INCLUDING, BUT NOT LIMITED TO, THE RISKS SET OUT BELOW. IN NO EVENT SHALL THE COMPANY OR ANY COMPANY BE HELD LIABLE IN CONNECTION WITH OR FOR ANY CLAIMS, LOSSES, DAMAGES, OR OTHER LIABILITIES, WHETHER IN CONTRACT, TORT, OR OTHERWISE, ARISING FROM, RELATED TO OR IN CONNECTION WITH THE AIRDROP OR THE RECEIPT OF ANY TOKENS. THE COMPANY DOES NOT TAKE ANY RESPONSIBILITY FOR THE PARTICIPATION BY ANY PARTICIPANT IN THE AIRDROP. THE COMPANY DOES NOT PROVIDE ANY RECOMMENDATION OR ADVICE IN RESPECT OF THE AIRDROP OR THE TOKENS. EACH PARTICIPANT PARTICIPATES IN THE AIRDROP AT THEIR OWN RISK AND RECEIVES TOKENS AT THEIR OWN RISK. THIS AGREEMENT CONTAINS AN ARBITRATION CLAUSE AND CLASS ACTION WAIVER. BY AGREEING TO THESE TERMS, PARTICIPANT AGREES (A) TO RESOLVE ALL DISPUTES (WITH LIMITED EXCEPTION) RELATED TO THE SERVICES AND/OR PRODUCTS THROUGH BINDING INDIVIDUAL ARBITRATION, WHICH MEANS THAT PARTICIPANT WAIVES ANY RIGHT TO HAVE SUCH DISPUTES DECIDED BY A JUDGE OR JURY, AND (B) TO WAIVE PARTICIPANT’S RIGHT TO PARTICIPATE IN CLASS ACTIONS, CLASS ARBITRATIONS, OR REPRESENTATIVE ACTIONS, AS SET FORTH BELOW.  ',
}

const definedTermsList = [
  '	“Affiliates” means the Company’s parents, affiliates, contractors, related companies or entities, officers, directors, employees, agents, representatives, partners and licensors.',
  '	“Airdrop” means the airdrop program organized by the Company in relation to $SUMR Tokens.',
  '	“Airdrop Address” means any IP Address, Ethereum or similar digital-asset, smart-contract, or Protocol address.',
  '	“Airdrop Period” means a specified period, as determined by the Company in its sole discretion and announced on the Protocol’s website.',
  '	“API” means application programing interface.',
  '	“App” refers to any ‘front-end’ or web interface mentioned in Article II of these terms including https://summer.fi and any subdomain.',
  '	“Airdrop Website” means the website where Participant may claim tokens located at summer.fi/earn/sumr. ',
  '	“Company” has the meaning set forth in Article II of these Terms. ',
  '	“ETH” means Ether, the native cryptocurrency of Ethereum. ',
  '	“EU” means the European Union. ',
  '	“EVM” means an Ethereum Virtual Machine. ',
  '	“Feedback” means any feedback or suggestions from Participant regarding the Airdrop Website.',
  '	“Government” means any national, federal, state, municipal, local, or foreign branch of government, including any department, agency, subdivision, bureau, commission, court, tribunal, arbitral body, or other governmental, government appointed, or quasi-governmental authority or component exercising executive, legislative, juridical, regulatory, or administrative powers, authority, or functions of or pertaining to a government instrumentality, including any parasternal company, or state-owned (majority or greater) or controlled business enterprise.',
  '	“IP Address” means an internet-protocol address. ',
  '	“Lazy Summer Protocol” means the underlying collection of smart contracts to be deployed by Lazy Summer Foundation, an affiliate of the Company, otherwise known as the Protocol. ',
  '	"OFAC" means Office of Foreign Assets Control of the U.S. Department of the Treasury.',
  '	“OFSI” means Her Majesty’s Treasury’s Office of Financial Sanctions Implementation.',
  '	“Participant” has the meaning set forth in Article II of these Terms.',
  '	“Prohibited Jurisdiction” means (a) sanctioned jurisdiction; (b) jurisdiction subject to heightened sanctions risks identified or enforced by certain countries, governments, or international authorities; or (c) jurisdiction otherwise considered high risk with respect to the Services, the Airdrop or otherwise, including Belarus, Burma (Myanmar), Burundi, Central African Republic, Congo, Côte d`Ivoire, Cuba, Iran, Iraq, Lebanon, Liberia, Libya, Mali, Nicaragua, North Korea, Somalia, South Sudan, Sudan, Syria, Crimea (Ukraine/Russia), Venezuela, Yemen, Zimbabwe. ',
  '	“Prohibited Person” means any person or entity that is (a) listed on any U.S. Government list of prohibited or restricted parties, including, without limitation, the U.S. Treasury Department’s list of Specially Designated Nationals or the U.S. Department of Commerce Denied Person’s List or Entity List, (b) located or organized in any U.S. embargoed countries or any country or region that has been designated by the U.S. Government as “terrorist supporting,” or (c) owned or controlled by such persons or entities listed in (a)-(b).',
  '	“Screening Service Provider” has the meaning set forth in Article V of these Terms. ',
  '	“SEC” means the U.S. Securities and Exchange Commission.',
  '	“Services” means all technologies, features, products, offerings, and services, including the Airdrop, provided by the Company or its Affiliates.',
  '	“Terms” means these $SUMR Token Airdrop Terms & Conditions. ',
  '	“Third-Party Publications and Services” has the meaning set forth in Article III, Paragraph 10 of these Terms. ',
  '	“Third-Party Services” means services, sites, technology, applications, products, and resources that are provided or otherwise made available by third-parties.',
  '	“Token” refers to the $SUMR token issued by the Company.  ',
  '	“Token Claims” has the meaning set forth in Article V of these Terms. ',
  '	“Token Holders” means the holders of $SUMR Tokens that that collectively control the Protocol.',
  '	“UN” means the United Nations. ',
  '	“User Content” mean any content that Participant makes available while participating in the Airdrop, including all copyrights and rights of publicity contained herein. ',
  '	“U.S.” means the United States of America.  ',
  '	“U.S. Person” has the meaning set forth in Article V of these Terms. ',
  '	“VPN” means a virtual private network. ',
  '	“Wallet” has the meaning set forth in Article III, Paragraph 12 of these Terms. ',
  '	“$SUMR” means the token received by Participant through the Airdrop.',
]

const participantsRepresentation = [
  'You represent and warrant that all information provided during the Airdrop process is true, accurate, and complete.',
  'You agree and acknowledge that (a) you are solely responsible and liable for all taxes due in connection with your participation in the Airdrop; and (b) you should consult a tax advisor with respect to the tax treatment of any Tokens received in your jurisdiction.',
  'You represent and warrant that you fulfill all eligibility criteria set forth in Section IV. You agree that you are not: (i) a Prohibited Person; (ii) directly or indirectly acting on behalf of a Prohibited Person; and (iii) located in or accessing the Services from a Prohibited Jurisdiction. You agree that you will not use a VPN or similar tool to circumvent any geo-blocking and/or other restrictions that we have implemented in connection with the Airdrop. Any such deliberate circumvention, or attempted circumvention, of our controls may permanently disqualify you from participation in the Airdrop, as determined in our sole discretion, and will be a material breach of these Terms.',
  'You warrant that you will not and undertake not to distribute or transfer any Tokens or digital assets you receive as part of the Airdrop to U.S. Persons.',
  'You acknowledge and agree that you are solely responsible for complying with all applicable laws of the jurisdiction where you reside or are located for participating in the Airdrop, claiming Tokens, accessing the Services or anything else in connection with your use of the Services. By using the Services, you represent and warrant that you meet these requirements and will not be using the Services for any illegal activity or to engage in the prohibited activities listed in Article VI of these Terms.',
  'You agree and acknowledge that your participation in the Airdrop does not violate any applicable laws, including, without limitation, applicable economic and trade sanctions and export control laws and regulations, such as those administered and enforced by the UK, EU, OFSI, OFAC, the U.S. Department of State, the U.S. Department of Commerce, the UN Security Council, and other relevant authorities.',
  'You agree and acknowledge that the Company and Affiliates reserve the right to require additional information from you and to enter, use, or share such information into or with a Screening Service Provider, and its systems, tools, or functionalities, as the Company deems appropriate in its sole discretion, including to reduce the risks of money laundering, terrorist financing, sanctions violations, or other potentially illicit activity, or as otherwise necessary to address laws and regulations that may be relevant to the Airdrop, the Tokens or the Services. You agree to provide complete and accurate information in response to any such requests. You agree and acknowledge that the Company and Affiliates are not responsible and cannot be held liable for any losses, expenses, or delays resulting from inaccurate or incomplete information, and you agree to assume full responsibility for any and all risks associated therewith.',
  'You agree and acknowledge that your participation in the Airdrop and claim of the Tokens does not require or involve any form of purchase, payment, or tangible consideration from or to us, nor otherwise require or involve any acceptance of value by us from you. You agree and acknowledge that you: (a) lawfully may receive Tokens for free via the Airdrop (other than gas fees or applicable taxes, if any, that may be due to third-parties), (b) were not promised the Tokens or any tokens (whether via the Airdrop or otherwise); and (c) took no action in anticipation of, or in reliance on, receiving the Tokens or any tokens, the occurrence of an Airdrop, or potential participation in any Airdrop.',
  'You agree and acknowledge that your eligibility to receive Airdrop tokens or participate in the Airdrop is subject to the Company’s sole discretion. The Airdrop shall be conducted during the Airdrop Period, as determined by the Company in its sole discretion and announced by the Company or an Affiliate.  You agree that you will follow the instructions set forth in any Airdrop announcement and/or such other instructions as may be provided by the Company or an Affiliate from time to time to participate in the Airdrop.',
  'You acknowledge and accept that the number of Tokens allocated to each Participant will be determined by the Company, in its sole discretion, and such allocation may vary among Participants. Tokens may be made available for claims after an initial period in which Participants can check eligibility for, but not claim, the Tokens.',
  'You agree and acknowledge that you were not offered nor led to expect to receive any Tokens and/or to participate in the Airdrop based on any documentation, commentary, calculators, metrics, and/or points systems published or otherwise made known by third-party monitoring activities (or any of its smart contracts) or providing third-party applications or services relating thereto (“Third-Party Publications and Services”). You have no claim or entitlement to the Tokens based on such Third-Party Publications and Services. The Company does not review, control, monitor, or confirm the accuracy of information that may be provided through Third-Party Publications or Services. You agree and acknowledge that you have not engaged in any activities designed to obtain Tokens, including on the basis of, or in reliance on, Third-Party Publications and Services.',
  'You agree that your failure to provide and connect an eligible Airdrop Address and/or connect a compatible third-party digital wallet (either, a “Wallet”) necessary to participate in the Airdrop may result in the forfeiture of your Tokens. You acknowledge that there may be technical limitations, delays, and/or transaction fees due or payable to third parties, such as gas fees on Ethereum transactions, to receive and/or claim Tokens through your Wallet.',
  'You agree that you are the legal and beneficial owner of the Airdrop Address that you use to access or participate in the Airdrop and the Services and will not sell, assign, or transfer legal title, ownership or control of the Airdrop Address or the Tokens to third parties to circumvent any lock-up period or to knowingly redistribute the Tokens to a person, IP Address, or Airdrop Address that would violate these Terms if claimed directly or indirectly by such person, IP Address, or Airdrop Address.',
  'By using a Wallet, you agree that you are using the Wallet in accordance with any terms and conditions of an applicable third-party provider of such Wallet. Wallets are not maintained or supported by, or associated or affiliated with, the Company. When you interact with the Airdrop or other Services, as between the Company or an Affiliate and you, you retain control over your Wallet and your digital assets at all times. Neither the Company nor its Affiliates control digital assets, including the Tokens, in your Wallet, and we accept no responsibility or liability to you in connection with your use of a Wallet. We make no representations or warranties regarding how the Airdrop or other Services will operate with, or be compatible with, any specific Wallet. The private keys necessary to access and/or transfer the digital assets held in a Wallet are not known or held by the Company. Any third party that may gain access to Participant’s login credentials, private key, or third-party cloud or storage mechanism for such information and may be able to misappropriate Tokens and/or other digital assets held by Participant. The Company has no ability to help you access or recover your private key and/or seed phrase for your Wallet. As between you and the Company, you agree and acknowledge that you are solely responsible for maintaining the confidentiality of your private key, seed phrase, or other access credentials to your Wallet, and you are solely responsible for any transaction signed with your private key. The Company is not responsible for any loss associated with Participant’s private key, seed phrase, or other access credentials, Wallet, vault, or other mechanism used to store or to control digital assets.',
  'You agree and acknowledge that if you are unable to claim the Airdrop due to technical bugs, smart contract related defects or issues, gas fees, wallet incompatibilities, loss of access to a wallet or the key thereto, or for any other reason, you will have no recourse or claim against the Company or its Affiliates. In any such cases, neither the Company nor its Affiliates will bear any liability.',
  'You agree and acknowledge that the Airdrop may require interaction with, reliance on, or an integration with third-party products or services (e.g., an App, Wallet, Protocol, network, or blockchain) that the Company does not and cannot control. In the event that you are unable to access such products, services, or integrations, or if they fail for any reason, and you are unable to participate in the Airdrop or claim the Tokens as a result, you will have no recourse or claim against us or any Affiliate, and neither we nor any Affiliate bear(s) any responsibility or liability to you.',
]

const eligibilityListOne = [
  'In any Prohibited Jurisdiction, or any other applicable sanctioned territory',
  'by or for the specific benefit of any individual or entity on the Specially Designated Nationals and Blocked Persons List maintained by OFAC (including any entities 50% or more owned by any such Specially Designated Nationals and Blocked Persons)',
  'by or for the specific benefit of any individual in the U.K. Sanctions List maintained by OFSI',
  'in respect of any wallet addresses sanctioned by OFAC or OFSI',
  'for any other use requiring a license or other governmental approval',
]

const eligibilityListTwo = [
  'You are an individual, you are at least 18 years old and have capacity to form a binding contract under all applicable laws',
  'You understand the risks inherently associated with using cryptographic and blockchain-based systems and have a working knowledge of the usage, storage, and intricacies of digital assets, such as those like the Tokens, following an Ethereum token standard (ERC-20)',
  'You have full power, authority, and validly exist under the applicable laws to enter into these Terms and access the Services, including the Airdrop',
  'You maintain the confidentiality of your credentials and assume responsibility for any and all activities that occur under your credentials',
  'You do not access or use the Services, including the Airdrop, to conduct, promote, or otherwise facilitate any illegal activity',
  'You understand that your participation in the Airdrop is entirely at your sole risk',
  'At all times you provide accurate information regarding your nationality and country of residence',
  'You and the Wallet are not or have not been subject to any US, UK EU, UN, and not directly or indirectly use the Services to finance the activities of any person currently subject to any US, UK EU or UN sanctions',
]

const tokensClaimList = [
  'Your Airdrop Address will be screened and excluded from Token Claims, at our sole discretion, if we detect threshold transactions between your Airdrop Address and another Ethereum or similar digital-asset, smart-contract, or Protocol address associated with certain risk-exposure categories established by our Screening Service Provider. The Company or an Affiliate may deny, in its sole discretion, any person or Airdrop Address with access to the Token Claims website (or otherwise exclude such person, IP Address, or Airdrop Address from Token Claims) and access to any Tokens based on data from the Company’s Screening Service Provider when such data indicates such person, IP Address, or Airdrop Address may present heightened risks based on the Company’s risk assessment framework.',
  'Your IP Address will be screened and excluded from Token Claims if our geo-location controls detect that you may be located in a Prohibited Jurisdiction. You agree and understand that the Prohibited Jurisdictions are subject to change at our sole discretion without notice to you.',
]

const prohibitedActivitiesList = [
  'Any use in violation of any valid law including, but not limited to, regulations for financial services, money laundering, economic sanctions, consumer protection, competition law, protection against discrimination or misleading advertising and, in particular, any infringement or unauthorized use of intellectual property, including violation against copyrights, patents, trademarks, trade secrets, and other property rights',
  'Concealing your identity such as by using a proxy server or by using a post box as an address for the purpose of carrying out illegal, fraudulent, or other prohibited activities',
  'Enabling (including attempting to enable) the spread of viruses, Trojans, malware, worms, or other program processes that damage, disrupt, misuse, impair, secretly intercept, destroy, or disable (operating) systems, data or information, or granting unauthorized access to systems, data, information, or the Services',
  'Using an automatic device or a mechanical or manual method for monitoring or replicating the Services or the Website without our prior written permission',
  'Engaging in any activity that seeks to defraud the Company, its Affiliates or any other person or entity, including providing any false, inaccurate, or misleading information in order to unlawfully obtain the property of another',
  'Harvesting or collecting email addresses or other contact information of other users from the Service by electronic or other means for the purposes of sending unsolicited emails or other unsolicited communications, or to further or promote any criminal activity or enterprise or provide instructional information about illegal activities',
  'Encouraging or enabling any other individual or entity to do any of the foregoing or otherwise violate these Terms',
]

const noProfessionalAdviceList = [
  'No Professional Advice. All information provided on the website or through the Airdrop or the Services, or otherwise provided by the Company or an Affiliate, is for informational purposes only and is not and should not be construed as professional advice. You should not take, or refrain from taking, any action based on any information contained on the website or obtained through the Airdrop or the Services. Before you make any financial, legal, tax, or other decisions with respect to the Airdrop or the Services, you should seek independent, professional advice from an individual who is licensed and qualified in the area for which such advice would be appropriate.',
  'No Fiduciary Duties. These Terms are not intended to, and do not, create or impose any fiduciary duties on the Company or any Affiliate. To the fullest extent permitted by law, you acknowledge and agree that we owe no fiduciary duties or liabilities to you or any other party, and that to the extent any such duties or liabilities may exist at law or in equity, those duties and liabilities are hereby irrevocably disclaimed, waived, and eliminated. You further agree that the only duties and obligations that we owe you are those set out expressly in these Terms.',
]

const disclaimersAndLimitationsListOne = [
  'Disclaimers. YOUR ACCESS TO AND USE OF THE SERVICES, THE AIRDROP AND THE PROTOCOL ARE AT YOUR OWN RISK. YOU UNDERSTAND AND AGREE THAT THE SERVICES ARE PROVIDED TO YOU ON AN “AS IS” AND “AS AVAILABLE” BASIS. WITHOUT LIMITING THE FOREGOING, TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, THE COMPANY AND ITS AFFILIATES, DISCLAIM ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING, WITHOUT LIMITATION, ANY WARRANTIES RELATING TO TITLE, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, USAGE, QUALITY, PERFORMANCE, SUITABILITY OR FITNESS OF THE SERVICES AND THE PROTOCOLS FOR ANY PARTICULAR PURPOSE, OR AS TO THE AVAILABILITY, ACCURACY, QUALITY, SEQUENCE, RELIABILITY, WORKMANSHIP, OR TECHNICAL CODING THEREOF, OR THE ABSENCE OF ANY DEFECTS THEREIN, WHETHER LATENT OR PATENT. The Company and its Affiliates make no warranty or representation and disclaim all responsibility and liability for: (a) the completeness, accuracy, availability, timeliness, security, or reliability of the Services, and the Protocol; (b) any harm to your computer system, loss of data, or other harm that results from your access to or use of the Services, the Airdrop or the Protocol; (c) the operation or compatibility with any other application or any particular system or device, including any Wallets; (d) whether the Services, the Airdrop or the Protocol will meet your requirements or be available on an uninterrupted, secure, or error-free basis; (e) whether the Services, the Airdrop or the Protocol will protect your assets from theft, hacking, cyber attack, or other form of loss caused by third-party conduct; (f) loss of funds or value resulting from intentional or unintentional slashing or as a result of a fork of any token such as via a social slashing; and (g) the deletion of, or the failure to store or transmit, your content and other communications transmitted through the use of the Services, the Airdrop or the Protocol, and maintained by the Company or an Affiliate in compliance with applicable data privacy rules. No advice or information, whether oral or written, obtained from the Company and its Affiliates or through the Services, will create any warranty or representation not expressly made in these Terms.',
  'Limitations of Liability. TO THE EXTENT NOT PROHIBITED BY LAW, YOU AGREE THAT, IN NO EVENT WILL THE COMPANY AND ITS AFFILIATES BE LIABLE :(A) FOR DAMAGES OF ANY KIND, INCLUDING INDIRECT, SPECIAL, EXEMPLARY, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, LOSS OF USE, DATA OR PROFITS, BUSINESS INTERRUPTION OR ANY OTHER DAMAGES OR LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OR INABILITY TO USE THE SERVICES), HOWEVER CAUSED AND UNDER ANY THEORY OF LIABILITY, WHETHER UNDER THESE TERMS OR OTHERWISE ARISING OUT OF OR RELATING IN ANY WAY IN CONNECTION WITH THE AIRDROP, THE SERVICES, THE WEBSITE, THE APP OR THESE TERMS AND WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) EVEN IF THE COMPANY AND AFFILIATES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE; OR (B) FOR ANY OTHER CLAIM, DEMAND, OR DAMAGES WHATSOEVER RESULTING FROM OR ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE DELIVERY, USE, OR PERFORMANCE OF THE SERVICES. THE COMPANY AND ITS AFFILIATES TOTAL LIABILITY TO YOU FOR ANY DAMAGES FINALLY AWARDED SHALL NOT EXCEED ONE HUNDRED DOLLARS ($100.00) RESPECTIVELY. This limitation of liability reflects the allocation of risk between the parties. You acknowledge and agree that, to the fullest extent permitted by applicable law, in no event shall the Company or its Affiliates be liable for any claim, damages, or any other form of liability, whether in action or in tort, arising from or in connection with your use or inability to use the Services, Airdrop Website, or any website linked to the Airdrop Website, or any content provided on the Airdrop Website or those other websites. We further disclaim all liability arising from any reliance you placed on the materials provided on the Airdrop Website, including the content provided by third-parties. Any links to other websites are provided for your convenience. They do not signify any endorsement by the Company or its Affiliate of such other websites. The Company has no control over or responsibility for the content provided on such third-party websites. SOME JURISDICTIONS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO SOME OR ALL OF THE ABOVE DISCLAIMERS, EXCLUSIONS, OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.',
]

const disclaimersAndLimitationsListTwo = [
  'Indemnification. By entering into these Terms and accessing or using the Services or the Airdrop, you agree that you shall defend, indemnify, and hold the Company and its Affiliates harmless from and against any and all claims, costs, damages, losses, liabilities, and expenses (including attorneys’ fees and costs) incurred by the Company and Affiliates arising out of or in connection with: (a) your violation or breach of these Terms or any applicable law or regulation; (b) your violation of any rights of any third party; (c) your use of the Services or the Airdrop; (d) your negligence or willful misconduct; (e) your content; or (f) your violation of the rights of another. If you are obligated to indemnify the Company or its Affiliates hereunder, then you agree that the Company or the applicable Affiliate, will have the right, in its sole discretion, to control any action or proceeding and to determine whether the Company and its Affiliates, as applicable, wishes to settle, and if so, on what terms, and you agree to fully cooperate with the Company and its Affiliates in the defense or settlement',
]

const protocolRisks = [
  'Risks Relating to the Launch of the Protocol. The Tokens are designed to be used on the Protocol. There can be no assurance that the Tokens or the Protocol will function as intended or as described on any website or in other communications or will be maintained and further developed according to current plans. There can be no assurance that you will be able to utilize the Tokens or the Protocol in any particular way.',
  'Risks Relating to Smart Contracts and Programs. The Protocol is generally comprised of a number of smart contracts. Smart contracts and programs are computer codes that can be created and run by the users of the network on which such smart contract or program is based. A smart contract or program can take information as an input, process that information through the pre-determined rules and conditions defined in the computer code, and execute certain actions, such as Token transactions, pursuant to such programming. The use of smart contracts and programs creates substantial risk exposures. Smart contracts are self-executing once deployed, generally without reliance on a central party, and use experimental cryptography. Smart-contract risks include the following, which may affect adoption, continued use, or functioning of the Protocol and thereby your ability to use the Tokens.',
  'Flawed or Imprecise Code: Smart contract code may be imprecise or flawed. In such cases, smart contracts on the Protocol could have specifications or conditions that are implemented or executed in ways that are not expected. You may be at risk of losing all or a substantial portion of your staked digital assets through an adverse event relating to such code. Smart contracts could contain vulnerabilities or bugs that could be exploited, potentially resulting in a complete or substantial loss of your staked digital assets. Malicious actors could exploit such vulnerabilities or bugs to cause the execution of erroneous or unexpected slashing conditions or theft of your staked digital assets.',
  'Lack of Remediation: If imprecise or flawed code is discovered in a deployed smart contract, it may not be susceptible to identification ex ante and remediation may be difficult or ineffective. In some cases, the only practical remediation may include deploying a new smart contract or incorporating updating mechanisms that may be disruptive, risky, complex, costly, time-consuming, and/or unable to reverse adverse scenarios, including complete or substantial loss of your staked digital assets.',
  'Flaws in Programming Languages: The use of programming languages in smart contracts poses risks, including vulnerabilities arising from language complexity, potential bugs and flaws in language designs or compilers, limitations in functionality or performance impacting implementation, and a lack of maturity and sustained support for certain languages impacting the reliability and security of the developed contracts. Even widely used programming languages may have compiler bugs or other flaws that, if discovered and exploited, may result in substantial or total losses of your staked digital assets.',
  'Irrevocable Token Transactions: The use of a distributed ledger and blockchain technology, like Ethereum, creates a public record of Token balances that is exceedingly difficult to change once it reflects a particular state. This means that if a Token transaction were executed in error or as a result of fraud or theft, such a transaction would not be practically reversible. Consequently, the Company will be unable to replace missing or misappropriated Tokens or seek or provide reimbursement for any such erroneous transfer, fraud, or theft. The inability to reverse transactions or seek other forms of redress for such action, error, fraud, or theft could result in the permanent loss of some or all of your Tokens. This lack of redress could cause reputational harm to, and diminish participation on, the Protocol and/or adversely affect the financial viability or performance of the Company and its Affiliates.',
  'Lack of Control over Protocol: The Protocol is envisioned to be an open-source project with Protocol governance collectively controlled by the Token Holders. However, the Company or certain Affiliates control of certain multi-signature wallets relating to the Protocol temporarily right after launch, and their control of those wallets can enable certain transactions. Under current plans, and over time, the Company and the relevant Affiliates will not have control over these wallets and the Protocol, and it will not be able to control the actions of Token Holders. This means that the Company and Affiliates have engaged in substantial research and development with respect to the Protocol and its governance and security features, any future changes to the Protocol may need to be voluntarily adopted by Token Holders, including, as applicable, Token Holders participating in governance and/or as signatories for multi-signature wallets operated by the community.',
  'Reliance on Third-Parties: The Protocol itself relies on third-party software that is not controlled by the Company or its Affiliates. Any defects, updates, upgrades, modifications, flaws, vulnerabilities, defects, attacks, exploits, or shortcomings in third party code may impact the operation of the Protocol. Likewise, the Protocol itself relies upon Third Party Service Providers. Those Third-Party Service Providers could fail to perform, could perform negligently, or could willfully underperform or provide defective performance, and could take actions that would undermine or impair the Protocol.',
  'Governance Issues: Because the Company and its Affiliates will lack control over community governance and the Protocol, under current plans, and over time, the Company and its Affiliates will not be able to prevent Token Holders or others from mismanaging code, ensure that there is an adequate or timely response to emergencies or other identified risks, or adopt necessary code or governance changes. Token Holders or others may make decisions or take actions (or fail to make decisions or take actions) in ways that adversely affect you, your Tokens, Token Holders, and/or the Protocol. In addition, the Protocol may not run or function as intended, when deployed to mainnet or after changes, and in such cases, you and the Company and Affiliates may have limited recourse. Any of these could result in substantial or total losses of your digital assets and/or uses of your digital assets or your Tokens.',
  'Risks Associated with Technology: Various technology solutions are and will be incorporated into the Protocol. Some or all of these technology solutions are relatively new and/or untested. There is significant risk to building and implementing new technologies that may have never been used or that are being used in different ways. There is no guarantee that such technologies will operate as intended or as described in any marketing or other materials distributed by the Company or others or will continue to function according to current plans.',
  'Risks Associated with Slashing: The Protocol will rely upon third-party software that may include slashing. There is no guarantee that you or other Users of the Protocol will view slashing rules or conditions as precise, objective, fair, or fairly applied. There is no guarantee that any governance to mediate slashing events will be fair or impartial, or exist. The application of certain slashing rules and conditions may be challenging and/or ambiguous and lead to disagreements among Users of the Protocol. You or other Users of the Protocol could have digital assets erroneously slashed, causing substantial or total losses of your staked digital assets. Your digital assets, including your Tokens, may be partially or completely slashed despite your best efforts to validate transactions and respond to conditions as expected. Slashing, slashing attacks, and/or any perceptions of unfair slashing could result in Users of the Protocol determining not to stake their digital assets on the Protocol. A sudden change in the size and constituency of the pool of digital assets controlled by the Protocol. Any of these possibilities could diminish the use and viability of the Protocol. Any of these also could adversely impact you and adversely affect adoption of the Protocol and ultimately, your ability to use the Tokens.',
  'The Volatility and Instability of Digital Assets: At launch, the Protocol will only support a small number of digital assets, like ETH, and certain stablecoins. The Company and its Affiliates are not involved in the issuance of ETH or any stablecoins and does not vet, approve, or recommend particular tokens for use on the Protocol. When you choose to stake ETH on Ethereum or to otherwise deploy other digital assets in the Protocol, you accept certain slashing and other risks that are completely exogenous to the Protocol and beyond the Company and its Affiliates’ control. Token Holders may seek to support new types of digital assets on the Protocol. It is also possible that validated services on the Protocol could be supported by any digital asset acceptable to users of the Protocol. These assets may have widely varying characteristics and quality, and these could change and deteriorate over time. The Company and its Affiliates will not be able to control these possibilities or events, and these events may be difficult to predict and mitigate. Any of these could adversely affect economic considerations, adoption of the Protocol, and/or ultimately, your ability to use the Tokens.',
  'Insufficient Interest in the Protocol and the Token: The Protocol relies on active engagement by users to function. The Company and Affiliates make no assurance that the Protocol will generate enough interest and user engagement to be viable or continue to be viable. It is not possible at this time to evaluate whether sufficient users will participate in the Protocol and whether those users will sustainably and sufficiently engage with and use the Protocol for the Protocol to function as intended. Token Holders could mismanage, misuse, or misappropriate aspects of the Protocol or the Tokens in a manner that is detrimental to you, the Protocol, and the broader community of users. This may negatively affect your ability to use the Tokens.',
  'Multiple Other Significant Risks: It is possible that, due to any number of reasons, including but not limited to, lack of interest from users or partners, inability to attract sustained third-party or community contributors to the Protocol, an unfavorable fluctuation in the value of digital and fiat assets and currencies, decrease in the utility of the Tokens, failure to generate commercial relationships, legal and regulatory classification or actions, property ownership and other challenges, and macroeconomic and crypto-market-specific factors, the Protocol may no longer be viable to operate and it may be deprecated or cease to have any functionality, users, or viability.',
  [
    'Risks of Adverse Contagion from Ethereum Events. The Protocol is comprised of a set of smart contracts deployed on Ethereum, and the Protocol has been designed in the spirit of remaining closely aligned with the Ethereum community’s mission and roadmap. This presents the following risks, among others:',
    'Discovery of EVM Flaws. An EVM bug discovered and exploited by malicious actors could present risks to the integrity and security of the Protocol because its smart contracts are deployed on Ethereum. EVM compromises could impair expected execution of the Protocol, resulting in security vulnerabilities, data corruption that changes or obscures true data states, disruptions to operations such as withdrawals, and ultimately, substantial or total losses of digital assets, fees, or support or adoption of Ethereum-based projects, including the Protocol. This could diminish the use of Tokens and result in substantial or total losses of digital assets and confidence across the crypto markets more generally.',
    'Ethereum Hard Fork. In the event of a hard fork on Ethereum, changes could be made to the Ethereum Protocol that could make the Protocol’s smart contracts incompatible, dysfunctional, uneconomic, or more costly, which could impair the execution and interaction of smart contracts essential to the operation of Protocol. Such changes also could adversely affect the ability or incentives of users to use the Protocol. A hard fork on Ethereum could necessitate significant changes to the Protocol that, in turn, change the economics or technical processes involved in using the Protocol. Certain types of changes in consensus rules or technical implementations could present significant or even existential risks to the Protocol, such as those that could make it difficult, costly, or slashable to use the Protocol. Significant resources and time could be required for the Protocol to remain compatible with one or more forks of Ethereum or consensus rule changes. Such resources or time may be unavailable or uneconomic to provide and cannot be guaranteed to ensure continued operation of the Protocol.',
    'Insufficient Quantum Resistance. Quantum computers, if sufficiently powerful and available for use, potentially could be used to break the cryptographic algorithms used by Ethereum, the Protocol, and other platforms. This could make it possible to derive private keys from public keys, opening the door to a variety of storage and other attacks that could harm Ethereum itself, holders of ETH, and Token Holders building or transacting on the Protocol. This, in turn, could adversely affect adoption of the Protocol and ultimately, your ability to use your Tokens.',
  ],
]

const tokenRisks = [
  [
    'Risks Relating to the Token in Particular. YOUR TOKENS MAY HAVE NO VALUE. Significant market and economic factors may adversely affect your ability to use the Tokens:',
    'No Market for the Token. There is no public market for the Token, and the Company and its Affiliates do not control the development of such a market. A public market may not develop or be sustainable, and you may not be able to sell your Tokens. Furthermore, the Company and its Affiliates cannot control how Token holders or third-party exchanges or platforms may support the Token, if at all. Even if a public market for the Token develops, such a market may be relatively new and subject to little or no regulatory oversight, making it more susceptible to fraud or manipulation.',
    'Extreme Illiquidity. There will be significant restrictions on the transferability of your Tokens. The transfer restrictions on your Tokens will remain in place for a significant period of time. Even if a public market does eventually exist, you may not be able to freely sell or transfer your Tokens. If you can freely sell your tokens in a public market after some period of time, the depth and volume in that market may be insufficient for you to sell without substantial price concessions.',
    'Adverse Activities in Secondary Markets. Secondary market activities that are beyond the control of the Company and its Affiliates could develop that are adverse to your ability to use the Tokens. Even with significant transfer restrictions intended to support long-term alignment with the Protocol community, significant concentrations in token positions are present and may continue to be present among a relatively small group of Tokens holders, or worsen, exposing you to significant risks of volatility, herd trading, “dumping,” or other correlated secondary market activities. These risks will be considerable following expiration of the lock-up period applicable to certain Token holders. In addition, Token Holders may determine to approve grants, allocations, and/or inflationary mints of the Tokens, all of which may be fully or partially outside of the Company’s control and could incentivize harmful short-term trading activities or otherwise adversely affect you.',
    'Experimental Features and Uses. The Tokens may have experimental features and uses. Future features and uses may prove not to be valuable, usable, or viable, and contributors may fail to adequately research and develop any such upgrades. Under current plans, and over time, the Company and its Affiliates may not have the ability to effectuate upgrades to implement new features and use cases. Such upgrades may not be approved in Protocol governance or may be adopted with security flaws or with unexpected or harmful changes that are adverse to your ability to use your Tokens.',
  ],

  'Risks Relating to Governance.  The Company and certain Affiliates have control of certain multi-signature wallets that can enable certain and transactions. However, under current plans, and over time, the Protocol will be controlled by Token Holders. Thus, the Company and its Affiliates may not have control over administrative actions nor will they be able to control the decisions and actions of Token Holders. Because the Company and Affiliates will lack control over community governance, under current plans, and over time, they will have limited means to prevent Token Holders from mismanaging smart-contract code, ensure that there is an adequate or timely response to emergencies or other identified risks, or adopt necessary code or governance changes. Token Holders may make decisions or take actions (or fail to make decisions or take actions) in ways that adversely affect you, others, and/or the smart contract, including by limiting transfers of the Tokens or removing transfer restrictions, authorizing inflationary minting of the Tokens, or misappropriating a portion of the Token supply.',
]

const legalAndRegulatoryRisks = [
  'Risks of New and Evolving Laws and Regulations. There is significant risk surrounding the ongoing development of regulatory frameworks governing blockchain technology all over the world and as the blockchain, crypto, and web3 industries continue to grow, the Company expects regulatory scrutiny to increase across jurisdictions. The Company or its Affiliates, the Protocol or Tokens may be found to be subject to certain laws or regulatory regimes that could adversely impact you, the Protocol, or the Tokens. Additionally, laws or interpretations may change and the Company or its Affiliates or the Protocol or the Tokens may be subject to new or changed laws or regulations in the future. Any restrictive or prohibitive legislation or regulation on blockchains or digital assets could impair the adoption of the Protocol and/or the use of the Tokens and adversely affect market sentiment surrounding the Protocol and/or the Tokens. To the extent licenses, permits, or other authorizations are required in one or more jurisdictions in which the Protocol or any Application is deemed to operate, there is no guarantee that the Company or another party will be able to secure such licenses, permits, or authorizations in order for the Protocol or any Application to continue to operate. Significant changes may need to be made to the Protocol to comply with any licensing and/or registration requirements (or any other legal or regulatory requirements) in order to avoid violating applicable laws or regulations or because of the cost of such compliance. Uncertainty in how the legal and regulatory environment will develop could negatively impact the development, growth, and utilization of the Protocol and therefore the uses of the Tokens.',
  'Risks of Tokens or Token Transactions Being Deemed Securities. The SEC and its staff have taken the position that certain tokens and/or certain transactions involving tokens fall within the definition of a “security” under the U.S. federal securities laws. The legal test for determining whether any given token or transaction is a security is a highly complex, fact-driven analysis that evolves with U.S. case law and developments over time, and the outcome(s) or conclusion(s) of any such legal analysis may be uncertain or evolve in ways that are difficult to predict. The SEC generally does not provide advance guidance on or confirmation of whether any particular token or transaction is or may be a security. Furthermore, the SEC’s views in this area have evolved over time and it is difficult to predict the direction or timing of any continuing evolution. It is also possible that legislative or judicial developments or a change in the governing administration or the appointment of new SEC commissioners could substantially impact the views of the SEC and its staff. Certain tokens or transactions may be deemed to be other types of regulated financial instruments or transactions in the U.S. or securities or other regulated financial instruments or transactions in other jurisdictions. As a result, certain tokens or transactions may be deemed to be “securities” or other regulated financial instruments or transactions under the laws of some jurisdictions but not others. Various foreign jurisdictions may, in the future, adopt additional laws, regulations, or directives that affect the characterization of certain tokens or transactions as “securities” or other regulated financial instruments. The classification of a token or transaction as a security or regulated financial instrument under applicable law has wide-ranging implications for the regulatory obligations that could be imparted on the Company, Protocol, Token Holders, or holders of Tokens, including obligations that could make the Protocol not viable to continue to operate or negatively impact the development, growth, and utilization of the Protocol and liquidity and market sentiment around the Tokens.',
  'Risk of Third-Party Illegal Activity. The Protocol and the Token may be exploited to facilitate illegal activity, including fraud, money laundering, gambling, tax evasion, sanctions evasion, and scams. If any third party uses the Protocol or the Tokens to further such illegal activities, that and the legal and regulatory consequences of those activities could negatively impact the development, growth, and utilization of the Protocol. While we do not control the activities of the Protocol’s Users, the use of the Protocol for illegal or improper purposes could subject us, the Protocol, or Token holders to claims, individual and class action lawsuits, and government and regulatory investigations, prosecutions, enforcement actions, inquiries, or requests that could result in liability and reputational harm for us, the Protocol, and/or the Token holders.',
  'Jurisdictional Risks. Certain activities that may be legal in one jurisdiction may be illegal in another jurisdiction, and certain activities that are at one time legal may in the future be deemed illegal in the same jurisdiction. In the event that a Token Holder is found responsible for intentionally or inadvertently violating the laws in any jurisdiction, the Company, Protocol, and/or you and other Token holders may be subject to governmental inquiries, enforcement actions, prosecution, or held secondarily liable for aiding or facilitating such activities in researching and developing, or deploying, software that enabled such activities, being a platform on which such activities occurred, contributing to governance that authorized such activities, or being a member of a decentralized autonomous company or other group that otherwise has liability with respect to such activities.',
  'Risk of Sanctions Violations. The Company, the Protocol, or Token holders could be deemed to be violating or facilitating the violation of applicable economic and trade sanctions and export control laws and regulations, such as those administered and enforced by the U.S. Department of the Treasury’s OFAC, the U.S. Department of State, the U.S. Department of Commerce, the UN Security Council, and other relevant authorities. Such laws and regulations prohibit or restrict certain operations, investments, services, and sales activities, including dealings with certain countries or territories (e.g., sanctioned countries), and governments, and persons (including sanctioned entities). Although the Company does not enter into contracts or agreements with sanctioned entities or persons located in sanctioned countries, it may not be able to entirely prevent such persons from seeking to interact with the Protocol, Tokens, and/or Token holders, including by circumventing the Company’s controls. Abuses of the Protocol and failures or alleged failures to comply with such laws and regulations may expose the Protocol, Token Holders, the Company, and/or Token holders to reputational harm as well as significant penalties, including criminal fines, imprisonment, civil fines, disgorgement of profits, injunctions and debarment from government contracts, as well as other remedial measures, and could negatively impact the development, growth, and utilization of the Protocol and market sentiment around the Tokens.',
  'Risk of Entering into a General Partnership. It could be alleged that by holding the Tokens or using Tokens to vote on governance proposals in relation to the Protocol, the holders of Tokens who are Token Holders have entered into a joint venture, general partnership, unincorporated association, or some other form of legal entity or association with other Token holders or a group of such holders. At least one court in the U.S. has found that certain holders of a governance token constituted an unincorporated association. If this were to be found or alleged with respect to the Protocol, holders of Tokens could be held responsible for the actions of the other members of the unincorporated association or general partnership, or the Protocol itself, and could be subject to up to unlimited liability with respect to those actions. Additionally, such an allegation could negatively impact market sentiment around the Protocol or the Tokens and discourage participation in the Protocol, or discourage engagement in governance of the Protocol or utilization of the Tokens.',
  'Risks Associated with the Tax Treatment of Digital Assets. Due to the new and evolving nature of digital assets and the absence of comprehensive legal guidance with respect to digital asset transactions, the taxation of digital assets is uncertain, and it is unclear what guidance may be issued in the future on the treatment of digital asset transactions for tax purposes. Guidance under, or changes in, the tax laws applicable to of digital assets, including the Tokens, or the Company and/or its activities and transactions, either directly or through subsidiaries, could adversely impact the value of the Tokens or your ability to use or engage in certain types of transactions with the Tokens. The Company or its subsidiaries may also have tax reporting obligations in various jurisdictions with respect to the Tokens. You should consult a tax advisor with respect to the tax treatment of the Tokens in your jurisdiction.',
]

const operationalRisks = [
  'Risks of Competition. The Protocol and the Token compete against a variety of existing products and platforms as well as likely new entrants into the market. Some of these current or future competing protocols and products may be subject to different regulatory regimes than the Company, the Protocol, or the Tokens that may facilitate broader or faster adoption such that they can outcompete the Protocol. Alternatively, other competitors may exercise different amounts of control over the Protocol they design that allow for faster or broader adoption. Additionally, competitors may develop more successful protocols, applications, or tokens for a variety of other reasons, including but not limited to designing a more friendly user experience, offering more compelling incentives, attracting more developers and users to the Protocol, creating a more sustainable token economic design, or taking a more permissive view of applicable law.',
  'Risks of Security Weaknesses or Attacks. Cyberattacks and security breaches of an Application or the Protocol or the Tokens, or those impacting the Protocol’s Users or third parties such as decentralized applications or crypto wallets that interact with the Protocol or the Tokens, could cause you to lose your Tokens, or adversely impact the Protocol or the Tokens. The Protocol could be vulnerable in a variety of ways, including but not limited to, malware attacks, denial of service attacks, consensus-based attacks, Sybil attacks, smurfing and spoofing, governance attacks, exploitable code, or any number of other currently known or novel methods of exploit. Additionally, as mentioned above, changes to the Protocol or the Tokens, which may be proposed, coded, and/or implemented by parties other than the Company or its Affiliates, could introduce new vulnerabilities to the Protocol or the Tokens or otherwise have unintended or malicious adverse effects on the Protocol and/or the Tokens. The Protocol and smart contracts generally execute automatically when certain conditions are met and typically cannot be stopped or reversed, so any vulnerabilities that may arise can have significant adverse effects to the Protocol, the Tokens, and holders of Tokens. Further, any actual or perceived breach or cybersecurity attack directed at crypto companies or blockchain networks, whether or not the Protocol is directly impacted, could lead to a general loss of user confidence in the crypto-economy or in the use of blockchain technology to conduct transactions, which could negatively impact the Protocol, including the market perception of the effectiveness of security measures and technology infrastructure. Digital assets are generally controllable only by the possessor of a unique public and private key pair. To the extent your private key for your wallet is lost, destroyed, or otherwise compromised and no backup of the private key is accessible, you will be unable to access the tokens held in such wallet. Any Tokens that are custodied, managed, escrowed, or supported by a third party may be subject to a security breach, cyberattack, or other malicious activity, or otherwise lost or stolen. Such an event could severely impact you and your Token holdings and your ability to use your Tokens.',
  'Risk of Decentralized Operations. Coordinating operations and implementation of feature updates, new product launches, or community initiatives amongst a distributed community can result in inefficiencies and delays. Such inefficiencies and delays could create stagnation around new developments and improvements to the Protocol and could allow more centralized competitors to act more efficiently and outcompete the Protocol, resulting in decreased usage or negative sentiment around the Protocol and the Tokens. Conversely, the Company or an Affiliate’s role as a contributor to research and development involving the Protocol and the Tokens presents certain risks, given the lack of operating history of the Company and its Affiliates, the relative inexperience of certain service providers, and the novel nature of the Protocol and potential use cases for the Tokens.',
  'Multi-Signature Wallet Risks. There will be certain multi-signature wallets that have certain transactional authorities and controls related to the Protocol and the Tokens, and these may include, but are not limited to, the ability to pause certain functionalities of the Protocol, reverse or pause slashing and implement certain other controls or changes to functionality. At this time, certain of these multi-signature wallets may be controlled by us or certain contributors or Token Holders engaged by us, and certain other wallets may be controlled partially or entirely by committee members that are unaffiliated third parties over which the Company has no or limited control. The current plan is to, from the launch of the Protocol, turn all multi-signature wallets over time to the community, to parties that are independent of the Company or its Affiliates. Those parties may choose to act in ways that could cause risk or damage to the Protocol or the uses of the Tokens.',
  'Unanticipated Risks. Cryptographic tokens and blockchain-based Protocols are new and untested technologies. The Tokens, as well as the Protocol and its design concepts, smart-contract mechanisms, algorithms, codes, and other technical details and parameters, may be updated and changed. In addition to these risks, there may be other risks associated with your claiming, using, buying, transacting in, and/or holding Tokens, including those which we cannot anticipate or have not specifically enumerated here. Such risks may further materialize as unanticipated variations or combinations of the risks discussed. Further, new risks may be created as the Protocol and the Tokens are developed (including by parties other than us) or third parties integrate the Tokens or the Protocol into their products. No person or entity, including the Company, has an ability or obligation to keep Participants informed of details related to development of the Protocol or the Tokens. Lack of available information may create risk for you.',
  'Fraudulent Websites. Some users have been targeted and/or have reported fraudulent websites, emails, text messages, and social media handles, often including embedded or published links, impersonating projects, persons, entities, or service providers of or associated with the Company for the purpose of defrauding users, stealing their digital assets, or otherwise unlawfully profiting from such activities. These fraud and theft risks may materialize in connection with Token Claims, and you should remain extremely cautious about websites, emails, text messages, and social media handles, as well as any embedded or published links, that direct you to websites or to take actions, especially connecting to your Wallet.',
]

const assumptionOfRisks = [
  'You represent that you understand that markets for digital assets are highly volatile due to various factors, including adoption, speculation, technology, security, and regulation. You acknowledge and accept that the cost and speed of transacting with cryptographic and blockchain-based systems, such as Ethereum, are variable and may increase or decrease dramatically at any time. You acknowledge and accept the risk that your digital assets may have no value or lose some or all of their value during the Airdrop Period, any lock-up period, or after.',
  'You acknowledge the risks associated with the fact that digital assets are not: (a) deposits of or guaranteed by a bank; (b) insured by any other applicable governmental or semi-governmental agency, institution or entity; and (c) that we do not custody and cannot transfer any digital assets you may interact with on the Services or Protocol.',
  'We cannot control how third-party Protocols, service providers, or exchange platforms quote or value digital assets and you assume all risk resulting from fluctuations in the value of digital assets.',
  'Smart contracts execute automatically when certain conditions are met. You accept the risk that smart contracts typically cannot be stopped or reversed, vulnerabilities in their programming and design or other vulnerabilities that may arise due to hacking or other security incidents can have adverse effects to digital assets, including, but not limited to, significant volatility and risk of loss.',
  'Certain protocols and networks subject digital assets to slashing upon certain conditions, including, but not limited to, if a validator or operator engages in harmful or malicious behavior, fails to perform their role as a validator or operator properly, or incorrectly validates a transaction.',
  'Certain Protocols and networks require that a certain amount of staked assets be locked for a certain period of time while staking, and withdrawal of staked assets may be delayed. We do not guarantee the security or functionality of any third-party Protocol, software, or technology intended to be compatible with digital assets.',
  'You understand that anyone can create a token, including fake versions of existing tokens and tokens that falsely claim to represent or be issued by certain projects, entities, or people, and you acknowledge and accept the risk that you or others may mistakenly seek to claim or trade those or other tokens.',
]

export const claimDelegateTerms = [
  {
    label: 'Defined Terms',
    content: (
      <Wrapper>
        <Heading>I. DEFINED TERMS</Heading>
        <Paragraph>
          In these Terms and all documents incorporated herein by reference, the following words
          have the following meanings unless otherwise indicated:
        </Paragraph>

        <List items={definedTermsList} />
      </Wrapper>
    ),
  },
  {
    label: 'Introduction',
    content: (
      <Wrapper>
        <Heading>II.INTRODUCTION</Heading>
        <Paragraph>
          {`These Terms govern your participation in and receipt of the Tokens through the Airdrop
          organized by Lazy Summer Management Corp, a British Virgin Islands company ("Company",
          together with the Affiliates "we," or "us"). By accessing, browsing or otherwise using the
          Airdrop Website or participating in the Airdrop, you ("Participant" or "you") acknowledge
          that you have read, understood, and expressly agree to be bound by these Terms. These
          Terms apply to your access to and the use of the Services, including the Airdrop. Please
          note that the front-end interface (the "App") that displays data that facilitates users
          interfacing with a set of decentralized smart contracts that allow for certain
          transactions of digital assets is provided by a third-party, which is subject to their own
          terms and conditions. These underlying smart contracts are referred to herein as the "Lazy
          Summer Protocol." The Protocol itself may include or integrate various other third-party
          software and services. The Services may also reference or provide an App or APIs related
          to smart contracts that provide a data availability service. The Protocol is not part of
          the Services, and your use of the Protocol is entirely at your own risk. Additionally, the
          third-party tools required to be used or interacted with in order to interact with the
          Protocols, including, but not limited to, a Wallet, are not part of the Services, and your
          use of such third-party tools is entirely at your own risk. The App is separate and
          distinct from either of the Protocol and any third-party tools. The App merely displays
          blockchain data and provides a web application that reduces the complexity of using the
          third-party tools or otherwise accessing the Protocol. All activity on the Protocol is run
          by permissionless smart contracts, and other developers are free to create their own
          interfaces to function with the Protocol. PLEASE READ THESE TERMS CAREFULLY, AS THEY
          INCLUDE IMPORTANT INFORMATION ABOUT YOUR LEGAL RIGHTS. IF YOU DO NOT UNDERSTAND OR AGREE
          TO THESE TERMS, PLEASE DO NOT PARTICIPATE IN THE AIRDROP OR OTHERWISE USE THE SERVICES.
          The Company reserves its right to change these Terms at any time at our sole discretion.
          If we do this, we will publicly post the updated Terms on the Airdrop Website and will
          indicate the date these Terms were last revised. You may read a current effective copy of
          the Terms by visiting the Terms' link on the Airdrop Website. For the avoidance of doubt,
          the Company is not obligated to notify you of any changes to these Terms. It is your
          responsibility to periodically review the Terms by visiting the designated link on the
          Airdrop Website to stay informed of any updates.`}
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: "Participant's Representations, Warranties and Undertaking",
    content: (
      <Wrapper>
        <Heading>III. PARTICIPANT&apos;S REPRESENTATIONS, WARRANTIES AND UNDERTAKING</Heading>
        <Paragraph>
          In addition to other representations, warranties and undertakings elsewhere in these
          Terms, you represent and warrant and/or undertake to the Company and Affiliates as
          follows:
        </Paragraph>

        <List items={participantsRepresentation} />

        <Paragraph>
          If the Company determines that you have breached any of your representations or warranties
          under these Terms, we may block your access to the Services and to any interests in
          property as required by law. Until further notice, the distribution or transfer of the
          Tokens to U.S. persons is strictly prohibited by the Company.
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: 'Eligibility',
    content: (
      <Wrapper>
        <Heading>IV. ELIGIBILITY</Heading>
        <Paragraph>
          {`UNTIL FURTHER NOTICE, THE DISTRIBUTION OR TRANSFER OF THE TOKENS TO U.S. PERSONS IS
          STRICTLY PROHIBITED BY THE COMPANY. U.S. CITIZENS, U.S. RESIDENTS (TAX OR OTHERWISE),
          GREEN CARD HOLDERS, OR CORPORATE ENTITIES WITH A MAJORITY OF U.S. OWNERSHIP OR A PRINCIPAL
          PLACE OF BUSINESS OR REGISTERED OFFICE IN THE UNITED STATES OF AMERICA (COLLECTIVELY, A
          "U.S. PERSON"), AND WHO ARE NOT ACTING FOR THE ACCOUNT OR BENEFIT OF ANY U.S. PERSONS, ARE
          NOT ELIGIBLE TO USE THE SERVICES AND PARTICIPATE IN THE AIRDROP.`}
        </Paragraph>
        <Paragraph>
          Further, the Services, including the Airdrop, may not be accessed or used as follows:
        </Paragraph>
        <List items={eligibilityListOne} />
        <Paragraph>You are eligible to use the Services, including the Airdrop, if:</Paragraph>
        <List items={eligibilityListTwo} />
        <Paragraph>
          The Company, in its sole discretion, shall determine the eligibility criteria for
          participation in the Airdrop, including the amount of Tokens to be distributed to eligible
          Participants that satisfy certain criteria. Different eligible Participants may receive
          different amounts of Tokens in any particular Airdrop. The Company shall have no
          obligation to notify actual or potential Airdrop participants of the eligibility criteria
          for any Airdrop prior to, during, or after the claims are opened for such Airdrop. The
          Company reserves the sole and absolute right to disqualify any Participant or potential
          Participant it deems ineligible for an Airdrop (be it under these Terms or by having
          determined that Participant engaged in any conduct that the Company considers harmful,
          unlawful, inappropriate, or unacceptable in its sole discretion). Such disqualification
          may be appropriate if the Company determines, for example, that Participant may have used
          multiple addresses to obscure its identity or location or to attempt to manipulate, game,
          cheat, or hack the Airdrop, the Tokens, or the Protocol.
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: 'Token Claims',
    content: (
      <Wrapper>
        <Heading>V. TOKEN CLAIMS</Heading>
        <Paragraph>
          THERE IS ONLY ONE WEBSITE FOR TOKEN CLAIMS, WHICH IS THE AIRDROP WEBSITE.
        </Paragraph>
        <Paragraph>
          {`The Company has implemented a risk-based program applicable to the Airdrop and any related
          participation or claims through the Airdrop Website and any subdomains (collectively,
          "Token Claims"). This program screens Token Claims using data and tools provided by an
          independent blockchain analytics provider ("Screening Service Provider"), applying
          screening criteria that may extend beyond the requirements of applicable law. Token Claims
          also are subject to geo-location and proxy detection controls to prevent access by users
          that may be Prohibited Persons or located in a Prohibited Jurisdiction. The Company
          reserves the right to take such additional steps as it deems necessary or appropriate, in
          its sole discretion, to verify the identity and eligibility of any person.`}
        </Paragraph>
        <Paragraph>
          Use of the website for Token Claims is at the risk of the Participant. By using the
          Services and participating in any Airdrop, you agree and acknowledge that:
        </Paragraph>
        <List items={tokensClaimList} />
      </Wrapper>
    ),
  },
  {
    label: 'Prohibited Activities',
    content: (
      <Wrapper>
        <Heading>VI. PROHIBITED ACTIVITIES</Heading>
        <Paragraph>
          The following activities are specifically prohibited and you undertake not to carry out
          any of the following activities when using the Website or any of the Services, including
          the Airdrop:
        </Paragraph>
        <List items={prohibitedActivitiesList} />
        <Paragraph>
          {`The Company reserves the right to investigate directly or through an Affiliate and take
          appropriate legal action against anyone who, in the Company's sole discretion, violates
          this provision, including reporting the violator to law enforcement authorities.`}
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: 'No Professional Advice and No Fiduciary Duties',
    content: (
      <Wrapper>
        <Heading>VII. NO PROFESSIONAL ADVICE AND NO FIDUCIARY DUTIES</Heading>
        <List items={noProfessionalAdviceList} />
      </Wrapper>
    ),
  },
  {
    label: 'Disclaimers, Limitation of Liability and Indemnification',
    content: (
      <Wrapper>
        <Heading>VIII. DISCLAIMERS, LIMITATION OF LIABILITY AND INDEMNIFICATION</Heading>
        <List items={disclaimersAndLimitationsListOne} />
        <Paragraph>
          Under no circumstances will the Company or Affiliates be liable in any way for any content
          or materials of any third-parties (including User Content), including for any errors or
          omissions in any content, or for any loss or damage of any kind incurred as a result of
          the use of any such content. You acknowledge that Company and Affiliates do not pre-screen
          content, but that the Company and Affiliates will have the right (but not the obligation)
          in their sole discretion to refuse or remove any content that is available via the
          Services. Without limiting the foregoing, the Company and its Affiliates will have the
          right to remove from the Airdrop Website, without notice, any content that violates these
          Terms or is deemed by the Company, in its sole discretion, to be otherwise objectionable.
          You agree that you must evaluate, and bear all risks associated with, the use of any
          content, including any reliance on the accuracy, completeness, or usefulness of such
          content.
        </Paragraph>
        <List items={disclaimersAndLimitationsListTwo} />
      </Wrapper>
    ),
  },
  {
    label: 'Waiver and Release',
    content: (
      <Wrapper>
        <Heading>IX. WAIVER AND RELEASE</Heading>
        <Paragraph>
          You expressly waive and release Company and its Affiliates from any and all liabilities,
          claims, causes of action, or damages arising from or in any way relating to your use of
          the Airdrop or the Services, including your interaction with the Protocol or the Lazy
          Summer Protocol.
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: 'Third-Party Beneficiaries',
    content: (
      <Wrapper>
        <Heading>X. THIRD-PARTY BENEFICIARIES</Heading>
        <Paragraph>
          You and the Company acknowledge and agree that the Affiliates are third-party
          beneficiaries of these Terms.
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: 'Third-Party Services',
    content: (
      <Wrapper>
        <Heading>XI. THIRD-PARTY SERVICES</Heading>
        <Paragraph>
          The Website may provide access to Third-Party Service. Your access and use of the
          Third-Party Services may also be subject to additional terms and conditions, privacy
          policies, or other agreements with such third parties. The Company and its Affiliates have
          no control over, and is not responsible for, such Third-Party Services, including the
          accuracy, availability, reliability, or completeness of information shared by or available
          through such Third-Party Services, or the privacy practices and terms and conditions of
          such Third-Party Services. We encourage you to review the privacy policies of the third
          parties providing such Third-Party Services prior to using such services. You, and not the
          Company, will be responsible for any and all costs and charges associated with your use of
          any Third-Party Services. The integration or inclusion of such Third-Party Services does
          not constitute or imply any endorsement or recommendation. Any dealings you have with
          third parties while using the Services are between you and the third party. The Company
          will not be responsible or liable, directly or indirectly, for any damage or loss caused
          or alleged to be caused by or in connection with use of or reliance on any Third-Party
          Services.
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: 'User Content',
    content: (
      <Wrapper>
        <Heading>XII. USER CONTENT</Heading>
        <Paragraph>
          You represent and warrant that you own all right, title, and interest in and to your User
          Content, including all copyrights and rights of publicity contained therein. You assume
          all risk associated with your User Content and the transmission of your User Content, and
          you have sole responsibility for the accuracy, quality, legality, and appropriateness of
          your User Content. If you provide us with any Feedback, you hereby assign to the Company
          all rights in such Feedback and agree that the Company shall have the right to use such
          Feedback and related information in any manner it deems appropriate. The Company will
          treat any Feedback you provide to us as non-confidential and non-proprietary. You agree
          that you will not submit to us any Feedback or other information or ideas that you
          consider to be confidential or proprietary for which you do not have all required
          permissions and consents to so submit.
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: 'Assignment',
    content: (
      <Wrapper>
        <Heading>XIII. ASSIGNMENT</Heading>
        <Paragraph>
          You may not assign, transfer, or otherwise delegate your rights or obligations under these
          Terms without the prior written consent of the Company. Any attempted assignment in
          violation of this clause will be null and void. The Company reserves the right to assign
          or transfer its rights and obligations under these Terms, in whole or in part, to any
          third party without notice to or consent from the Participant.
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: 'Entire Agreement',
    content: (
      <Wrapper>
        <Heading>XIV. ENTIRE AGREEMENT</Heading>
        <Paragraph>
          These Terms contain the entire agreement between you and the Company regarding the
          Services and the Airdrop and supersede all prior and contemporaneous understandings
          between the Participant and the Company or any Affiliate regarding the Services or the
          Airdrop.
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: 'Amendments',
    content: (
      <Wrapper>
        <Heading>XV. AMENDMENTST</Heading>
        <Paragraph>
          {`We may modify these Terms for any reason, at our sole discretion, from time to time in
          which case we will update the "Last Revised" date at the top of these Terms. The updated
          Terms will be effective as of the time of posting, or such later date as may be specified
          in the updated Terms. Your use of the Services or participation in the Airdrop after the
          modifications have become effective will be deemed your acceptance of the new Terms. If
          you do not agree with the Terms, you will not access, browse, or use or continue to
          access, browse, or use the Airdrop Website or the Services. You agree that the Company and
          its Affiliates shall not be liable to you or any third-party as a result of any losses
          suffered by or modification or amendment to these Terms.`}
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: 'Severability',
    content: (
      <Wrapper>
        <Heading>XVI. SEVERABILITY</Heading>
        <Paragraph>
          If any term, clause, or provision of these Terms is held to be illegal, invalid, void, or
          unenforceable (in whole or in part), then such term, clause, or provision shall be
          severable from the Terms without affecting the validity or enforceability of any remaining
          part of that term, clause, or provision, or any other term, clause, or provision in the
          Terms, which will otherwise remain in full force and effect. Any invalid or unenforceable
          provisions will be interpreted to affect the intent of the original provisions. If such
          construction is not possible, the invalid or unenforceable provision will be severed from
          these Terms, but the rest of these Terms will remain in full force and effect.
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: 'Risk Factors',
    content: (
      <Wrapper>
        <Heading>XVII. RISK FACTORS</Heading>
        <Paragraph>
          Claiming, using, transacting in, holding, and/or purchasing or selling the Tokens involves
          a high degree of risk, including unforeseen risks that may not be included below. You
          should consult with your legal, tax, and financial advisors and carefully consider the
          risks and uncertainties described below, together with all other information in these
          Terms, before deciding whether to claim, use, transact in, hold, purchase, or sell the
          Tokens. If any of the below risks were to occur, the Token or Protocol could be materially
          and adversely affected. You agree and acknowledge that your participation in the Airdrop
          is at your own risk. You expressly agree that you assume all risks in connection with your
          access to and use or attempted use of the Services and the Airdrop, including, but not
          limited to the risks described below. You agree and acknowledge that you have carefully
          reviewed, read, and understood the Risk Factors below.
        </Paragraph>
        <Paragraph>Risks Relating to the Protocol</Paragraph>
        <List items={protocolRisks} />
        <Paragraph>Risks Relating to the Token</Paragraph>
        <List items={tokenRisks} />
        <Paragraph>Risks Related to Legal and Regulatory</Paragraph>
        <List items={legalAndRegulatoryRisks} />
        <Paragraph>Operational Risks</Paragraph>
        <List items={operationalRisks} />
        <Paragraph>Assumption of risks</Paragraph>
        <Paragraph>
          You expressly agree that you assume all risks in connection with your access and use of
          the Services and the Airdrop, including, but not limited to the risk factors described
          above and the following:
        </Paragraph>
        <List items={assumptionOfRisks} />
        <Paragraph>
          YOU ACKNOWLEDGE THAT THE COMPANY AND ITS AFFILIATES ARE NOT RESPONSIBLE FOR ANY OF THESE
          VARIABLES OR RISKS AND CANNOT BE HELD LIABLE FOR ANY RESULTING LOSSES THAT YOU EXPERIENCE,
          INCLUDING LOSSES YOU EXPERIENCE WHILE ACCESSING OR USING THE AIRDROP OR THE SERVICES AND
          DENY ANY OBLIGATIONS TO INDEMNIFY OR HOLD YOU HARMLESS FOR ANY LOSSES. ACCORDINGLY, YOU
          UNDERSTAND AND AGREE TO ASSUME FULL RESPONSIBILITY FOR ALL THE RISKS OF ACCESSING AND
          USING THE AIRDROP AND THE SERVICES.
        </Paragraph>
      </Wrapper>
    ),
  },
  {
    label: 'Contact Information',
    content: (
      <Wrapper>
        <Heading>XVIII. CONTACT INFORMATION</Heading>
        <Paragraph>
          You may contact us regarding the Services, the Airdrop or these Terms by e-mail at
          info@lazysummerfoundation.com.
        </Paragraph>
      </Wrapper>
    ),
  },
]
