import * as path from 'path'
import { readFileSync } from 'fs'
import { GetBucketLocationCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ debug: true, path: path.join(__dirname, '../../../.env') })

const files = process.env.SDK_DISTRIBUTIONS_FILES
if (!files) {
  throw new Error('No SDK_DISTRIBUTIONS_FILES specified')
}

const bucketUrl = process.env.SDK_DISTRIBUTIONS_BASE_URL
if (!bucketUrl) {
  throw new Error('No SDK_DISTRIBUTIONS_BASE_URL specified')
}

async function uploadDistributions(fileNames: string[]) {
  // Create an S3 client to get the bucket location
  const s3Client = new S3()
  const bucketName = bucketUrl?.split('://')[1].split('.')[0]

  // Get the bucket location
  const bucketLocation = await s3Client.send(new GetBucketLocationCommand({ Bucket: bucketName }))
  const bucketRegion = bucketLocation.LocationConstraint
  if (!bucketRegion) {
    throw new Error('Failed to get bucket region')
  }

  // Create an S3 client with the correct region
  const s3ClientWithRegion = new S3({ region: bucketRegion })

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

uploadDistributions(fileNames)
