import { Bucket, StackContext } from 'sst/constructs'

export async function addDistributions({ stack }: StackContext) {
  const bucket = new Bucket(stack, 'Distributions', {
    cdk: {
      bucket: {
        publicReadAccess: true, // Ensure the bucket is publicly accessible
        // removalPolicy: RemovalPolicy.DESTROY, // Optional: to clean up the bucket on stack deletion
      },
    },
  })

  const publicUrl = `https://${bucket.bucketName}.s3.${stack.region}.amazonaws.com/`

  return { publicUrl }
}
