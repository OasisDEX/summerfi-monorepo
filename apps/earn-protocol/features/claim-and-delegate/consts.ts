import { formatAddress, isValidLink } from '@summerfi/app-utils'

import { type SumrDecayFactorData } from '@/app/server-handlers/sumr-decay-factor'
import { type SumrDelegates } from '@/app/server-handlers/sumr-delegates'

interface SumrDelegate {
  sumrAmount: number
  ens: string
  address: string
  title: string
  description: string
  social: {
    linkedin: string | undefined
    x: string | undefined
    link: string | undefined
    etherscan: string | undefined
  }
  picture: string | undefined
}

export interface SumrDelegateWithDecayFactor extends SumrDelegate {
  decayFactor: number
}

export const localSumrDelegates: SumrDelegateWithDecayFactor[] = [
  {
    ens: '',
    title: 'MMOFO',
    address: '0x85B872Ce8532FA7C5B50653862757280321b94b8',
    description: 'Long time defi enthusiast, here to make gains.',
    social: {
      link: 'https://forum.summer.fi/t/mmofo-delegate-statement/42',
      x: undefined,
      linkedin: undefined,
      etherscan: 'https://basescan.org/address/0x85B872Ce8532FA7C5B50653862757280321b94b8',
    },
    sumrAmount: 0,
    decayFactor: 1,
    picture: undefined,
  },
  {
    title: 'StableLab.eth',
    ens: 'base.stablelab.eth',
    address: '0xeD9d0A8e0f2e588160fd219B70b846d0f32c7513',
    description:
      'StableLab is a governance firm focused on professional delegation, DAO framework design, and data analytics. StableLab supports DAOs on their journey to improve operations and decentralization.',
    social: {
      link: 'https://forum.summer.fi/t/stablelab-delegate-statement/47',
      x: 'https://x.com/Stablelab',
      linkedin: undefined,
      etherscan: 'https://basescan.org/address/0xeD9d0A8e0f2e588160fd219B70b846d0f32c7513',
    },
    sumrAmount: 0,
    decayFactor: 1,
    picture: undefined,
  },
  {
    ens: '',
    title: 'IDMW - FBrinkkemper',
    address: '0xC8BC108777f5b11Bf2C6Ad28fd1a7D42eFe734fF',
    description:
      'Delegate to me to focus on sustainable protocol growth, minimal governance, maximum TVL. Value creation should come first, revenue should come later.',
    social: {
      link: 'https://forum.summer.fi/t/idmw-fbrinkkemper-delegate-statement/43',
      x: ' https://x.com/FBrinkkemper',
      etherscan: 'https://basescan.org/address/0xC8BC108777f5b11Bf2C6Ad28fd1a7D42eFe734fF',
      linkedin: undefined,
    },
    sumrAmount: 0,
    decayFactor: 1,
    picture: undefined,
  },
  {
    ens: '',
    title: 'MasterMojo',
    address: '0xF68D2BfCecd7895BBa05a7451Dd09A1749026454',
    description:
      'I have been in the trenches of crypto since 2017, and been in DEFI since 2020. I am an Optimism Superchain DEFI Power User (Base, Mode, Optimism, Inkchain, etc). I like to trade Perps and Options onchain, and love LPing at Velodrome/Aerodrome.',
    social: {
      link: 'https://forum.summer.fi/t/mastermojo-delegate-statement/45/1',
      x: 'https://x.com/mastermojo83',
      etherscan: 'https://basescan.org/address/0xF68D2BfCecd7895BBa05a7451Dd09A1749026454',
      linkedin: undefined,
    },
    sumrAmount: 0,
    decayFactor: 1,
    picture: undefined,
  },
  {
    ens: '',
    title: 'mattgov',
    address: '0x1f4BA000D042cA0045eF094691615f3912DebEa8',
    description:
      'My focus is on ensuring governance contributes to growth rather than stifling it. I aim to establish proper processes to foster protocol growth, maximize TVL and value creation, and ensure sustainable scaling in the long term. ',
    social: {
      link: 'https://forum.summer.fi/t/mattgov-delegate-statement/50',
      x: 'https://x.com/MattLGov',
      etherscan: 'https://basescan.org/address/0x1f4BA000D042cA0045eF094691615f3912DebEa8',
      linkedin: undefined,
    },
    sumrAmount: 0,
    decayFactor: 1,
    picture: undefined,
  },
]

export function mergeDelegatesData(
  sumrDelegates: SumrDelegates[],
  sumrDecayFactors: SumrDecayFactorData[],
): SumrDelegateWithDecayFactor[] {
  const mergedDelegates = new Map<string, SumrDelegateWithDecayFactor>()

  // First add all local delegates to the map
  localSumrDelegates.forEach((delegate) => {
    mergedDelegates.set(delegate.address.toLowerCase(), delegate)
  })

  // Process delegates from sumrDelegates, overwriting local values if they exist
  sumrDelegates.forEach((sumrDelegate) => {
    const normalizedAddress = sumrDelegate.account.address.toLowerCase()
    const localDelegate = mergedDelegates.get(normalizedAddress)
    const decayFactor =
      sumrDecayFactors.find((factor) => factor.address.toLowerCase() === normalizedAddress)
        ?.decayFactor ?? 1

    mergedDelegates.set(normalizedAddress, {
      // eslint-disable-next-line no-mixed-operators
      sumrAmount: Number(sumrDelegate.votesCount) / 10 ** 18,
      ens: sumrDelegate.account.ens || localDelegate?.ens || '',
      address: sumrDelegate.account.address,
      title:
        sumrDelegate.account.name ||
        localDelegate?.title ||
        formatAddress(sumrDelegate.account.address),
      description:
        sumrDelegate.account.bio ||
        sumrDelegate.statement?.statementSummary ||
        '' ||
        localDelegate?.description ||
        'Description not available.',
      social: {
        x: isValidLink(sumrDelegate.account.twitter)
          ? sumrDelegate.account.twitter
          : sumrDelegate.account.twitter
            ? `https://x.com/${sumrDelegate.account.twitter}`
            : localDelegate?.social.x,
        linkedin: localDelegate?.social.linkedin,
        etherscan: `https://basescan.org/address/${sumrDelegate.account.address}`,
        link: localDelegate?.social.link,
      },
      picture: sumrDelegate.account.picture ?? '',
      decayFactor,
    })
  })

  return Array.from(mergedDelegates.values()).sort((a, b) => b.sumrAmount - a.sumrAmount)
}
