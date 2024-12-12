export const arkNameMap: { [key: string]: string } = {
  BufferArk: 'Buffer',
  AaveV3: 'Aave V3',
  CompoundV3: 'Compound V3',
  PendlePt: 'Pendle',
}

// New mapping logic
export const getProtocolLabel = (nameParts: string[]) => {
  const cleanedName = nameParts.slice(0, -1).join('-')

  const [baseName, ...remainingParts] = cleanedName.split('-')

  if (baseName === 'MetaMorpho' || baseName === 'MorphoVault') {
    const nameWithoutPrefix = remainingParts.join(' ').replace(/_/gu, ' ')

    return `Morpho ${nameWithoutPrefix.split(' ').slice(1).join(' ')}`
  } else if (baseName === 'ERC4626') {
    const [secondPart] = remainingParts

    return secondPart.charAt(0).toUpperCase() + secondPart.slice(1)
  }

  return arkNameMap[baseName] ?? baseName
}
