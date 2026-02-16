import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Client() {
  const region = process.env.S3_REGION;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("S3 configuration missing");
  }

  return new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
}

export async function getVerificationUploadUrl(key: string, contentType: string) {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) {
    throw new Error("S3_BUCKET is not configured");
  }

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL;
  const fileUrl = publicBaseUrl ? `${publicBaseUrl}/${key}` : `https://${bucket}.s3.amazonaws.com/${key}`;

  return { uploadUrl, fileUrl };
}
