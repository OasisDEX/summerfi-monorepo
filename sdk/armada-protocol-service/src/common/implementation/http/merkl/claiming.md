DistributorContractAddress per chainId dictionary:

- Base: 0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae
- Ethereum: 0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae
- Arbitrum: 0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae
- Sonic: 0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae

Script to send claim tx

```ts
export const claim = async (chainId: number, signer: JsonRpcSigner) => {
  const { status, data } = await MerklApi('https://api.merkl.xyz')
    .v4.users({ address: signer._address })
    .rewards.get({ query: { chainId: [chainId] } })
  if (status !== 200) throw 'Failed to fetch rewards'

  const users = []
  const tokens = []
  const amounts = []
  const proofs = []

  for (const rewards of data) {
    if (rewards.chain.id !== chainId) continue
    for (const reward of rewards.rewards) {
      users.push(signer._address)
      tokens.push(reward.token.address)
      amounts.push(reward.amount)
      proofs.push(reward.proofs)
    }
  }

  if (tokens.length === 0) throw 'No tokens to claim'

  const contract = Distributor__factory.connect(DISTRIBUTOR_ADDRESS, signer)
  await (await contract.claim(users, tokens, amounts, proofs)).wait()
}
```
