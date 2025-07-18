import * as path from 'path'
import { readFileSync } from 'fs'
import { GetBucketLocationCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3'
import { fileURLToPath } from 'url'

require('@dotenvx/dotenvx').config({ path: ['../../.env', '../.env'], override: true })

const profile = process.env.SDK_PROFILE
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const files = process.env.SDK_DISTRIBUTIONS_FILES
const file = process.env.SDK_NAMED_REFERRALS_FILE
if (!files || !file) {
  throw new Error(
    'Missing SDK_DISTRIBUTIONS_FILES or SDK_NAMED_REFERRALS_FILE environment variable',
  )
}

const bucketUrl = process.env.SDK_DISTRIBUTIONS_BASE_URL
if (!bucketUrl) {
  throw new Error('No SDK_DISTRIBUTIONS_BASE_URL specified')
}

async function uploadToBucket(fileNames: string[]) {
  console.log('starting uploadDistributions')
  // Create an S3 client. If credentials are in the environment, the SDK will use them automatically.
  const s3Client = new S3({ profile })
  const bucketName = bucketUrl?.split('://')[1].split('.')[0]
  console.log('bucketName', bucketName)

  // Get the bucket location
  const bucketLocation = await s3Client.send(new GetBucketLocationCommand({ Bucket: bucketName }))
  const bucketRegion = bucketLocation.LocationConstraint
  if (!bucketRegion) {
    throw new Error('Failed to get bucket region')
  }
  console.log('bucketRegion', bucketRegion)

  // Create an S3 client with the correct region
  const s3ClientWithRegion = new S3({ profile, region: bucketRegion })

  for await (const fileName of fileNames) {
    const filePath = path.join(__dirname, fileName)
    console.log('Uploading file to S3: ', bucketRegion, bucketName)
    console.log(filePath)
    const fileContent = readFileSync(filePath)

    try {
      await s3ClientWithRegion.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: fileContent,
          ContentType: 'application/json',
          ACL: 'public-read', // Make the file publicly readable
        }),
      )
      console.log(' >>> File uploaded successfully')
      console.log(`Public URL: https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`)
    } catch (err) {
      console.error(' >>> Error uploading file:', err)
    }
  }
}

const fileNames = files.split(',').map((file) => file.trim())
fileNames.push(file.trim())

uploadToBucket(fileNames)
