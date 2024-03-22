// eslint-disable-next-line
const bigintSerializer = (key: any, value: any) =>
  typeof value === 'bigint' ? value.toString() : value

// eslint-disable-next-line
export const serialize = (obj: any) => {
  try {
    const value = JSON.stringify(obj, bigintSerializer)
    return value
  } catch (error) {
    console.log('Serialize error')
  }
}
