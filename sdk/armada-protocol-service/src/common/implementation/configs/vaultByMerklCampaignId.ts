import type { ChainId, AddressValue } from '@summerfi/sdk-common'
// parsed with
// Object.fromEntries(d.map(c => ([c.campaignId, {chainId: c.computeChainId,fleetAddress: c.params.vaultAddress?.toLowerCase() || c.params.targetToken?.toLowerCase()}])))
const vaultsByCampaignId: Record<string, { chainId: ChainId; fleetAddress: AddressValue }> = {
  '4750370497051111624': {
    chainId: 42161,
    fleetAddress: '0xb1a851b8c70a4749408754d398702153a61dfc78',
  },
  '0x4242d091559422e460fa5ecc9e69bd0a9118ab22901756981cfc63cc3ef483a7': {
    chainId: 8453,
    fleetAddress: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
  },
  '4665638834234154336': {
    chainId: 8453,
    fleetAddress: '0xb1a851b8c70a4749408754d398702153a61dfc78',
  },
  '4597408534685042831': {
    chainId: 1,
    fleetAddress: '0xdf8dfc3c051c88e62bb5d81819f312f15d5414a1',
  },
  '0x726b675e5381e42f321c499b8e5bfd3c7a04edb89bdaafc027228829228a8444': {
    chainId: 8453,
    fleetAddress: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
  },
  '0xf3f4b21c4a3397148f77355047011bcf3ae97e85a4de02a00d141f72a60acf6a': {
    chainId: 8453,
    fleetAddress: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af',
  },
  '428494664685285825': {
    chainId: 1,
    fleetAddress: '0x7a49e6c6c64b32b7e89bd9c0de121165977c422d',
  },
  '1936160081885606219': {
    chainId: 8453,
    fleetAddress: '0x7a49e6c6c64b32b7e89bd9c0de121165977c422d',
  },
  '0xc8a50ce913838a3d7651c11777fe6bcfa01d12f28a80c5ace1c956321554708a': {
    chainId: 42161,
    fleetAddress: '0x4f63cfea7458221cb3a0eee2f31f7424ad34bb58',
  },
  '0xdde5191a70cdf006d1b37ec526bc4d20c4d806612c42ea0060d9e1dc188585c6': {
    chainId: 1,
    fleetAddress: '0x2e6abcbcced9af05bc3b8a4908e0c98c29a88e10',
  },
  '0x738289d6e153b8ac3ae284c2f17eb5c8c7c8386c968b5cb6a52e9768ac19113e': {
    chainId: 1,
    fleetAddress: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
  },
  '10565144708732355975': {
    chainId: 8453,
    fleetAddress: '0xdf8dfc3c051c88e62bb5d81819f312f15d5414a1',
  },
  '8730067419425724421': {
    chainId: 42161,
    fleetAddress: '0x8dca3e548c8b80c93ee8404cfc3ca46010c81679',
  },
  '0x9bd792a717a5eb880d4cdee0fe570cfc45662f9a3c873c3fe7568b690b98b106': {
    chainId: 42161,
    fleetAddress: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
  },
  '1056369275858719998': {
    chainId: 146,
    fleetAddress: '0x322bba211f7160bf1f220da08abbea76d7f4b578',
  },
  '0x2c6ad88e62bab15f13ea90a58b42094db8cdc2a4cd55b87f7531c2ecab189dec': {
    chainId: 146,
    fleetAddress: '0x507a2d9e87dbd3076e65992049c41270b47964f8',
  },
  '9182768833879779011': {
    chainId: 1,
    fleetAddress: '0xc1768910a0e22a282f1d36725ab2eb29de5334f4',
  },
  '0xd79c56220b553ab269a80462ca168432aba8ecd5b802439b6543dbb1d2ce51cf': {
    chainId: 1,
    fleetAddress: '0x17ee2d03e88b55e762c66c76ec99c3a28a54ad8d',
  },
  '0x7c84024a87871193adb9cb494c0d55980411c47eb6ecedf262f99c671b496d6d': {
    chainId: 1,
    fleetAddress: '0xe9cda459bed6dcfb8ac61cd8ce08e2d52370cb06',
  },
  '0x7b3fea42e10871a09b29a3c8b3fed2404a88c2e785c17a178cd2427aa1af59c6': {
    chainId: 1,
    fleetAddress: '0x67e536797570b3d8919df052484273815a0ab506',
  },
  '0xc3f519a3f54b556215111fbe97295d3686be84f26bd29bcaff7e633e533d1354': {
    chainId: 1,
    fleetAddress: '0x2E6abcbCCeD9Af05bc3B8a4908e0c98c29A88e10',
  },
  '0xaaa23594002c0fe9baa69eef0f35658d04f869abf375595a4f090115b5361167': {
    chainId: 1,
    fleetAddress: '0xE9cDA459bED6dcfb8AC61CD8cE08E2D52370cB06',
  },
  '0x01342ce9875958fc68ef017eb17140491afb6f812adfb7cf5bad724d641bccae': {
    chainId: 8453,
    fleetAddress: '0x98C49e13bf99D7CAd8069faa2A370933EC9EcF17',
  },
  '0x30cca5843f153f8d404eca2e4592687e8b0042d9f58ceb0872485f08abfb9f86': {
    chainId: 42161,
    fleetAddress: '0x71d77C39dB0eB5d086611a2e950198E3077cf58A',
  },
  '0x25ee22938dd5d865548c83aa8e029e118c7afac9db7657b4d41ee34e40e4e94f': {
    chainId: 1,
    fleetAddress: '0x98C49e13bf99D7CAd8069faa2A370933EC9EcF17',
  },
  '0xc79f1545343e34cf632a9e7a9714cd188ded014fc7b0fefc1a7f1ebb4be6fe7b': {
    chainId: 8453,
    fleetAddress: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
  },
}

export function getVaultByMerklCampaignId(
  campaignId: string,
): { chainId: ChainId; fleetAddress: AddressValue } | undefined {
  const vault = vaultsByCampaignId[campaignId]

  return vault
}
