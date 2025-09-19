const getApiVersion = (version?: 'v1' | 'v2') => {
  if (version) {
    // validate version with regex
    if (!/^v[1-2]$/.test(version)) {
      throw new Error('Invalid version format. Expected "v1" or "v2".')
    }
    return version
  }
  // Dynamically import package.json to get the version
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageFile = require('../../bundle/package.json')
  return `v${packageFile.version.charAt(0)}`
}

export { getApiVersion }
